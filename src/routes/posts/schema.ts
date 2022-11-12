export const createPostBodySchema = {
  type: 'object',
  required: ['title', 'content', 'userId'],
  properties: {
    title: { type: 'string' },
    content: { type: 'string' },
    userId: { type: 'string' },
  },
  additionalProperties: false,
} as const;

export const changePostBodySchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    content: { type: 'string' },
  },
  additionalProperties: false,
} as const;
