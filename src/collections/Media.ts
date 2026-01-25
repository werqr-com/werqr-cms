import type { CollectionConfig } from 'payload'
import { tenantAccess, tenantCreateAccess, tenantAdminAccess } from '../access'
import { tenantField, populateTenantBeforeChange } from '../fields/tenant'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    defaultColumns: ['filename', 'alt', 'tenant', 'createdAt'],
  },
  access: {
    // Read: Users see only their tenant's media; super-admins see all
    read: tenantAccess,
    // Create: Any authenticated user with a selected tenant
    create: tenantCreateAccess,
    // Update: Only tenant admins or super-admins
    update: tenantAdminAccess,
    // Delete: Only tenant admins or super-admins
    delete: tenantAdminAccess,
  },
  fields: [
    tenantField(),
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  hooks: {
    beforeChange: [
      // Auto-populate tenant from user's selectedTenant on create
      populateTenantBeforeChange,
    ],
  },
  upload: {
    // These are not supported on Workers yet due to lack of sharp
    crop: false,
    focalPoint: false,
  },
}
