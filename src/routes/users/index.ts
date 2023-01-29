import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (): Promise<UserEntity[]> {
    return await fastify.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request): Promise<UserEntity> {
      const id = request.params.id;
      try {
        const user = await fastify.db.users.findOne({
          key: 'id',
          equals: id,
        });
        if (user) {
          return user;
        } else {
          throw Error;
        }
      } catch {
        throw fastify.httpErrors.notFound(`User not found`);
      }
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request): Promise<UserEntity> {
      try {
        const body = request.body;
        return await fastify.db.users.create(body);
      } catch {
        throw fastify.httpErrors.badRequest('Invalid request');
      }
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request): Promise<UserEntity> {
      try {
        const idUserDelete = request.params.id;
        const userDelete = await fastify.db.users.delete(idUserDelete);

        const profile = await fastify.db.profiles.findOne({
          key: 'userId',
          equals: idUserDelete,
        });
        if (profile) await fastify.db.profiles.delete(profile.id);

        const post = await fastify.db.posts.findOne({
          key: 'userId',
          equals: idUserDelete,
        });
        if (post) await fastify.db.posts.delete(post.id);

        const usersSubscribeToUser = await fastify.db.users.findMany({
          key: 'subscribedToUserIds',
          equals: [userDelete.id],
        });

        usersSubscribeToUser.forEach(async (subscribe) => {
          await fastify.db.users.change(subscribe.id, {
            subscribedToUserIds: subscribe.subscribedToUserIds.filter(
              (subscribeUserId) => subscribeUserId !== idUserDelete
            ),
          });
        });

        return userDelete;
      } catch {
        throw fastify.httpErrors.badRequest();
      }
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request): Promise<UserEntity> {
      try {
        const idFromBody = request.body.userId;
        const idFromParams = request.params.id;
        const user = await fastify.db.users.findOne({
          key: 'id',
          equals: idFromBody,
        });
        const userToSubsribeTo = await fastify.db.users.findOne({
          key: 'id',
          equals: idFromParams,
        });
        if (!user || !userToSubsribeTo) throw Error;
        await fastify.db.users.change(user.id, {
          subscribedToUserIds: [
            ...user.subscribedToUserIds,
            userToSubsribeTo.id,
          ],
        });
        return user;
      } catch {
        throw fastify.httpErrors.badRequest('Invalid request');
      }
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request): Promise<UserEntity> {
      const idFromBody = request.body.userId;
      const idFromParams = request.params.id;
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: idFromBody,
      });
      const userToUnsubscribeFrom = await fastify.db.users.findOne({
        key: 'id',
        equals: idFromParams,
      });
      if (!user || !userToUnsubscribeFrom)
        throw fastify.httpErrors.notFound('User to unsubscribe from not found');
      if (!user.subscribedToUserIds.includes(userToUnsubscribeFrom.id))
        throw fastify.httpErrors.badRequest();
      try {
        if (user) {
          await fastify.db.users.change(user?.id, {
            subscribedToUserIds: user?.subscribedToUserIds.filter(
              (id) => id !== userToUnsubscribeFrom?.id
            ),
          });
          return user;
        } else {
          throw Error;
        }
      } catch {
        throw fastify.httpErrors.badRequest('Invalid request');
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request): Promise<UserEntity> {
      const id = request.params.id;
      try {
        return await fastify.db.users.change(id, request.body);
      } catch {
        throw fastify.httpErrors.badRequest(`User with ${id} not found`);
      }
    }
  );
};

export default plugin;
