This is a walk through of building a nodeJS micro service using the serenely modules.  We will implement the petstore example from wordnik (http://petstore.swagger.wordnik.com/).  This is the example which is used to demonstrate a swagger specificaiton.

Swagger Spec: https://github.com/swagger-api/swagger-spec/blob/master/examples/v2.0/yaml/petstore-expanded.yaml

Each step will be a new git tag with new instructions in this file.

## High Level Steps to implementing a new API

1. Create Swagger Document
1. Create Tests
1. Create Schema
1. Create Models
1. Create Controllers
1. Implement Authorization
1. Setup configuration

### Prereqresits software

* Postgres
* node
* npm

### Base

This is the base repository with the boilerplate code to get your started.  It contains the following files.

* app.js: All the code you need to bootstrap the application
* datasource.js: Initializes the Database and the models
* Grunt.js: Contains several grunt tasks to help automate development
    * default: Runs jshint on all models and controllers, starts the node process with certain environmental variables.
    * test: Runs tests, validates the swagger yaml file and runs jshint.
    * dbmigrate:up: Run the migration scripts on the database.  The database should be configured to point to a test database.
    * dbmigrate:down: Back down a database migration
    * yamTest: Validate the swagger yaml file
    * cleandb: Run all of the down migrations then re rerun the ups.
* newrelic.js: Newrelic configuration file
* Procfile: Heroku process control
* sample.env: A sample file to be used as .env

### Part 1 Create the Swagger Document

Swagger is used to built out the routes and API documentation.  We take a [Documentation first](http://appirio.com/category/tech-blog/2014/10/writing-documentation-first-api) approach to building API's.

We will be using the modified version of the swagger file from https://github.com/swagger-api/swagger-spec/blob/master/examples/v2.0/yaml/petstore-expanded.yaml.  The differences being in removing the "allOf" which is not supported and adding a few a127 specific elements.  The a127 elements will be described when we use them.

1. Create a new file at `api/swagger/swagger.yaml`
2. Use this swagger file: https://gist.github.com/indytechcook/6c6dd0f3e3d68dee853b
3. 	Run `node app.js`
4. Go to `http://localhost:10010/docs`

At this point you should have a working Swagger UI.  We don't have any functional API's yet but you have the beginnings on one.

### Part 2 Create the Test

Like any good application developer, we will follow TDD (Test Driven Development) and create our tests.

Included in the code base is mocha, should and supertest to help you write your tests.  The tests included are very limited and should be expanded to include the /pets quering and error responses.

Before we can run the tests, we will need to setup our database.

1. Create a database named `petstore`
2. Update the local.yaml file with your postgres connection url `postgres://postgres@localhost:5432/petstore`

At this point you should be able test with all of them failing.

