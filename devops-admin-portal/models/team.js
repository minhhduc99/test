const Model = require('./model')

class Team {
  static tableName = 'team';
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
    var r = await Model.createTable(Team.tableName, Team.columns);
    /*
    var ta1 = await dao.get(`SELECT * FROM team WHERE name = ?`,['TA1']);
    if(ta1 == undefined) {
      console.log("Creating default Teams for Service Operation P");
      ta1 = {
        name: 'TA1',
        description: 'TA1 team',
        owner_id: 1,
        status: 'active',
        craeted: new Date().toString(),
        updated: new Date().toString()
      };
      console.log(Model.create(Team.tableName, Team.columns, ta1));
      console.log(Model.create(Team.tableName, Team.columns, {
        name: 'TA2',
        description: 'TA2 team',
        owner_id: 1,
        status: 'active',
        craeted: new Date().toString(),
        updated: new Date().toString()
      }));
      console.log(Model.create(Team.tableName, Team.columns, {
        name: 'DBA',
        description: 'DBA team',
        owner_id: 1,
        status: 'active',
        craeted: new Date().toString(),
        updated: new Date().toString()
      }));
      console.log(Model.create(Team.tableName, Team.columns, {
        name: 'Local',
        description: 'Local team',
        owner_id: 1,
        status: 'active',
        craeted: new Date().toString(),
        updated: new Date().toString()
      }));
      console.log(Model.create(Team.tableName, Team.columns, {
        name: 'SRE',
        description: 'SRE team',
        owner_id: 1,
        status: 'active',
        craeted: new Date().toString(),
        updated: new Date().toString()
      }));
    }
    */
    return r;
  }

  static deleteAll() {
    return Model.deleteAll(Team.tableName);
  }

  static create(item) {
    return Model.create(Team.tableName, Team.columns, item);
  }

  static update(item) {
    return Model.update(Team.tableName, Team.columns, item);
  }

  static getAll(params) {
    return Model.getAll(Team.tableName, params);
  }

  static getById(id) {
    return Model.getById(Team.tableName, id);
  }

  static updateStatus(id, status) {
    return Model.updateStatus(Team.tableName, id, status);
  }

  static count() {
    return Model.count(Team.tableName);
  }

  // methods for this table only

  static getByOrganization(params) {
    var limit = params.limit;
    var offset = params.offset;
    var organization = params.organization;

    var countQuery = 'SELECT count(*) FROM ' + Team.tableName +
    (organization?` WHERE owner_id = ` + organization:'') + ';';

    var query = `SELECT A.*, B.name as owner FROM ` + Team.tableName + ' A ' +
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
}

module.exports = Team;
