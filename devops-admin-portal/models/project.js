const Model = require('./model')

class Project {
  static tableName = 'project';
  static columns = {
    keys: [
      'name',
      'environments',
      'description',
      'aws_access_key',
      'aws_secret_key',
      'jumphost_id',
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
      'TEXT',
      'TEXT',
      'INTEGER',
      'TEXT',
      'TEXT',
      'TEXT',
    ]

  };

  static async createTable() {
    var r = await Model.createTable(Project.tableName, Project.columns);
    return r;
  }

  static deleteAll() {
    return Model.deleteAll(Project.tableName);
  }

  static create(item) {
    return Model.create(Project.tableName, Project.columns, item);
  }

  static update(item) {
    return Model.update(Project.tableName, Project.columns, item);
  }

  static getAll(params) {
    return Model.getAll(Project.tableName, params);
  }

  static getById(id) {
    return Model.getById(Project.tableName, id);
  }

  static updateStatus(id, status) {
    return Model.updateStatus(Project.tableName, id, status);
  }

  static count() {
    return Model.count(Project.tableName);
  }

  // methods for this table only
  static getByOrganization(params) {
    var limit = params.limit;
    var offset = params.offset;
    var organization = params.organization;

    var countQuery = 'SELECT count(*) FROM ' + Project.tableName +
    (organization?` WHERE owner_id = ` + organization:'') + ';';

    var query = `SELECT A.*, B.name as owner FROM ` + Project.tableName + ' A ' +
      ` LEFT JOIN organization B ON A.owner_id = B.id ` +
      (organization?`WHERE A.owner_id = ` + organization:'') +
      ` ORDER BY status ASC, id ASC ` +
      (limit?`LIMIT ` + limit:'') +
      (offset?' OFFSET ' + offset:'') + ';';

    //console.log(query);
    return Promise.all([
      dao.get(countQuery),
      dao.all(query)
    ]).then(res => Promise.resolve({
      count: res[0]['count(*)'],
      data: res[1]
    })).catch(err => {
      console.log(err);
    });
  }

  static getByIpAndOwnerId(params) {
    var ip = params.ip;
    var owner_id = params.owner_id;

    var query = `SELECT * FROM ` + Project.tableName + ` WHERE ip = '` + ip +
    `' AND owner_id = ` + owner_id + ';';

    //console.log(query);
    return dao.get(query);
  }
}

module.exports = Project;
