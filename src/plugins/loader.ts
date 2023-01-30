import * as Dataloader from 'dataloader';
import DB from './../utils/DB/DB';

export const createLoaders = async (db: DB) => {
  return {
    users: new Dataloader(async (usersIds) => {
      const allUsers = await db.users.findMany();
      return usersIds.map((id) => allUsers.find((user) => user.id === id));
    }),
  };
};
