export const graphqlBodySchema = {
  type: 'object',
  required: ['query'],
  properties: {
    query: { type: 'string' },
    variables: {
      type: 'object',
    },
  },
  additionalProperties: false,
} as const;
