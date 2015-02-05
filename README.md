## [REPLACE WITH YOUR REPO NAME]

The [REPLACE WITH YOUR REPO NAME] was initially built using the [Apigee a127 scaffolding](https://github.com/apigee-127/a127-documentation/wiki).

Routing is handled by using the swagger config file at api\swagger\swagger.yaml.
Routing is done using [swagger tools](https://github.com/apigee-127/swagger-tools) and the [a127-magic](https://github.com/apigee-127/magic) modules.

## What's included

* Swagger API integrating using swagger-tools
* newrelic integration.  Set the NEW_RELIC_LICENSE_KEY variable to the key and update newrelic.js
* configuration mgmt using the node-config module
* postgres database bootstrapping and schema mgmt using dbmigrate
* tests using Mocha
* travis CI integration
* router, param and controller helper files
* built in swagger UI at /docs

## Samples

You can see sample implementations of this code base:
* https://github.com/appirio-tech/lc1-challenge-service

## Swagger

The documentation for the API and resources are in swagger.  You can view the swagger config using a127 tools or the built in Swagger UI.

To Edit/view swagger config run ```a127 project edit``` from project root
You can also view the swagger config via the /docs url when the project is running.


## Swagger validation

You can test the validity of a swagger configuration file by running ```grunt yamlTest```.  **All challenges must have a valid yaml file.**


## Configuration

Configuration is stored in the /config/*.yaml files.  The [node config](https://github.com/lorenwest/node-config) module is used to load configuration.

Please see the config documentation:  https://github.com/lorenwest/node-config/wiki

The "local" config files are all ignored in git.

Configuration:

```yaml
    app:
        port: 1234 #port to launch
        pg:
            dialect: postgres
            database: serenity_discussions
            username: username
            password: password
            host: host
            port: 5432
        pgURL:
        loadDoc: true
        docOnly: false
        query:
            pageSize: 20
```

* For the database connection you can either use the pg object or the pgURL.  The pgURL is looked for first and will override the pg.
* loadDoc:  Load Swagger UI. See Built in Swagger Documentation section of readme.
* docOnly:  Do not load a127 middleware.  See Built in Swagger Documentation section of readme.
* settings for default query paramater
    * pageSize:  the number of records to return in a request


### Built in Swagger Documentation

A built [swagger_ui](https://github.com/wordnik/swagger-ui) can be enabled for the project by setting the ```app.loadDoc = true``` in the yaml configuration under /config.  This will make the UI available at /docs and a json feed for the swagger document available at /api-docs

The server can be a documentation only server by setting ```app.docOnly = true``` in the yaml configuration under /config.  This is useful if you have a yaml but no controllers.


## Models

Use a model:

Example for Message model

```javascript
var datasource = require('serenity-datasource');
var Message = datasource.Message;

// Message is now a Sequelize Model
```

## Node.js design guide.

Please follow Joyent's NodeJS design guide:  https://www.joyent.com/developers/node/design
Please use 2 spaces instead of tabs.
Please use lodash instead of underscore.

## Database Migrations

All tables should be setup using [db-migrate](https://github.com/kunklejr/node-db-migrate) with migration files in config/schema-migrations.

Migration can be run via grunt ```grunt dbmigrate```

## Running the server

You can run the server using ```grunt``` which will use the local config.

## Tests

Tests are built using mocha tests.   They can be run with ```grunt test```.
Any example postman configuration files should be in at test/postman.  This can be imported into Postman for testing.
