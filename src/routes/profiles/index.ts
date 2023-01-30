import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (): Promise<ProfileEntity[]> {
    return await fastify.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const id = request.params.id;
      try {
        const profile = await fastify.db.profiles.findOne({
          key: 'id',
          equals: id,
        });
        if (!profile) throw Error;
        return profile;
      } catch {
        throw fastify.httpErrors.notFound('Not found');
      }
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request): Promise<ProfileEntity> {
      try {
        const idFromBody = request.body.userId;
        const idMemberType = request.body.memberTypeId;
        const existUser = await fastify.db.profiles.findOne({
          key: 'userId',
          equals: idFromBody,
        });
        const existMemberType = await fastify.db.memberTypes.findOne({
          key: 'id',
          equals: idMemberType,
        });
        if (existUser || !existMemberType) throw Error;
        return await fastify.db.profiles.create(request.body);
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
    async function (request): Promise<ProfileEntity> {
      try {
        const id = request.params.id;
        if (!id) throw Error;
        return await fastify.db.profiles.delete(id);
      } catch {
        throw fastify.httpErrors.badRequest();
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request): Promise<ProfileEntity> {
      try {
        const id = request.params.id;
        return await fastify.db.profiles.change(id, request.body);
      } catch {
        throw fastify.httpErrors.badRequest('Invalid request');
      }
    }
  );
};

export default plugin;
