class Model {

  /*
  //How to declair table

  static tableName = 'base';
  static columns = {
    keys: [
      'name',
      'description',
      'owner',
      'status',
      'created',
      'updated'
    ],
    types: [
      'TEXT',
      'TEXT',
      'TEXT',
      'TEXT',
      'TEXT',
      'TEXT',
    ]
  };
  */

  static createTable(tableName, columns) {
    var sql = `
    CREATE TABLE IF NOT EXISTS ` + tableName + ` (
      id INTEGER PRIMARY KEY AUTOINCREMENT,`;
    for(var i=0; i < columns.keys.length; i++) {
        sql += columns.keys[i] + ' ' + columns.types[i];
        if(i < columns.keys.length - 1) {
          sql += ',';
        }
    }
    sql += `)`;
    //console.log(sql);
    return dao.run(sql);
  }

  // this is for development only!
  static deleteAll(tableName) {
    const sql = `delete from ` + tableName;
    return dao.run(sql);
  }

  // this is for development only!
  static delete(tableName, id) {
    const sql = `DELETE FROM ` + tableName + ` WHERE id = ?;`;
    return dao.run(sql, [id]);
  }

  static create(tableName, columns, item) {
    var query = 'INSERT INTO ' + tableName + ' (';
    for(var i=0; i < columns.keys.length; i++) {
        query += columns.keys[i];
        if(i < columns.keys.length - 1) {
          query += ',';
        }
    };
    query += ') VALUES (';
    for(var i=0; i < columns.keys.length; i++) {
        query += '?';
        if(i < columns.keys.length - 1) {
          query += ',';
        }
    };
    query += ') ';
    // ------------ prepare values -----------
    item.created = new Date().toString();
    item.updated = new Date().toString();

    var values = [];
    for(var i=0; i < columns.keys.length; i++) {
        values.push(item[columns.keys[i]]);
    };
    // run query
    return dao.run(query, values);
  }

  static update(tableName, columns, item) {
    // ------------ prepare values -----------
    item.updated = new Date().toString(); // updated time

    var query = `UPDATE ` + tableName + '\nSET';
    for(var i=0; i < columns.keys.length; i++) {
      if(item[columns.keys[i]] != undefined) {
        query += ' ' + columns.keys[i] + ' = ?,';
      }
    };
    query = query.slice(0, -1);
    query += '\nWHERE id = ?;';

    var values = [];
    for(var i=0; i < columns.keys.length; i++) {
      if(item[columns.keys[i]] != undefined)
        values.push(item[columns.keys[i]]);
    };
    values.push(item['id']);
    // run query
    return dao.run(query, values);
  }

  static getAll(tableName, params) {
    var limit = params.limit;
    var offset = params.offset;
    var ownerId = params.owner_id;
    var orderByStatus = params.order_by_status;

    var query = `SELECT * FROM ` + tableName +
      (ownerId?` WHERE owner_id = ` + ownerId:'') +
      ` ORDER BY id ASC` +
      (orderByStatus? `, status ASC`:'') +
      (limit?` LIMIT ` + limit:'') +
      (offset?' OFFSET ' + offset:'') + ';';

    return dao.all(query);
  }


  static getById(tableName, id) {
    var query = `SELECT * FROM ` + tableName + ' WHERE id = ?';
    return dao.get(query, [id]);
  }

  static updateStatus(tableName, id, status) {
    var query = `
    UPDATE ` + tableName
    + ` SET status = ?
    WHERE id = ?;
    `;
    return dao.run(query, [status, id]);
  }

  static count(tableName) {
    return dao.get('SELECT count(*) FROM ' + tableName + ';');
  }

}

module.exports = Model;
