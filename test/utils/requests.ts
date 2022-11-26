import {
  generate_createUserDTO,
  generate_createPostDTO,
  generate_createProfileDTO,
} from './fake';

export async function createUser(app: any) {
  const res = await app.inject({
    url: '/users',
    method: 'POST',
    payload: generate_createUserDTO(),
  });
  const body = await res.json();
  return { res, body };
}

export async function createProfile(
  app: any,
  userId: string,
  memberTypeId: string
) {
  const res = await app.inject({
    url: '/profiles',
    method: 'POST',
    payload: generate_createProfileDTO(userId, memberTypeId),
  });
  const body = await res.json();
  return { res, body };
}

export async function createPost(app: any, userId: string) {
  const res = await app.inject({
    url: '/posts',
    method: 'POST',
    payload: generate_createPostDTO(userId),
  });
  const body = await res.json();
  return { res, body };
}
