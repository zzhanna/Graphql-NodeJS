export const createPostBodySchema = {
  type: 'object',
  required: ['title', 'content'],
  properties: {
    title: { type: 'string' },
    content: { type: 'string' },
  },
} as const;

export const changePostBodySchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    content: { type: 'string' },
  },
} as const;
