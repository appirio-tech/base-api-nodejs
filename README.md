This is a walk through of building a nodeJS micro service using the serenely modules.  We will implement the petstore example from wordnik (http://petstore.swagger.wordnik.com/).  This is the example which is used to demonstrate a swagger specificaiton.

Swagger Spec: https://github.com/swagger-api/swagger-spec/blob/master/examples/v2.0/yaml/petstore-expanded.yaml

Each step will be a new git tag with new instructions in this file.

## High Level Steps to implementing a new API

1. Create Swagger Document
1. Create Tests
1. Create Schema
1. Create Models
1. Create Controllers
1. Wire it all up

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

### Part 3 Create Schema

Since we have a fully documented API in teh swagger.yaml file, we can pull out the implied database schema.

Looking at the definitions section we see the following:

      Pet:
        required:
          - id
          - name
        properties:
          id:
            type: integer
            format: int64
          name:
            type: string
          tag:
            type: string


This translates to the following in postgres.

```
CREATE TABLE pets
(
  id integer NOT NULL,
  name character varying,
  tag text,
  CONSTRAINT pets_pkey PRIMARY KEY (id)
)
```

Let's add this to our schema migration.

1. Run `grunt migrate:create:add-pets` to generate the migration file.
2. Update the migrtion script with the following:

```javascript
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
```

3. Run `grunt dbmigrate` to create the table.

Now you have a working database migration stored in a file which will be easy to deploy.

### Part 4 Create Models

Now let's define our models to match our database schema.  We use [Sequlize](http://sequelizejs.com/) as our ORM to connect to PostgreSQL.  The connection it bootstrapped via the datasource.js file and the serenity-datasource npm module.  The models are imported using the [Sequelize.import](http://sequelize.readthedocs.org/en/latest/docs/models/index.html#import) command

Our models expect a function where the sequlize object is the first argument and the DataTypes are the second.

1. In the folder `api/models` create a file called `pet.js`
2. Paste in the following:

```javascript
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
```

We defined the model to match the database schema and the structure of the swagger yaml Pet definition.
  
### Part 5 Create the controllers

Creating the controllers are very easy using the serenity-controller-helper module.  The controller helper builds out common functionality for controllers.  We can create the controller needed for to access the Pet data with only 14 lines of code:

```javascript
'use strict';

var datasource = require('./../../datasource').getDataSource();
var Pet = datasource.Pet;
var serenityControllerHelper = require('serenity-controller-helper');
var config = require('config');
var controllerHelper = new serenityControllerHelper(config);

// build controller
var petController = controllerHelper.buildController(Pet, [], {filtering: true});

module.exports = {
  findPets: petController.all,
  addPet: petController.create,
  findPetById: petController.get,
  updatePet: petController.update,
  deletePet: petController.delete
};
```

### Part 6 Wire it all up

In the app.js file we wire up all of the middlewares.

Wire up the database.

```javascript
  datasource.init(config);
```

Allow the use of the Google Partial Respone Pattern to access related Data.  See below for examples.

```javascript
  partialResponseHelper = new ResponseHelper(datasource);
  app.use(partialResponseHelper.parseFields);
```

Go a127 Go!

```javascript
  app.use(a127.middleware(swaggerConfig));
```

Display the swagger documentation UI

```javascript
  // Serve the Swagger documents and Swagger UI
  if (config.has('app.loadDoc') && config.get('app.loadDoc')) {
    // adding ui options
    var swaggerTools = swaggerConfig['a127.magic'].swaggerTools;
    app.use(swaggerTools.swaggerUi({
      swaggerUi: config.ui.swaggerUi,
      apiDocs: config.ui.apiDocs
    }));
  }
```


Add an error handing

``` javascript
  // Add logging
  app.use(function(err, req, res, next) {
    if (err) {
      winston.error(err.stack || JSON.stringify(err));
      routeHelper.middleware.errorHandler(err, req, res, next);
    } else {
      next();
    }
  });
```

Respond with JSON

```javascript
  // render response data as JSON
  app.use(routeHelper.middleware.renderJson);
```

GO SERVER GO!

```javascript
  app.listen(port);
```


