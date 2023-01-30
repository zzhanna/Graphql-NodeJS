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
import {
  userType,
  postType,
  profileType,
  memberType,
  UserInput,
  ProfileInput,
  PostInput,
} from './typesForGraphql/typesForGraphql';
//import { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

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
    async function (request) {
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
            resolve: async (_data, args) => {
              const user = await fastify.db.users.findOne({
                key: 'id',
                equals: args.userId,
              });
              if (!user) throw fastify.httpErrors.notFound();
              return user;
            },
          },
          posts: {
            type: new GraphQLList(postType),
            description: 'All posts',
            resolve: async () => await fastify.db.posts.findMany(),
          },
          post: {
            type: postType,
            description: 'Post by Id',
            args: {
              postId: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: async (_data, args) => {
              const post = await fastify.db.posts.findOne({
                key: 'id',
                equals: args.postId,
              });
              if (!post) throw fastify.httpErrors.notFound();
              return post;
            },
          },
          profiles: {
            type: new GraphQLList(profileType),
            description: 'All profiles',
            resolve: async () => await fastify.db.profiles.findMany(),
          },
          profile: {
            type: profileType,
            description: 'Profile by Id',
            args: {
              profileId: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: async (_data, args) => {
              const profile = await fastify.db.profiles.findOne({
                key: 'id',
                equals: args.id,
              });
              if (!profile) throw fastify.httpErrors.notFound();
              return profile;
            },
          },
          memberTypes: {
            type: new GraphQLList(memberType),
            description: 'All member-types',
            resolve: async () => await fastify.db.memberTypes.findMany(),
          },
          memberType: {
            type: memberType,
            description: 'Member-type by Id',
            args: { memberTypeId: { type: new GraphQLNonNull(GraphQLString) } },
            resolve: async (_data, args) => {
              const memberType = await fastify.db.memberTypes.findOne({
                key: 'id',
                equals: args.id,
              });
              if (!memberType) throw fastify.httpErrors.notFound();
              return memberType;
            },
          },
        },
      });

      const mutationPart = new GraphQLObjectType({
        name: 'RootMutation',
        fields: () => ({
          createUser: {
            type: userType,
            description: 'Create new user',
            args: {
              user: { type: UserInput },
            },
            resolve: async (_, args) =>
              await fastify.db.users.create(args.user),
          },
          createProfile: {
            type: profileType,
            description: 'Create new profile',
            args: {
              profile: { type: ProfileInput },
            },
            resolve: async (_, args) =>
              await fastify.db.profiles.create(args.profile),
          },
          createPost: {
            type: postType,
            description: 'Create new post',
            args: {
              post: { type: PostInput },
            },
            resolve: async (_data, args) =>
              await fastify.db.posts.create(args.post),
          },
        }),
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
