import DBMemberTypes from './entities/DBMemberTypes';
import DBPosts from './entities/DBPosts';
import DBProfiles from './entities/DBProfiles';
import DBUsers from './entities/DBUsers';
import * as lodash from 'lodash';

export default class DB {
  users: DBUsers;
  profiles: DBProfiles;
  memberTypes: DBMemberTypes;
  posts: DBPosts;

  constructor() {
    const proxyHandler = {
      get: (target: any, prop: any) => {
        if (typeof target[prop] === 'function') {
          return (...args: any[]) => lodash.cloneDeep(target[prop](...args));
        } else {
          return target[prop];
        }
      },
    };
    this.users = new Proxy(new DBUsers(), proxyHandler);
    this.profiles = new Proxy(new DBProfiles(), proxyHandler);
    this.memberTypes = new Proxy(new DBMemberTypes(), proxyHandler);
    this.posts = new Proxy(new DBPosts(), proxyHandler);
  }
}
