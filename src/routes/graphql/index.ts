import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import {
  graphql,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { userType } from './typesForGraphql/typesForGraphql';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const queryPart = new GraphQLObjectType({
        name: 'RootQuery',
        fields: {
          users: {
            type: new GraphQLList(userType),
            description: 'All users',
            resolve: async () => await fastify.db.users.findMany(),
          },
          user: {
            type: userType,
            description: 'User by Id',
            args: {
              userId: {
                type: new GraphQLNonNull(GraphQLString),
              },
            },
            resolve: async (_parent, args) => {
              const user = await fastify.db.users.findOne({
                key: 'id',
                equals: args.userId,
              });
              if (!user) throw fastify.httpErrors.notFound();
              return user;
            },
          },
        },
      });

      const mutationPart = new GraphQLObjectType({
        name: 'RootMutation',
        fields: {},
      });

      const schemaForGraphql = new GraphQLSchema({
        query: queryPart,
        mutation: mutationPart,
      });

      return await graphql({
        schema: schemaForGraphql,
        source: String(request.body.query),
        variableValues: request.body.variables,
        contextValue: fastify,
      });
    }
  );
};

export default plugin;
