import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (): Promise<MemberTypeEntity[]> {
    return await fastify.db.memberTypes.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request): Promise<MemberTypeEntity> {
      try {
        const id = request.params.id;
        const user = await fastify.db.memberTypes.findOne({
          key: 'id',
          equals: id,
        });
        if (user) {
          return user;
        } else {
          throw Error;
        }
      } catch {
        throw fastify.httpErrors.notFound('MemberType not found');
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request): Promise<MemberTypeEntity> {
      try {
        const id = request.params.id;
        const body = request.body;
        return await fastify.db.memberTypes.change(id, body);
      } catch {
        throw fastify.httpErrors.badRequest('Invalid request');
      }
    }
  );
};

export default plugin;
