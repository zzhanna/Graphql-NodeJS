import * as crypto from 'node:crypto';
import DBEntity from './DBEntity';
import { MemberId } from './DBMemberTypes';

type ProfileEntity = {
  id: string;
  avatar: string;
  sex: string;
  birthday: number;
  country: string;
  street: string;
  city: string;
  memberType: MemberId;
  userId: string;
};
type CreateProfileDTO = Omit<ProfileEntity, 'id'>;
type ChangeProfileDTO = Partial<Omit<ProfileEntity, 'id' | 'userId'>>;

export default class DBProfiles extends DBEntity<
  ProfileEntity,
  ChangeProfileDTO
> {
  async create(createProfileDTO: CreateProfileDTO) {
    const created = {
      ...createProfileDTO,
      id: crypto.randomUUID(),
    };
    this.entity.push(created);
    return created;
  }
}
