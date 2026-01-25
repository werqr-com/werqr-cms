import type { Block } from 'payload'

export const DividerBlock: Block = {
  slug: 'divider',
  labels: {
    singular: 'Divider',
    plural: 'Dividers',
  },
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'line',
      options: [
        { label: 'Line', value: 'line' },
        { label: 'Dashed', value: 'dashed' },
        { label: 'Dotted', value: 'dotted' },
        { label: 'Space Only', value: 'space' },
      ],
    },
    {
      name: 'spacing',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
      ],
    },
  ],
}
