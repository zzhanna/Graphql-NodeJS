import * as lodash from 'lodash';
import { NoRequiredEntity } from '../errors/NoRequireEntity.error';

type UnpackArray<T> = T extends (infer R)[] ? R : never;

export default abstract class DBEntity<
  Entity extends { id: string },
  ChangeDTO,
  CreateDTO
> {
  protected entities: Entity[] = [];

  abstract create(createDto: CreateDTO): Promise<Entity>;

  async findOne<K extends keyof Entity>(options: {
    key: K;
    equals: Entity[K];
  }): Promise<Entity | null> {
    return (
      this.entities.find((o) =>
        lodash.isEqual(o[options.key], options.equals)
      ) ?? null
    );
  }

  async findMany<K extends keyof Entity>(options: {
    key: K;
    equals: Entity[K];
  }): Promise<Entity[]>;
  async findMany<K extends keyof Entity>(option: {
    key: K;
    equalsAnyOf: Entity[K][];
  }): Promise<Entity[]>;
  async findMany<K extends keyof Entity>(option: {
    key: K;
    inArray: UnpackArray<Entity[K]>;
  }): Promise<Entity[]>;
  async findMany<K extends keyof Entity>(): Promise<Entity[]>;
  async findMany<K extends keyof Entity>(options?: {
    key: K;
    equals?: Entity[K];
    equalsAnyOf?: Entity[K][];
    inArray?: UnpackArray<Entity[K]>;
  }): Promise<Entity[]> {
    if (options?.equals) {
      return this.entities.filter((o) =>
        lodash.isEqual(o[options.key], options.equals)
      );
    }
    if (options?.equalsAnyOf) {
      return this.entities.filter((o) => {
        return options.equalsAnyOf?.some((value) =>
          lodash.isEqual(o[options.key], value)
        );
      });
    }
    if (options?.inArray) {
      return this.entities.filter((o) => {
        const array = o[options.key] as typeof options.inArray[];
        return array.some((value) => lodash.isEqual(value, options.inArray));
      });
    }
    return this.entities;
  }

  async delete(id: string): Promise<Entity> {
    const idx = this.entities.findIndex((o) => o.id === id);
    if (idx === -1) throw new NoRequiredEntity('delete');
    const deleted = this.entities[idx];
    this.entities.splice(idx, 1);
    return deleted;
  }

  async change(id: string, changeDTO: ChangeDTO): Promise<Entity> {
    const idx = this.entities.findIndex((o) => o.id === id);
    if (idx === -1) throw new NoRequiredEntity('change');
    const changed = { ...this.entities[idx], ...changeDTO };
    this.entities.splice(idx, 1, changed);
    return changed;
  }
}
