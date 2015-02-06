'use strict';

var config = require('config');

var datasource = require('./../../datasource');
datasource.init(config);
var db = datasource.getDataSource();

module.exports = {
  db: db
};