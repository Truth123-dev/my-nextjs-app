

import { Role, Permission, ROLE_PERMISSIONS } from '@/types/rbac';

export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions ? permissions.includes(permission) : false;
}

export function assertPermission(role: Role, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Unauthorized: Insufficient permissions (${permission})`);
  }
}