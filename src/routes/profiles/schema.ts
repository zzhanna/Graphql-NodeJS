import { MemberId } from '../../utils/DB/entities/DBMemberTypes';

export const createProfileBodySchema = {
  type: 'object',
  required: [
    'avatar',
    'sex',
    'birthday',
    'country',
    'street',
    'city',
    'memberType',
    'userId',
  ],
  properties: {
    avatar: { type: 'string' },
    sex: { type: 'string' },
    birthday: { type: 'number' },
    country: { type: 'string' },
    street: { type: 'string' },
    city: { type: 'string' },
    memberType: {
      type: 'string',
      enum: [MemberId.basic, MemberId.business],
    },
    userId: { type: 'string', format: 'uuid' },
  },
} as const;

export const changeProfileBodySchema = {
  type: 'object',
  properties: {
    avatar: { type: 'string' },
    sex: { type: 'string' },
    birthday: { type: 'number' },
    country: { type: 'string' },
    street: { type: 'string' },
    city: { type: 'string' },
    memberType: {
      type: 'string',
      enum: [MemberId.basic, MemberId.business],
    },
  },
} as const;
