import type { Access, FieldAccess, Where } from 'payload'
import type { User, Tenant } from '../payload-types'

/**
 * Extract tenant ID from a tenant field value (handles both populated and unpopulated)
 */
export const getTenantId = (
  tenant: number | Tenant | null | undefined,
): number | null => {
  if (tenant == null) return null
  return typeof tenant === 'number' ? tenant : tenant.id
}

/**
 * Check if user has super-admin role
 */
export const isSuperAdmin = (user: User | null | undefined): boolean => {
  return user?.roles?.includes('super-admin') ?? false
}

/**
 * Check if user has admin role (includes super-admin)
 */
export const isAdmin = (user: User | null | undefined): boolean => {
  if (!user?.roles) return false
  return user.roles.includes('super-admin') || user.roles.includes('admin')
}

/**
 * Check if user belongs to a specific tenant
 */
export const userBelongsToTenant = (
  user: User | null | undefined,
  tenantId: number,
): boolean => {
  if (!user?.tenants) return false
  return user.tenants.some((t) => getTenantId(t) === tenantId)
}

/**
 * Collection-level access: Filter by user's selected tenant
 * Super-admins bypass tenant filtering
 */
export const tenantAccess: Access = ({ req: { user } }): boolean | Where => {
  if (!user) return false

  // Super-admins can access all tenants
  if (isSuperAdmin(user as User)) return true

  const selectedTenantId = getTenantId((user as User).selectedTenant)

  // If no tenant selected, deny access
  if (selectedTenantId == null) return false

  // Return query constraint to filter by tenant
  return {
    tenant: {
      equals: selectedTenantId,
    },
  }
}

/**
 * Collection-level access for create operations
 * Ensures user has a selected tenant
 */
export const tenantCreateAccess: Access = ({ req: { user } }): boolean => {
  if (!user) return false

  // Super-admins can always create
  if (isSuperAdmin(user as User)) return true

  // Regular users need a selected tenant
  const selectedTenantId = getTenantId((user as User).selectedTenant)
  return selectedTenantId != null
}

/**
 * Collection-level access for admin operations (update/delete)
 * Only admins of the tenant can perform these operations
 */
export const tenantAdminAccess: Access = ({ req: { user } }): boolean | Where => {
  if (!user) return false

  // Super-admins can do anything
  if (isSuperAdmin(user as User)) return true

  // Must be an admin
  if (!isAdmin(user as User)) return false

  const selectedTenantId = getTenantId((user as User).selectedTenant)
  if (selectedTenantId == null) return false

  // Return query constraint
  return {
    tenant: {
      equals: selectedTenantId,
    },
  }
}

/**
 * Field-level access: Prevent non-super-admins from changing tenant field
 */
export const tenantFieldAccess: FieldAccess = ({ req: { user } }): boolean => {
  // Super-admins can change tenant field
  return isSuperAdmin(user as User)
}

/**
 * Access for Tenants collection: Read access
 * Users can only read tenants they belong to
 */
export const tenantsReadAccess: Access = ({ req: { user } }): boolean | Where => {
  if (!user) return false

  // Super-admins can read all tenants
  if (isSuperAdmin(user as User)) return true

  const userTenants = (user as User).tenants
  if (!userTenants || userTenants.length === 0) return false

  // Return query to filter to user's tenants
  const tenantIds = userTenants.map((t) => getTenantId(t)).filter((id): id is number => id != null)

  return {
    id: {
      in: tenantIds,
    },
  }
}

/**
 * Access for Tenants collection: Create/Delete (super-admin only)
 */
export const superAdminAccess: Access = ({ req: { user } }): boolean => {
  return isSuperAdmin(user as User)
}

/**
 * Access for Tenants collection: Update
 * Super-admins or tenant admins can update
 */
export const tenantUpdateAccess: Access = ({ req: { user }, id }): boolean => {
  if (!user) return false

  // Super-admins can update any tenant
  if (isSuperAdmin(user as User)) return true

  // Admins can update tenants they belong to
  if (!isAdmin(user as User)) return false

  // Check if user belongs to this tenant
  if (id != null && userBelongsToTenant(user as User, id as number)) {
    return true
  }

  return false
}
