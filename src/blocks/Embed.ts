import type { Block } from 'payload'

export const EmbedBlock: Block = {
  slug: 'embed',
  labels: {
    singular: 'Embed',
    plural: 'Embeds',
  },
  fields: [
    {
      name: 'embedType',
      type: 'select',
      required: true,
      defaultValue: 'video',
      options: [
        { label: 'Video (YouTube/Vimeo)', value: 'video' },
        { label: 'Audio (Spotify/SoundCloud)', value: 'audio' },
        { label: 'Social Post', value: 'social' },
        { label: 'Custom HTML', value: 'html' },
      ],
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        condition: (data, siblingData) => siblingData?.embedType !== 'html',
        description: 'Paste the URL of the content to embed',
      },
    },
    {
      name: 'html',
      type: 'code',
      admin: {
        language: 'html',
        condition: (data, siblingData) => siblingData?.embedType === 'html',
        description: 'Custom embed code',
      },
    },
    {
      name: 'aspectRatio',
      type: 'select',
      defaultValue: '16:9',
      admin: {
        condition: (data, siblingData) => siblingData?.embedType === 'video',
      },
      options: [
        { label: '16:9', value: '16:9' },
        { label: '4:3', value: '4:3' },
        { label: '1:1', value: '1:1' },
      ],
    },
  ],
}
