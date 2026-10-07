


CREATE OR REPLACE FUNCTION get_organization_analytics(p_org_id UUID)
RETURNS TABLE (
  currency VARCHAR(3),
  transaction_count BIGINT,
  credits_total NUMERIC,
  debits_total NUMERIC,
  pending_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '28000';
  END IF;
  IF NOT current_user_has_role(p_org_id, ARRAY['owner', 'admin', 'finance_manager', 'viewer']::user_role[]) THEN
    RAISE EXCEPTION 'Organization access denied' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT
    a.currency,
    count(t.id)::BIGINT,
    coalesce(sum(t.amount) FILTER (WHERE t.type = 'credit'), 0)::NUMERIC,
    coalesce(sum(t.amount) FILTER (WHERE t.type = 'debit'), 0)::NUMERIC,
    count(t.id) FILTER (WHERE t.status = 'pending')::BIGINT
  FROM accounts AS a
  LEFT JOIN transactions AS t
    ON t.account_id = a.id
   AND t.organization_id = p_org_id
  WHERE a.organization_id = p_org_id
  GROUP BY a.currency
  ORDER BY a.currency;
END;
$$;

REVOKE ALL ON FUNCTION get_organization_analytics(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_organization_analytics(UUID) TO authenticated;