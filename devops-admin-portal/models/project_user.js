const Model = require('./model')

class ProjectUser {
  static tableName = 'projectuser';
  static columns = {
    keys: [
      'project_id',
      'user_id',
      'status',
      'created',
      'updated'
    ],
    types: [
      'INTEGER',
      'INTEGER',
      'TEXT',
      'TEXT',
      'TEXT',
    ]

  };

  static async createTable() {
    var r = await Model.createTable(ProjectUser.tableName, ProjectUser.columns);
    return r;
  }

  static deleteAll() {
    return Model.deleteAll(ProjectUser.tableName);
  }

  static create(item) {
    return Model.create(ProjectUser.tableName, ProjectUser.columns, item);
  }

  static update(item) {
    return Model.update(ProjectUser.tableName, ProjectUser.columns, item);
  }

  static getAll(params) {
    return Model.getAll(ProjectUser.tableName, params);
  }

  static getById(id) {
    return Model.getById(ProjectUser.tableName, id);
  }

  static updateStatus(id, status) {
    return Model.updateStatus(ProjectUser.tableName, id, status);
  }

  static count() {
    return Model.count(ProjectUser.tableName);
  }

  // methods for this table only

  static getByProjectAndUser(params) {
    var project_id = params.project_id;
    var user_id = params.user_id;

    var query = `SELECT * FROM ` + ProjectUser.tableName + ` WHERE project_id = ` + project_id +
    ` AND user_id = ` + user_id + ';';

    //console.log(query);
    return dao.get(query);
  }

  static getByProject(params) {
    var project_id = params.project_id;

    var query = `SELECT B.* FROM ` + ProjectUser.tableName + ` A` +
    ` LEFT JOIN user B ON A.user_id = B.id WHERE A.project_id = ` + project_id +` ORDER BY id ASC;`
    // SELECT B.* FROM projectuser A LEFT JOIN user B ON A.user_id = B.id WHERE A.project_id = 4 ORDER BY id ASC;
    //console.log(query);
    return dao.all(query);
  }


  static getByUser(params) {
    var user_id = params.user_id;

    var query = `SELECT B.* FROM ` + ProjectUser.tableName + ` A` +
    ` LEFT JOIN project B ON A.project_id = B.id WHERE A.user_id = ` + user_id +` ORDER BY id ASC;`
    // SELECT B.* FROM projectuser A LEFT JOIN user B ON A.user_id = B.id WHERE A.project_id = 4 ORDER BY id ASC;
    //console.log(query);
    return dao.all(query);
  }

  static deleteAllByProject(params) {
    var project_id = params.project_id;
    const sql = `delete from ` + ProjectUser.tableName + ` WHERE project_id = ` + project_id + ';';
    return dao.run(sql);
  }
}

module.exports = ProjectUser;
