export default abstract class DBEntity<
  Entity extends { id: string },
  ChangeDTO,
  CreateDTO
> {
  protected entity: Entity[] = [];

  abstract create(createDto: CreateDTO): Promise<Entity>;

  async findOne(id: string) {
    return this.entity.find((o) => o.id === id) ?? null;
  }

  async findMany(ids: string[]): Promise<(Entity | null)[]>;
  async findMany(): Promise<Entity[]>;
  async findMany(ids?: string[]): Promise<Entity[] | (Entity | null)[]> {
    if (ids) {
      const result = new Array(ids.length).fill(null) as (Entity | null)[];
      for (let i = 0; i < this.entity.length; i++) {
        const idxResult = ids.indexOf(this.entity[i].id);
        if (idxResult !== -1) {
          result[idxResult] = this.entity[i];
          if (!result.includes(null)) break;
        }
      }
      return result;
    }
    return this.entity;
  }

  async delete(id: string) {
    const idx = this.entity.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    const deleted = this.entity[idx];
    this.entity.splice(idx, 1);
    return deleted;
  }

  async change(id: string, changeDTO: ChangeDTO) {
    const idx = this.entity.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    const changed = { ...this.entity[idx], ...changeDTO };
    this.entity.splice(idx, 1, changed);
    return changed;
  }
}
