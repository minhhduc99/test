const Model = require('./model')

class Organization {
  static tableName = 'organization';
  static columns = {
    keys: [
      'name',
      'description',
      'owner_id',
      'status',
      'created',
      'updated'
    ],
    types: [
      'TEXT UNIQUE',
      'TEXT',
      'INTEGER',
      'TEXT',
      'TEXT',
      'TEXT',
    ]

  };

  static async createTable() {
    var r = await Model.createTable(Organization.tableName, Organization.columns);
    var serOps = await dao.get(`SELECT * FROM organization WHERE name = ?`,['Service Operation']);
    if(serOps == undefined) {
      console.log("Creating default Organization for Service Operation P");
      console.log(Model.create(Organization.tableName, Organization.columns, {
        name: 'Service Operation',
        description: 'Service Operation Part',
        owner_id: ['hieu.nt4'].toString(),
        status: 'active',
        craeted: new Date().toString(),
        updated: new Date().toString()
      }));
    }
    return r;
  }

  static deleteAll() {
    return Model.deleteAll(Organization.tableName);
  }

  static create(item) {
    return Model.create(Organization.tableName, Organization.columns, item);
  }

  static update(item) {
    return Model.update(Organization.tableName, Organization.columns, item);
  }

  static getAll(params) {
    return Model.getAll(Organization.tableName, params);
  }

  static getById(id) {
    return Model.getById(Organization.tableName, id);
  }

  static updateStatus(id, status) {
    return Model.updateStatus(Organization.tableName, id, status);
  }

  static count() {
    return Model.count(Organization.tableName);
  }
}

module.exports = Organization;
