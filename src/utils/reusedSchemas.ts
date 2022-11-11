export const idParamSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
  },
} as const;

export const idsQuerystringSchema = {
  type: 'object',
  properties: {
    ids: {
      type: 'array',
      items: { type: 'string' },
    },
  },
} as const;
