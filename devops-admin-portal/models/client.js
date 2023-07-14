const Model = require('./model')

class Client {
  static tableName = 'client';
  static columns = {
    keys: [
      'name',
      'key',
      'expire_date',
      'description',
      'owner_id',
      'status',
      'created',
      'updated'
    ],
    types: [
      'TEXT UNIQUE',
      'TEXT',
      'TEXT',
      'TEXT',
      'INTEGER',
      'TEXT',
      'TEXT',
      'TEXT',
    ]

  };

  static async createTable() {
    var r = await Model.createTable(Client.tableName, Client.columns);
    return r;
  }

  static deleteAll() {
    return Model.deleteAll(Client.tableName);
  }

  static create(item) {
    return Model.create(Client.tableName, Client.columns, item);
  }

  static update(item) {
    return Model.update(Client.tableName, Client.columns, item);
  }

  static getAll(params) {
    return Model.getAll(Client.tableName, params);
  }

  static getById(id) {
    return Model.getById(Client.tableName, id);
  }

  static updateStatus(id, status) {
    return Model.updateStatus(Client.tableName, id, status);
  }

  static count() {
    return Model.count(Client.tableName);
  }

  // methods for this table only
  static getByName(name) {
    var query = `SELECT * FROM ` + Client.tableName + ` WHERE name = '` + name + `';`;
    return dao.get(query);
  }
}

module.exports = Client;
