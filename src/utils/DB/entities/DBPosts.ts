import * as crypto from 'node:crypto';
import DBEntity from './DBEntity';

type PostEntity = {
  id: string;
  title: string;
  content: string;
  userId: string;
};
type CreatePostDTO = Omit<PostEntity, 'id'>;
type ChangePostDTO = Partial<Omit<PostEntity, 'id' | 'userId'>>;

export default class DBPosts extends DBEntity<PostEntity, ChangePostDTO> {
  async create(createUserDTO: CreatePostDTO) {
    const created = {
      ...createUserDTO,
      id: crypto.randomUUID(),
    };
    this.entity.push(created);
    return created;
  }
}
