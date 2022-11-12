import DBEntity from './DBEntity';

type MemberTypeEntity = {
  id: string;
  discount: number;
  monthPostsLimit: number;
  profileIds: string[];
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
        id: 'basic',
        discount: 0,
        monthPostsLimit: 20,
        profileIds: [],
      },
      {
        id: 'business',
        discount: 5,
        monthPostsLimit: 100,
        profileIds: [],
      },
    ];
  }
}
