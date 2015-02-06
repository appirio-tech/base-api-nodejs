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

### Step 1 Create the Swagger Document

Swagger is used to built out the routes and API documentation.  We take a Documentation first approach to building API's.