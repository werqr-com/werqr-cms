import type { Block } from 'payload'

export const ColumnsBlock: Block = {
  slug: 'columns',
  labels: {
    singular: 'Columns',
    plural: 'Column Layouts',
  },
  fields: [
    {
      name: 'layout',
      type: 'select',
      required: true,
      defaultValue: '2-equal',
      options: [
        { label: '2 Equal Columns', value: '2-equal' },
        { label: '3 Equal Columns', value: '3-equal' },
        { label: '4 Equal Columns', value: '4-equal' },
        { label: '1/3 + 2/3', value: '1-2' },
        { label: '2/3 + 1/3', value: '2-1' },
        { label: '1/4 + 3/4', value: '1-3' },
        { label: '3/4 + 1/4', value: '3-1' },
      ],
    },
    {
      name: 'columns',
      type: 'array',
      minRows: 2,
      maxRows: 4,
      fields: [
        {
          name: 'content',
          type: 'richText',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'verticalAlign',
      type: 'select',
      defaultValue: 'top',
      options: [
        { label: 'Top', value: 'top' },
        { label: 'Center', value: 'center' },
        { label: 'Bottom', value: 'bottom' },
      ],
    },
  ],
}
