'use strict';

/**
 * Challenge model test.
 */
var should = require('should');
var config = require('config');
var datasource = require('./../../datasource');
datasource.init(config);
var db = datasource.getDataSource();
var sequelize = db.sequelize;
sequelize.options.logging = false;   // turn of sequelize logging.
var Pet = db.Pet;


/**
 * Globals
 */
var data;
var entity;

/**
 * Test Challenge model CRUD operations
 */
describe('<Unit Test>', function() {
  this.timeout(15000);
  describe('Model Pets:', function() {
    beforeEach(function(done) {
      // challenge data
      data = {
        name: 'Hi MOm',
        tags: ['tag1', 'tag2']
      };
      done();
    });

    describe('Method Save', function() {
      it('should able to save without problems', function(done) {
        // create a entity
        Pet.create(data).success(function(savedEntity) {
          savedEntity.id.should.be.a.Number;
          savedEntity.id.should.not.have.length(0);
          savedEntity.title.should.equal(data.name);
          savedEntity.tags.should.equal(data.tags);
          done();
        })
          .error(function(err) {
            should.not.exist(err);
            done();
          });
      });

    });

    describe('Method Find/Update/Delete', function() {
      beforeEach(function(done) {
        // create a entity
        Pet.create(data).success(function(savedEntity) {
          entity = savedEntity;
          done();
        });
      });

      it('should able to find all challenges', function(done) {
        // find all entities
        Pet.findAll().success(function(allEntities) {
          allEntities.length.should.be.greaterThan(0);
          done();
        })
          .error(function(err) {
            should.not.exist(err);
            done();
          });
      });

      it('should able to find a challenge with valid id', function(done) {
        // get an entity
        Pet.find(entity.id).success(function(retrievedEntity) {
          retrievedEntity.id.should.equal(entity.id);
          retrievedEntity.title.should.equal(entity.name);
          done();
        })
          .error(function(err) {
            should.not.exist(err);
            done();
          });
      });


      it('should not able to find a challenge with invalid id', function(done) {
        // get an entity
        Challenge.find(999999).success(function(retrievedEntity) {
          should.not.exist(retrievedEntity);
          done();
        })
          .error(function(err) {
            should.exist(err);
            done();
          });
      });

      it('should able to update a challenge with valid id', function(done) {
        entity.name = 'Modified';
        // update an entity
        entity.save().success(function(updatedEntity) {
          updatedEntity.id.should.equal(entity.id);
          updatedEntity.name.should.equal('Modified');
          done();
        })
          .error(function(err) {
            should.not.exist(err);
            done();
          });
      });

      it('should able to delete a challenge', function(done) {
        // delete an entity
        entity.destroy().success(function() {
          done();
        })
          .error(function(err) {
            should.not.exist(err);
            done();
          });
      });

    });

    afterEach(function(done) {
      if (entity) {
        entity.destroy().success(function() {
          entity = undefined;
          done();
        })
          .error(function(err){
            done(err);
          });
      } else {
        done();
      }

    });
  });
});
