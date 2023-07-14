const Model = require('./model')

class Notification {
  static tableName = 'notification';
  static columns = {
    keys: [
      'type',
      'notify_to',
      'content',
      'ref_id',
      'status',
      'created',
      'sent'
    ],
    types: [
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
    var r = await Model.createTable(Notification.tableName, Notification.columns);
    return r;
  }

  static deleteAll() {
    return Model.deleteAll(Notification.tableName);
  }

  static create(item) {
    return Model.create(Notification.tableName, Notification.columns, item);
  }

  static update(item) {
    return Model.update(Notification.tableName, Notification.columns, item);
  }

  static getAll(params) {
    return Model.getAll(Notification.tableName, params);
  }

  static getById(id) {
    return Model.getById(Notification.tableName, id);
  }

  static updateStatus(id, status) {
    return Model.updateStatus(Notification.tableName, id, status);
  }

  static count() {
    return Model.count(Notification.tableName);
  }

  // methods for this table only
  static getByStatus(params) {
    let status = params.status;
    return dao.all(`SELECT * FROM ` + Notification.tableName + ` WHERE status = ?;`, [status]);
  }

  static getByTypeAndRefId(params) {
    let type = params.type;
    let refId = params.refId;
    return dao.all(`SELECT * FROM ` + Notification.tableName + ` WHERE ref_id = ? AND type = ?;`, [refId, type]);
  }

  static updateSent(params) {
    let id = params.id;
    var query = `
    UPDATE ` + Notification.tableName
    + ` SET status = ?, sent = ? WHERE id = ?;`;    
    return dao.run(query, ['sent', (new Date()).toString(), id]);
  }

}

module.exports = Notification;
