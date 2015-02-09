exports.up = function (db, callback) {
  db.createTable('pets', {
    id: { type: 'int', primaryKey: true },
    name: 'string',
    tag: 'text'
  }, callback);
};

exports.down = function (db, callback) {
  db.dropTable('pets', callback);
};
