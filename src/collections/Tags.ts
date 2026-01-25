import type { CollectionConfig } from 'payload'
import { tenantAccess, tenantCreateAccess, tenantAdminAccess } from '../access'
import { tenantField, populateTenantBeforeChange } from '../fields/tenant'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'createdAt'],
    group: 'Content',
  },
  access: {
    read: tenantAccess,
    create: tenantCreateAccess,
    update: tenantAdminAccess,
    delete: tenantAdminAccess,
  },
  hooks: {
    beforeChange: [populateTenantBeforeChange],
  },
  fields: [
    tenantField(),
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL-friendly identifier',
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
        description: 'Optional description for this tag',
      },
    },
  ],
  timestamps: true,
}
