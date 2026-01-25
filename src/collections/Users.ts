import type { Access, CollectionBeforeChangeHook, CollectionConfig, Where } from 'payload'
import { isSuperAdmin, getTenantId } from '../access'
import type { User, Tenant } from '../payload-types'

// Access control functions with proper types
const readAccess: Access = ({ req: { user } }): boolean | Where => {
  if (!user) return false
  if (isSuperAdmin(user as User)) return true

  // Users can always read themselves
  return {
    id: { equals: user.id },
  }
}

const createAccess: Access = ({ req: { user } }): boolean => {
  // Allow creation if no users exist (first user setup)
  // or if user is super-admin
  if (!user) return false
  return isSuperAdmin(user as User)
}

const updateAccess: Access = ({ req: { user } }): boolean | Where => {
  if (!user) return false
  if (isSuperAdmin(user as User)) return true

  return {
    id: { equals: user.id },
  }
}

const deleteAccess: Access = ({ req: { user } }): boolean => {
  return isSuperAdmin(user as User)
}

// Hook to validate and default selectedTenant
const validateSelectedTenant: CollectionBeforeChangeHook = async ({ data, originalDoc }) => {
  if (!data) return data

  // Get the tenants array (from data or originalDoc)
  const tenants: (number | Tenant)[] = data.tenants ?? originalDoc?.tenants ?? []

  if (tenants.length === 0) {
    // No tenants, clear selectedTenant
    data.selectedTenant = null
    return data
  }

  // Get tenant IDs
  const tenantIds = tenants
    .map((t) => getTenantId(t))
    .filter((id): id is number => id != null)

  // If no selectedTenant or it's not in user's tenants, default to first
  const selectedTenantId = getTenantId(data.selectedTenant ?? originalDoc?.selectedTenant)

  if (selectedTenantId == null || !tenantIds.includes(selectedTenantId)) {
    data.selectedTenant = tenantIds[0]
  }

  return data
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'roles', 'tenants', 'createdAt'],
    group: 'Admin',
  },
  auth: true,
  access: {
    read: readAccess,
    create: createAccess,
    update: updateAccess,
    delete: deleteAccess,
  },
  fields: [
    // Email added by default via auth: true

    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['user'],
      required: true,
      saveToJWT: true, // Include in JWT for fast access checks
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
      access: {
        // Only super-admins can change roles
        update: ({ req: { user } }): boolean => isSuperAdmin(user as User),
      },
      admin: {
        description: 'User roles determine access levels across the system',
      },
    },
    {
      name: 'tenants',
      type: 'relationship',
      relationTo: 'tenants',
      hasMany: true,
      saveToJWT: true,
      admin: {
        description: 'Tenants this user belongs to',
        condition: (data, siblingData, { user }): boolean => {
          // Only show to super-admins or admins
          const typedUser = user as User | undefined
          return (
            (typedUser?.roles?.includes('super-admin') || typedUser?.roles?.includes('admin')) ??
            false
          )
        },
      },
      access: {
        // Only super-admins can modify tenant assignments
        update: ({ req: { user } }): boolean => isSuperAdmin(user as User),
      },
    },
    {
      name: 'selectedTenant',
      type: 'relationship',
      relationTo: 'tenants',
      saveToJWT: true, // Critical for access control in API requests
      admin: {
        description: 'Currently active tenant for this user',
        condition: (data): boolean => {
          // Only show if user has multiple tenants
          return Array.isArray(data?.tenants) && data.tenants.length > 1
        },
      },
      // Filter to only show tenants the user belongs to
      filterOptions: ({ data }) => {
        if (!data?.tenants || !Array.isArray(data.tenants)) {
          return { id: { exists: false } } // No options
        }

        const tenantIds = (data.tenants as (number | Tenant)[])
          .map((t) => (typeof t === 'number' ? t : t?.id))
          .filter((id): id is number => id != null)

        return {
          id: { in: tenantIds },
        }
      },
    },
  ],
  hooks: {
    beforeChange: [validateSelectedTenant],
  },
}
