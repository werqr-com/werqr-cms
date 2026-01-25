import type { CollectionConfig } from 'payload'
import { tenantAccess, tenantCreateAccess, tenantAdminAccess } from '../access'
import { tenantField, populateTenantBeforeChange } from '../fields/tenant'

export const Biographies: CollectionConfig = {
  slug: 'biographies',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'surname', 'title', 'location'],
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
    // Sidebar
    tenantField(),
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Tags for categorization',
      },
    },

    // Main content
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'surname',
          type: 'text',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            width: '50%',
            description: 'Job title or role',
          },
        },
        {
          name: 'location',
          type: 'text',
          admin: {
            width: '50%',
            description: 'City, country, or region',
          },
        },
      ],
    },
    {
      name: 'bio',
      type: 'richText',
      admin: {
        description: 'Biography or about text',
      },
    },
    {
      name: 'socials',
      type: 'array',
      admin: {
        description: 'Social media links',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              type: 'select',
              required: true,
              admin: {
                width: '33%',
              },
              options: [
                { label: 'Website', value: 'website' },
                { label: 'Email', value: 'email' },
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'Twitter / X', value: 'twitter' },
                { label: 'Facebook', value: 'facebook' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'TikTok', value: 'tiktok' },
                { label: 'GitHub', value: 'github' },
                { label: 'Dribbble', value: 'dribbble' },
                { label: 'Behance', value: 'behance' },
                { label: 'Other', value: 'other' },
              ],
            },
            {
              name: 'label',
              type: 'text',
              admin: {
                width: '33%',
                placeholder: 'Display label (optional)',
              },
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              admin: {
                width: '33%',
                placeholder: 'https://...',
              },
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
