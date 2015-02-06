'use strict';

var should = require('should');
var request = require('supertest');
var server = require('../../app');

var helper = require('./../helper/helper');

describe('controllers', function() {

  describe('pets', function() {
    var reqData;
    var petId;
    beforeEach(function(done) {
      reqData = {
        name: 'Cat'
      };
      done();
    });

    it('should be able to create a pet', function(done) {

      request(server)
        .post('/pets')
        .send(reqData)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          // verify response
          should.not.exist(err);

          res.status.should.equal(200);

          res.body.id.should.be.a.Number;
          res.body.name.should.equal('Cat');
          petId = res.body.id;
          done();
        });
    });

    it('should be able to return pets', function(done) {

      request(server)
        .get('/pets')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);

          res.status.should.equal(200);
          res.body.items.length.should.be.above(0);

          done();
        });
    });

    it('should be able to get a pet by id', function(done) {

      request(server)
        .get('/pets/' + petId)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);

          res.status.should.equal(200);
          res.body.id.should.equal(petId);
          res.body.name.should.equal('Cat');

          done();
        });
    });

    it('should be able to delete a pet', function(done) {
      request(server)
        .delete('/pets/' + petId)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(204)
        .end(function(err, res) {
          should.not.exist(err);

          res.status.should.equal(204);
          done();
        });
    })

  });
});

