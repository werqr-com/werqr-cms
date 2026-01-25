import type { CollectionBeforeChangeHook, RelationshipField } from 'payload'
import { tenantFieldAccess } from '../access'
import type { User } from '../payload-types'

/**
 * Creates a tenant relationship field for multi-tenant collections.
 *
 * This field:
 * - Links documents to a specific tenant
 * - Is required and indexed for query performance
 * - Is hidden in admin UI (auto-populated from user's selectedTenant)
 * - Can only be manually set by super-admins
 *
 * @example
 * // In your collection config
 * export const Posts: CollectionConfig = {
 *   slug: 'posts',
 *   fields: [
 *     tenantField(),
 *     { name: 'title', type: 'text' },
 *   ],
 * }
 */
export const tenantField = (): RelationshipField => ({
  name: 'tenant',
  type: 'relationship',
  relationTo: 'tenants',
  required: true,
  index: true,
  admin: {
    position: 'sidebar',
    // Only super-admins can see and change the tenant field
    condition: (data, siblingData, { user }): boolean => {
      return (user as User | undefined)?.roles?.includes('super-admin') ?? false
    },
  },
  access: {
    // Only super-admins can manually update the tenant field
    update: tenantFieldAccess,
  },
})

/**
 * Hook to auto-populate tenant from user's selectedTenant on create
 */
export const populateTenantBeforeChange: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  if (!data) return data

  // Only auto-populate on create if tenant not already set
  if (operation === 'create' && data.tenant == null) {
    const user = req.user as User | undefined
    const selectedTenant = user?.selectedTenant
    if (selectedTenant != null) {
      data.tenant = typeof selectedTenant === 'number' ? selectedTenant : selectedTenant.id
    }
  }

  return data
}
