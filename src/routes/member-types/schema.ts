export const changeMemberTypeBodySchema = {
  type: 'object',
  properties: {
    discount: { type: 'number' },
    monthPostsLimit: { type: 'number' },
    profilesIds: {
      type: 'array',
      items: { type: 'string', format: 'uuid' },
    },
  },
} as const;
