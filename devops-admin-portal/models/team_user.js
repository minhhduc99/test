const Model = require('./model')

class TeamUser {
  static tableName = 'teamuser';
  static columns = {
    keys: [
      'team_id',
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
    var r = await Model.createTable(TeamUser.tableName, TeamUser.columns);
    return r;
  }

  static deleteAll() {
    return Model.deleteAll(TeamUser.tableName);
  }

  static create(item) {
    return Model.create(TeamUser.tableName, TeamUser.columns, item);
  }

  static update(item) {
    return Model.update(TeamUser.tableName, TeamUser.columns, item);
  }

  static getAll(params) {
    return Model.getAll(TeamUser.tableName, params);
  }

  static getById(id) {
    return Model.getById(TeamUser.tableName, id);
  }

  static updateStatus(id, status) {
    return Model.updateStatus(TeamUser.tableName, id, status);
  }

  static count() {
    return Model.count(TeamUser.tableName);
  }

  // methods for this table only

  static getByTeamAndUser(params) {
    var team_id = params.team_id;
    var user_id = params.user_id;

    var query = `SELECT * FROM ` + TeamUser.tableName + ` WHERE team_id = ` + team_id +
    ` AND user_id = ` + user_id + ';';

    //console.log(query);
    return dao.get(query);
  }

  static getByTeam(params) {
    var team_id = params.team_id;

    var query = `SELECT B.* FROM ` + TeamUser.tableName + ` A` +
    ` LEFT JOIN user B ON A.user_id = B.id WHERE A.team_id = ` + team_id +` ORDER BY id ASC;`
    // SELECT B.* FROM teamuser A LEFT JOIN user B ON A.user_id = B.id WHERE A.team_id = 4 ORDER BY id ASC;
    //console.log(query);
    return dao.all(query);
  }

  static deleteAllByTeam(params) {
    var team_id = params.team_id;
    const sql = `delete from ` + TeamUser.tableName + ` WHERE team_id = ` + team_id + ';';
    return dao.run(sql);
  }
}

module.exports = TeamUser;
