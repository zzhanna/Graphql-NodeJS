import * as Dataloader from 'dataloader';
import DB from './../utils/DB/DB';

export const userLoader = (db: DB) =>
  new Dataloader(async (keys) => {
    const results = await db.users.findMany({
      key: 'id',
      equalsAnyOf: keys as [],
    });
    return keys.map(
      (key) => results.find((item) => item.id == key) || new Error(`Error`)
    );
  });
