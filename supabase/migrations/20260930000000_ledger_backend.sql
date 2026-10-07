CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_role AS ENUM ('owner', 'admin', 'finance_manager', 'viewer');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'flagged');
CREATE TYPE transaction_type AS ENUM ('credit', 'debit');

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id)
);

CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  type transaction_type NOT NULL,
  status transaction_status NOT NULL DEFAULT 'pending',
  reference TEXT NOT NULL UNIQUE,
  recipient_name TEXT NOT NULL,
  recipient_account TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_transactions_org_created
  ON transactions (organization_id, created_at DESC);
CREATE INDEX idx_transactions_search
  ON transactions USING gin (to_tsvector('english', recipient_name || ' ' || reference));

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION current_user_has_role(org_id UUID, allowed_roles user_role[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM memberships
    WHERE organization_id = org_id
      AND user_id = auth.uid()
      AND role = ANY (allowed_roles)
  );
$$;

CREATE POLICY "Users can view their memberships"
  ON memberships FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view organizations they belong to"
  ON organizations FOR SELECT
  USING (current_user_has_role(id, ARRAY['owner', 'admin', 'finance_manager', 'viewer']::user_role[]));

CREATE POLICY "Members can view organization accounts"
  ON accounts FOR SELECT
  USING (current_user_has_role(organization_id, ARRAY['owner', 'admin', 'finance_manager', 'viewer']::user_role[]));

CREATE POLICY "Members can view organization transactions"
  ON transactions FOR SELECT
  USING (current_user_has_role(organization_id, ARRAY['owner', 'admin', 'finance_manager', 'viewer']::user_role[]));

CREATE POLICY "Authorized members can insert transactions"
  ON transactions FOR INSERT
  WITH CHECK (current_user_has_role(organization_id, ARRAY['owner', 'admin', 'finance_manager']::user_role[]));

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON organizations, memberships, accounts, transactions TO authenticated;

CREATE OR REPLACE FUNCTION create_organization(p_name TEXT)
RETURNS organizations
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  current_user_id UUID := auth.uid();
  organization_row organizations%ROWTYPE;
  organization_slug TEXT;
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '28000';
  END IF;
  IF p_name IS NULL OR length(trim(p_name)) < 2 OR length(trim(p_name)) > 100 THEN
    RAISE EXCEPTION 'Organization name must be between 2 and 100 characters' USING ERRCODE = '22023';
  END IF;

  organization_slug := trim(both '-' from regexp_replace(lower(trim(p_name)), '[^a-z0-9]+', '-', 'g'));
  IF organization_slug = '' THEN
    RAISE EXCEPTION 'Organization name must contain letters or numbers' USING ERRCODE = '22023';
  END IF;
  IF EXISTS (SELECT 1 FROM organizations WHERE slug = organization_slug) THEN
    organization_slug := organization_slug || '-' || left(replace(gen_random_uuid()::TEXT, '-', ''), 8);
  END IF;

  INSERT INTO organizations (name, slug)
  VALUES (trim(p_name), organization_slug)
  RETURNING * INTO organization_row;

  INSERT INTO memberships (organization_id, user_id, role)
  VALUES (organization_row.id, current_user_id, 'owner');

  INSERT INTO accounts (organization_id, currency, balance)
  VALUES (organization_row.id, 'USD', 0.00);

  RETURN organization_row;
END;
$$;

REVOKE ALL ON FUNCTION create_organization(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION create_organization(TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION execute_transfer(
  p_org_id UUID,
  p_account_id UUID,
  p_amount NUMERIC,
  p_recipient_name TEXT,
  p_recipient_account TEXT,
  p_description TEXT,
  p_reference TEXT
)
RETURNS transactions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  locked_account accounts%ROWTYPE;
  created_transaction transactions%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '28000';
  END IF;
  IF NOT current_user_has_role(p_org_id, ARRAY['owner', 'admin', 'finance_manager']::user_role[]) THEN
    RAISE EXCEPTION 'Insufficient permission to create transfers' USING ERRCODE = '42501';
  END IF;
  IF p_amount IS NULL OR p_amount <= 0 OR p_amount > 9999999999999.99 THEN
    RAISE EXCEPTION 'Amount must be positive and within account limits' USING ERRCODE = '22003';
  END IF;
  IF length(trim(p_recipient_name)) < 2 OR length(trim(p_recipient_account)) < 8 THEN
    RAISE EXCEPTION 'Recipient details are invalid' USING ERRCODE = '22023';
  END IF;
  IF length(coalesce(p_description, '')) > 140 OR p_reference IS NULL OR length(p_reference) > 100 THEN
    RAISE EXCEPTION 'Transfer description or reference is invalid' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO locked_account
  FROM accounts
  WHERE id = p_account_id AND organization_id = p_org_id
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Account not found for this organization' USING ERRCODE = 'P0002';
  END IF;
  IF locked_account.balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient funds' USING ERRCODE = '22003';
  END IF;

  UPDATE accounts
  SET balance = balance - p_amount
  WHERE id = p_account_id;

  INSERT INTO transactions (
    organization_id, account_id, amount, type, status, reference,
    recipient_name, recipient_account, description
  ) VALUES (
    p_org_id, p_account_id, p_amount, 'debit', 'pending', p_reference,
    trim(p_recipient_name), trim(p_recipient_account), nullif(trim(coalesce(p_description, '')), '')
  ) RETURNING * INTO created_transaction;

  RETURN created_transaction;
END;
$$;

REVOKE ALL ON FUNCTION execute_transfer(UUID, UUID, NUMERIC, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION execute_transfer(UUID, UUID, NUMERIC, TEXT, TEXT, TEXT, TEXT) TO authenticated;