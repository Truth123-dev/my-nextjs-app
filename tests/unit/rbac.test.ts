

import { describe, it, expect } from 'vitest';
import { hasPermission, assertPermission } from '@/lib/auth/rbac';

describe('RBAC Verification Rules', () => {
  it('allows owner to execute any task', () => {
    expect(hasPermission('owner', 'org:delete')).toBe(true);
    expect(hasPermission('owner', 'transactions:create')).toBe(true);
  });

  it('restricts finance_manager from deleting organization', () => {
    expect(hasPermission('finance_manager', 'transactions:create')).toBe(true);
    expect(hasPermission('finance_manager', 'org:delete')).toBe(false);
  });

  it('restricts viewer strictly to read permissions', () => {
    expect(hasPermission('viewer', 'transactions:read')).toBe(true);
    expect(hasPermission('viewer', 'transactions:create')).toBe(false);
    expect(() => assertPermission('viewer', 'transfers:approve')).toThrowError(
      /Insufficient permissions/
    );
  });
});