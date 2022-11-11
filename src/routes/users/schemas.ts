export const createUserBodySchema = {
  type: 'object',
  required: ['firstName', 'lastName', 'email'],
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string' },
  },
} as const;

export const changeUserBodySchema = {
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string' },
    profileId: { type: 'string', format: 'uuid' },
    userSubscribedTo: {
      type: 'array',
      items: { type: 'string', format: 'uuid' },
    },
    subscribedToUser: {
      type: 'array',
      items: { type: 'string', format: 'uuid' },
    },
    postIds: {
      type: 'array',
      items: { type: 'string', format: 'uuid' },
    },
  },
} as const;
