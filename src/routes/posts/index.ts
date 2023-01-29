import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (): Promise<PostEntity[]> {
    return await fastify.db.posts.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request): Promise<PostEntity> {
      try {
        const id = request.params.id;
        const post = await fastify.db.posts.findOne({ key: 'id', equals: id });
        if (post) {
          return post;
        } else {
          throw Error;
        }
      } catch {
        throw fastify.httpErrors.notFound('Not found');
      }
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request): Promise<PostEntity> {
      try {
        return await fastify.db.posts.create(request.body);
      } catch {
        throw fastify.httpErrors.badRequest();
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
    async function (request): Promise<PostEntity> {
      try {
        const id = request.params.id;
        const post = await fastify.db.posts.findOne({ key: 'id', equals: id });
        if (!post) throw Error;
        return await fastify.db.posts.delete(id);
      } catch {
        throw fastify.httpErrors.badRequest('Invalid request');
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request): Promise<PostEntity> {
      try {
        const id = request.params.id;
        const post = await fastify.db.posts.findOne({
          key: 'id',
          equals: id,
        });
        if (!post) throw Error;
        return await fastify.db.posts.change(id, request.body);
      } catch {
        throw fastify.httpErrors.badRequest('Invalid request');
      }
    }
  );
};

export default plugin;
