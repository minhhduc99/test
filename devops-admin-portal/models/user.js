var argon2 = require('argon2');
var {randomBytes} = require('crypto');

class User {
  static tableName = 'user';
  constructor() {

  }

  static async createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      account TEXT UNIQUE,
      password TEXT,
      salt TEXT,
      owner_id INTEGER,
      role TEXT,
      status TEXT,
      description TEXT,
      created TEXT,
      updated TEXT)`;
    var result = await dao.run(sql);
    var admin = await dao.get(`SELECT * FROM user WHERE account = ?`,['admin']);
    if(admin == undefined) {
      console.log("Creating admin account");
      const salt = randomBytes(32);
      var passwordHashed = await argon2.hash("admin", { salt });
      console.log(await dao.run('INSERT INTO user (name, account, password, salt, owner_id, role, status, description, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        ["Administrator", "admin", passwordHashed, salt, 1, "admin", "active", "Administrator", new Date().toString(), new Date().toString()]));

    }
    var sadmin = await dao.get(`SELECT * FROM user WHERE account = ?`,['sadmin']);
    if(sadmin == undefined) {
      console.log("Creating sadmin account");
      const salt = randomBytes(32);
      var passwordHashed = await argon2.hash("sadmin", { salt });
      console.log(await dao.run('INSERT INTO user (name, account, password, salt, owner_id, role, status, description, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        ["System Administrator", "sadmin", passwordHashed, salt, 1, "sadmin", "active", "System Administrator", new Date().toString(), new Date().toString()]));

    }
    return;
  }

  // this is for development only!
  static deleteAll() {
    const sql = `delete from user WHERE account != 'sadmin'`;
    return dao.run(sql);
  }

  static create(user) {
    console.log(user);
    return dao.run('INSERT INTO user (name, account, password, salt, owner_id, role, status, description, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [user.name, user.account, user.password, user.salt, user.owner_id, user.role, user.status, user.description, new Date().toString(), new Date().toString()]);
  }

  static update(user) {
    var query = `
    UPDATE user
    SET name = ?, account = ?, password = ?, salt = ?, owner_id = ?, role = ?, status = ?, description = ?, created = ?, updated = ?
    WHERE id = ?;
    `;
    return dao.run(query, [user.name, user.account, user.password, user.salt, user.owner_id,
      user.role, user.status, user.description, user.created, new Date().toString(), user.id]);
  }

  static count() {
    return dao.get(`SELECT count(*) FROM user WHERE account != 'sadmin';`);
  }

  /*
  static getAll() {
    return dao.all(`SELECT * FROM user WHERE account != 'sadmin' ORDER BY id ASC`);
  }
  */

  static getAll(params) {
    var limit = params.limit;
    var offset = params.offset;
    var organization = params.organization;

    var query = `SELECT A.id, A.name, A.account, A.owner_id, A.role, A.status, A.description, A.created, A.updated, B.name as owner FROM user A` +
      ` LEFT JOIN organization B ON A.owner_id = B.id` +
      ` WHERE A.account != 'sadmin'` +
      (organization?` AND A.owner_id = ` + organization:'') +
      ` ORDER BY A.status ASC, A.id ASC ` +
      (limit?` LIMIT ` + limit:'') +
      (offset?' OFFSET ' + offset:'') + ';';

    console.log(query);
    return dao.all(query);
  }

  static getWithAccount(account) {
    return dao.get(`SELECT * FROM user WHERE account = ?`,[account]);
  }

  static getWithId(id) {
    return dao.get(`SELECT name, account, owner_id, role, status, description, created, updated FROM user WHERE id = ?`,[id]);
  }

  static updateStatus(id, status) {
    var query = `
    UPDATE user
    SET status = ?
    WHERE id = ?;
    `;
    return dao.run(query, [status, id]);
  }
}

module.exports = User;
