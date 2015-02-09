/**
 * Represent a Pet.
 */
'use strict';

/**
 * Defining Challenge model
 */
module.exports = function(sequelize, DataTypes) {

  var Pet = sequelize.define('Pet', {
    // primary key
    id: {
      type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true,
      get: function() {
        return parseInt(this.getDataValue('id'));
      }
    },
    name: DataTypes.STRING(140)
  });

  return Pet;

};
