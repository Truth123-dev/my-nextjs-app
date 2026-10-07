

export type Role = 'owner' | 'admin' | 'finance_manager' | 'viewer';

export type Permission = 
  | 'transactions:read'
  | 'transactions:create'
  | 'transfers:approve'
  | 'members:invite'
  | 'org:delete';

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  owner: ['transactions:read', 'transactions:create', 'transfers:approve', 'members:invite', 'org:delete'],
  admin: ['transactions:read', 'transactions:create', 'transfers:approve', 'members:invite'],
  finance_manager: ['transactions:read', 'transactions:create', 'transfers:approve'],
  viewer: ['transactions:read'],
} as const;