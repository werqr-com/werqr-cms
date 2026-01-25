import type { CollectionConfig } from 'payload'
import { tenantAccess, tenantCreateAccess, tenantAdminAccess } from '../access'
import { tenantField, populateTenantBeforeChange } from '../fields/tenant'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'postType', 'author', 'isPublished', 'publishedDate'],
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
    // Sidebar fields
    tenantField(),
    {
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Make this post visible to the public',
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
        description: 'When this post should be published',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        description: 'The author of this post',
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

    // Main content area with tabs
    {
      type: 'tabs',
      tabs: [
        // Content Tab - Primary editing
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
                description: 'URL-friendly identifier (e.g., "my-first-post")',
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
              name: 'postType',
              type: 'select',
              required: true,
              defaultValue: 'article',
              options: [
                { label: 'Article', value: 'article' },
                { label: 'Video', value: 'video' },
                { label: 'Audio', value: 'audio' },
                { label: 'Document', value: 'document' },
                { label: 'External Link', value: 'external' },
              ],
            },
            {
              name: 'excerpt',
              type: 'textarea',
              admin: {
                description: 'Short summary for previews and SEO',
              },
            },
            {
              name: 'content',
              type: 'richText',
              admin: {
                description: 'Main content of the post',
              },
            },
          ],
        },

        // Media Tab - Type-specific content
        {
          label: 'Media',
          fields: [
            // Video fields
            {
              name: 'video',
              type: 'group',
              admin: {
                condition: (data) => data?.postType === 'video',
                hideGutter: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'url',
                      type: 'text',
                      admin: {
                        width: '50%',
                        description: 'YouTube, Vimeo, or direct video URL',
                      },
                    },
                    {
                      name: 'duration',
                      type: 'text',
                      admin: {
                        width: '50%',
                        description: 'Duration (e.g., "10:30")',
                      },
                    },
                  ],
                },
                {
                  name: 'file',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Or upload a video file directly',
                  },
                },
              ],
            },

            // Audio fields
            {
              name: 'audio',
              type: 'group',
              admin: {
                condition: (data) => data?.postType === 'audio',
                hideGutter: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'url',
                      type: 'text',
                      admin: {
                        width: '50%',
                        description: 'Spotify, SoundCloud, or direct audio URL',
                      },
                    },
                    {
                      name: 'duration',
                      type: 'text',
                      admin: {
                        width: '50%',
                        description: 'Duration (e.g., "45:00")',
                      },
                    },
                  ],
                },
                {
                  name: 'file',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Or upload an audio file directly',
                  },
                },
              ],
            },

            // Document fields
            {
              name: 'document',
              type: 'group',
              admin: {
                condition: (data) => data?.postType === 'document',
                hideGutter: true,
              },
              fields: [
                {
                  name: 'file',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Upload a document (PDF, DOCX, etc.)',
                  },
                },
                {
                  name: 'downloadable',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Allow users to download this document',
                  },
                },
              ],
            },

            // External link fields
            {
              name: 'external',
              type: 'group',
              admin: {
                condition: (data) => data?.postType === 'external',
                hideGutter: true,
              },
              fields: [
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'External URL to link to',
                  },
                },
                {
                  name: 'openInNewTab',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Open link in a new browser tab',
                  },
                },
              ],
            },

            // Featured images (shown for all types)
            {
              type: 'row',
              fields: [
                {
                  name: 'banner',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    width: '50%',
                    description: 'Large banner image',
                  },
                },
                {
                  name: 'thumbnail',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    width: '50%',
                    description: 'Thumbnail for listings',
                  },
                },
              ],
            },
          ],
        },

        // Custom Fields Tab
        {
          label: 'Custom Fields',
          fields: [
            {
              name: 'customFields',
              type: 'array',
              label: false,
              admin: {
                description: 'Add custom metadata fields to this post',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      admin: {
                        width: '50%',
                        placeholder: 'Field name',
                      },
                    },
                    {
                      name: 'value',
                      type: 'text',
                      required: true,
                      admin: {
                        width: '50%',
                        placeholder: 'Field value',
                      },
                    },
                  ],
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
