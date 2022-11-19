import { test } from 'tap';
import { build } from '../helper';
import { createUser, createProfile } from '../utils/requests';

test('posts', async (t) => {
  const app = await build(t);

  await t.test('POST /profiles => failure; fake body.userId', async (t) => {
    const { res: res_createProfile } = await createProfile(
      app,
      'fakeId',
      'basic'
    );

    t.ok(res_createProfile.statusCode > 300);
  });

  await t.test('POST /profiles => success', async (t) => {
    let { body: user } = await createUser(app);
    let { body: profile } = await createProfile(app, user.id, 'basic');

    t.ok(profile.userId === user.id, 'userId should be correct');

    user = await app
      .inject({
        url: `/users/${user.id}`,
      })
      .then((r: any) => r.json(0));
    t.ok(user.profileId === profile.id, 'profileId should be updated');
  });

  await t.test(
    'POST /profiles => failure; user already has a profile',
    async (t) => {
      let { body: user } = await createUser(app);
      await createProfile(app, user.id, 'basic');
      let { res: res_createProfile } = await createProfile(
        app,
        user.id,
        'basic'
      );

      t.ok(res_createProfile.statusCode > 300);
    }
  );

  await t.test('PATCH /profiles/:id => failure; fake params.id', async (t) => {
    const res_patchProfile = await app.inject({
      url: `/profiles/fakeId`,
      method: 'PATCH',
      payload: {},
    });

    t.ok(res_patchProfile.statusCode > 300);
  });

  await t.test('PATCH /profiles/:id => success', async (t) => {
    const { body: user } = await createUser(app);
    let { body: profile } = await createProfile(app, user.id, 'basic');

    const changedCity = 'Svetlogorsk';

    profile = await app
      .inject({
        url: `/profiles/${profile.id}`,
        method: 'PATCH',
        payload: {
          city: changedCity,
          memberTypeId: 'business',
        },
      })
      .then((r: any) => r.json(0));
    t.ok(profile.city === changedCity, 'city should be changed');

    const prevMemberType = await app
      .inject({
        url: `/member-types/basic`,
      })
      .then((r: any) => r.json(0));
    const curMemberType = await app
      .inject({
        url: `/member-types/business`,
      })
      .then((r: any) => r.json(0));
    t.ok(
      !prevMemberType.profileIds.includes(profile.id) &&
        curMemberType.profileIds.includes(profile.id),
      'profileIds should be updated'
    );
  });

  await t.test('DELETE /profiles/:id => failure; fake params.id', async (t) => {
    const res_deleteProfile = await app.inject({
      url: `/profiles/fakeId`,
      method: 'DELETE',
    });

    t.ok(res_deleteProfile.statusCode > 300);
  });

  await t.test('DELETE /profiles/:id => success', async (t) => {
    let { body: user } = await createUser(app);
    const { body: profile } = await createProfile(app, user.id, 'basic');

    await app.inject({
      url: `/profiles/${profile.id}`,
      method: 'DELETE',
    });

    user = await app
      .inject({
        url: `/users/${user.id}`,
      })
      .then((r: any) => r.json());
    t.ok(user.profileId === null, 'profileId should be updated');

    const memberType = await app
      .inject({
        url: `/member-types/basic`,
      })
      .then((r: any) => r.json(0));
    t.ok(
      !memberType.profileIds.includes(profile.id),
      'profileIds should be updated'
    );
  });
});
