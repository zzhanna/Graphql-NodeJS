import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeToBodySchema,
  unsubscribeFromBodySchema,
} from './schemas';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply) {});

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply) {}
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply) {}
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply) {
    }
  );
  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeToBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply) {}
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: unsubscribeFromBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply) {}
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply) {}
  );
};

export default plugin;
