import type { CollectionConfig } from 'payload'
import { superAdminAccess, tenantsReadAccess, tenantUpdateAccess } from '../access'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'createdAt'],
    group: 'Admin',
  },
  access: {
    // Users can only read tenants they belong to; super-admins see all
    read: tenantsReadAccess,
    // Only super-admins can create new tenants
    create: superAdminAccess,
    // Super-admins or tenant admins can update
    update: tenantUpdateAccess,
    // Only super-admins can delete tenants
    delete: superAdminAccess,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'The display name of the tenant/organization',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL-friendly identifier (e.g., "acme-corp")',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return 'Slug is required'
        if (!/^[a-z0-9-]+$/.test(value)) {
          return 'Slug must only contain lowercase letters, numbers, and hyphens'
        }
        return true
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description of the tenant/organization',
      },
    },
  ],
  timestamps: true,
}
