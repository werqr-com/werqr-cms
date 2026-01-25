import type { Block } from 'payload'

export const CallToActionBlock: Block = {
  slug: 'cta',
  labels: {
    singular: 'Call to Action',
    plural: 'Call to Actions',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'buttons',
      type: 'array',
      minRows: 1,
      maxRows: 2,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'link',
              type: 'text',
              required: true,
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
          ],
        },
      ],
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Centered', value: 'centered' },
        { label: 'With Background', value: 'background' },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'text',
      admin: {
        condition: (data, siblingData) => siblingData?.style === 'background',
        description: 'CSS color value (e.g., #f5f5f5, rgb(0,0,0))',
      },
    },
  ],
}
