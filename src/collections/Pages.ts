import type { CollectionConfig } from 'payload'
import { tenantAccess, tenantCreateAccess, tenantAdminAccess } from '../access'
import { tenantField, populateTenantBeforeChange } from '../fields/tenant'
import { blocks } from '../blocks'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
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
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        position: 'sidebar',
        description: 'Parent page for nested navigation',
      },
      filterOptions: ({ id }) => {
        // Prevent selecting self as parent
        if (id) {
          return { id: { not_equals: id } }
        }
        return {}
      },
    },

    // Main content
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
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
                description: 'URL path for this page (e.g., "about-us")',
              },
              validate: (value: string | null | undefined) => {
                if (!value) return 'Slug is required'
                if (!/^[a-z0-9-/]+$/.test(value)) {
                  return 'Slug must only contain lowercase letters, numbers, hyphens, and forward slashes'
                }
                return true
              },
            },
            {
              name: 'layout',
              type: 'blocks',
              blocks,
              admin: {
                description: 'Build your page using content blocks',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  admin: {
                    description: 'Custom title for search engines (defaults to page title)',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  admin: {
                    description: 'Meta description for search engines',
                  },
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Social sharing image',
                  },
                },
                {
                  name: 'noIndex',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Prevent search engines from indexing this page',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
