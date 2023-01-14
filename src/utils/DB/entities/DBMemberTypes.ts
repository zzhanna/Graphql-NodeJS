import DBEntity from './DBEntity';

export type MemberTypeEntity = {
  id: string;
  discount: number;
  monthPostsLimit: number;
  profileIds: string[];
};
type CreateMemberTypeDTO = Omit<MemberTypeEntity, 'profileIds'>;
type ChangeMemberTypeDTO = Partial<Omit<MemberTypeEntity, 'id'>>;

export default class DBMemberTypes extends DBEntity<
  MemberTypeEntity,
  ChangeMemberTypeDTO,
  CreateMemberTypeDTO
> {
  constructor() {
    super();

    this.create({
      id: 'basic',
      discount: 0,
      monthPostsLimit: 20,
    });
    this.create({
      id: 'business',
      discount: 5,
      monthPostsLimit: 100,
    });

    const proxyHandler = {
      apply(target: any) {
        throw new Error(
          `forbidden operation: cannot ${target?.name} a member type`
        );
      },
    };

    this.delete = new Proxy(this.delete, proxyHandler);
    this.create = new Proxy(this.create, proxyHandler);
  }

  async create(dto: CreateMemberTypeDTO) {
    const created = {
      ...dto,
      profileIds: [],
    };
    this.entity.push(created);
    return created;
  }
}
