import * as crypto from 'node:crypto';
import DBEntity from './DBEntity';

type UserEntity = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileId: string | null;
  userSubscribedTo: string[];
  subscribedToUser: string[];
  postIds: string[];
};
type CreateUserDTO = Omit<
  UserEntity,
  'id' | 'profileId' | 'userSubscribedTo' | 'subscribedToUser' | 'postIds'
>;
type ChangeUserDTO = Partial<Omit<UserEntity, 'id'>>;

export default class DBUsers extends DBEntity<UserEntity, ChangeUserDTO> {
  async create(createUserDTO: CreateUserDTO) {
    const created = {
      ...createUserDTO,
      id: crypto.randomUUID(),
      profileId: null,
      userSubscribedTo: [],
      subscribedToUser: [],
      postIds: [],
    };
    this.entity.push(created);
    return created;
  }
}
