import fp from 'fastify-plugin';
import DB from '../utils/DB/DB';
import { UserEntity } from '../utils/DB/entities/DBUsers';
import { userLoader } from './loader';

export default fp(async (fastify): Promise<void> => {
  const db = new DB();
  const loader = new userLoader(db);
  fastify.decorate('db', db);
  fastify.decorate('loader', loader);
});

declare module 'fastify' {
  export interface FastifyInstance {
    db: DB;
    loader: UserEntity;
  }
}
