import DBEntity from './DBEntity';

export enum MemberId {
  'basic' = 'basic',
  'business' = 'business',
}
type MemberTypeEntity = {
  id: MemberId;
  discount: number;
  monthPostsLimit: number;
  profilesIds: string[];
};
type ChangeMemberTypeDTO = Partial<Omit<MemberTypeEntity, 'id'>>;

export default class DBMemberTypes extends DBEntity<
  MemberTypeEntity,
  ChangeMemberTypeDTO
> {
  constructor() {
    super();
    this.delete = new Proxy(this.delete, {
      apply() {
        throw new Error('forbidden operation: cannot delete a member type');
      },
    });

    this.entity = [
      {
        id: MemberId.basic,
        discount: 0,
        monthPostsLimit: 20,
        profilesIds: [],
      },
      {
        id: MemberId.business,
        discount: 5,
        monthPostsLimit: 100,
        profilesIds: [],
      },
    ];
  }
}
