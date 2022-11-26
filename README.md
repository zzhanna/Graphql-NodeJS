## Assignment: Graphql

### Tasks:
1. Add logic to the restful endpoints (users, posts, profiles, member-types folders in ./src/routes).
2. Add logic to the graphql endpoint (graphql folder in ./src/routes).
3. Solve n+1 graphql problem with "dataloader" package.
4. Limit the complexity of the graphql queries by their depth with "graphql-depth-limit" package.  

### Description:  
App template made with fastify, but you don't need to know much about fastify to get the tasks done. All templates for endpoints are placed.  
Use the "db" property of the "fastify" object as database ("db" is an instance of the DB class => ./src/utils/DB/DB.ts).  
Body, params are parsed and can be accessed in request object.  
If operation cannot be performed, then throw an error from http handler (fastify will send reply with 500 http code). E.g. when getting a non-existent user.  
If operation is completed, then return an entity or array of entities from http handler (fastify will stringify object/array and will send it).  

### Description for the 1 task:
Relations between entities:
* user(profileId) => profile(userId)
* profile(memberTypeId) => memberType(profileIds[])
* user(postIds[]) => post(userId)
* user(userSubscribedToIds[]) => user(subscribedToUserIds[])

As you can see, the connections are two-way by referencing id.  
E.g. if you are creating a profile, then you change related user's "profileId" field to be equal to the profile id.  
So that you can get user id from the profile (in userId field) and profile id from the user (in profileId field).

The presence of relations in the entities complicates the work with crud operations. E.g:
* If profile was deleted => change user's "profileId" field on null; remove profile id from memberType's "profileIds" array.
* If post was deleted => remove post id from user's "postIds".
* If user was deleted => delete user's profile; delete user's posts; remove user id references from other users (userSubscribedToIds[], subscribedToUserIds[]).

You are not allowed to change all fields using endpoints with "patch" http method (for simplicity).  
E.g. you cannot change "userId" field in "patch" endpoint of profile entity.  
Look at the jsonSchema(schema.ts files near index.ts) to determine the structure of "body", "params", "query" in the "request" object (autocompletion is included).

NOTE: to determine that all your restful logic works correctly => run the script "npm run test".  
But be careful because these tests are integration (E.g. to test "delete" logic => it creates the entity via a "create" endpoint).  

### Description for the 2 task:  
Fill in the logic for the graphql endpoint so that you can execute all operations that are made through restful endpoints.  

* also add the ability to query entities which will be resolved from ids (*where you specify relations between entities).  
E.g. user entity has "profileId" => add the ability to query "profile" field on user (profile entity).  
E.g. user entity has "postIds" => add the ability to query "posts" field on user (array of post entities).  

* also build graphql schema so as to avoid circular dependencies.  
E.g. if you query a user => you can get a "profile" => but you can't get the user back from the received profile by specifying the "user" field.  
(NOTE: user entity is an exception from this rule. Make it possible to query user entity infinitely by nesting userSubscribedTo or subscribedToUser).  

* also make it possible to optionally create a profile when creating a user (all in one mutation).  
If it is not possible to create a profile (wrong memberTypeId was passed), then delete the created user.

* DTOs for creating, modifying entities should be InputObjectType (https://graphql.org/graphql-js/type/#graphqlinputobjecttype).  
Expect clients of your gql server to pass all arguments through "variables" field of request.body.

### Description for the 4 task:  
Limit the complexity of the graphql queries by their depth with "graphql-depth-limit" package.  
E.g. User can refer to other users via properties "subscribedToUser", "userSubscribedTo" and users within them can also have "subscribedToUser", "userSubscribedTo" and so on.  
Your task is to add a new rule (created by "graphql-depth-limit") in validation (https://graphql.org/graphql-js/validation/) to limit such nesting to 8 levels max.
