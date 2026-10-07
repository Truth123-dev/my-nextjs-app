

-- 1. Custom Types
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'finance_manager', 'viewer');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'flagged');
CREATE TYPE transaction_type AS ENUM ('credit', 'debit');

-- 2. Organizations & Memberships
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(organization_id, user_id)
);

-- 3. Accounts & Ledger
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
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
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for scale
CREATE INDEX idx_transactions_org_created ON transactions(organization_id, created_at DESC);
CREATE INDEX idx_transactions_search ON transactions USING gin(to_tsvector('english', recipient_name || ' ' || reference));

-- 4. Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 5. Helper Function: Check User Membership
CREATE OR REPLACE FUNCTION current_user_has_role(org_id UUID, allowed_roles user_role[])
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM memberships
        WHERE organization_id = org_id
          AND user_id = auth.uid()
          AND role = ANY(allowed_roles)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER FUNCTION current_user_has_role(UUID, user_role[]) SET search_path = public, pg_temp;

-- Users can only read their own memberships. This also lets the server verify
-- membership without opening cross-tenant membership records.
CREATE POLICY "Users can view their memberships"
    ON memberships FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Members can view organization accounts"
    ON accounts FOR SELECT
    USING (current_user_has_role(organization_id, ARRAY['owner', 'admin', 'finance_manager', 'viewer']::user_role[]));

-- Perform the balance check, debit and ledger insert in one transaction.
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

    UPDATE accounts SET balance = balance - p_amount WHERE id = p_account_id;
    INSERT INTO transactions (
        organization_id, account_id, amount, type, status, reference,
        recipient_name, recipient_account, description
    ) VALUES (
        p_org_id, p_account_id, p_amount, 'debit', 'pending', p_reference,
        trim(p_recipient_name), trim(p_recipient_account), nullif(trim(p_description), '')
    ) RETURNING * INTO created_transaction;

    RETURN created_transaction;
END;
$$;

REVOKE ALL ON FUNCTION execute_transfer(UUID, UUID, NUMERIC, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION execute_transfer(UUID, UUID, NUMERIC, TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- 6. Row-Level Security Policies
CREATE POLICY "Users can view orgs they belong to"
    ON organizations FOR SELECT
    USING (EXISTS (SELECT 1 FROM memberships WHERE organization_id = id AND user_id = auth.uid()));

CREATE POLICY "View transactions scoped to role"
    ON transactions FOR SELECT
    USING (current_user_has_role(organization_id, ARRAY['owner', 'admin', 'finance_manager', 'viewer']::user_role[]));

CREATE POLICY "Execute transactions (Owner, Admin, Finance Manager only)"
    ON transactions FOR INSERT
    WITH CHECK (current_user_has_role(organization_id, ARRAY['owner', 'admin', 'finance_manager']::user_role[]));
