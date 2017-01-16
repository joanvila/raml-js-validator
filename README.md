# RAML 1.0 validator

[![Build Status](https://travis-ci.org/joanvila/raml-js-validator.svg?branch=master)](https://travis-ci.org/joanvila/raml-js-validator)
[![Coverage Status](https://coveralls.io/repos/github/joanvila/raml-js-validator/badge.svg?branch=master)](https://coveralls.io/github/joanvila/raml-js-validator?branch=master)
[![Dependency Status](https://david-dm.org/joanvila/raml-js-validator/status.svg)](https://david-dm.org/joanvila/raml-js-validator)
[![devDependency Status](https://david-dm.org/joanvila/raml-js-validator/dev-status.svg)](https://david-dm.org/joanvila/raml-js-validator?type=dev)

Simple **RAML 1.0** validator that reads a file containing an API definition and performs a query to each endpoint to check that the RAML matches the backend implementation.
It pretends to be a way to prevent the RAML file to be outdated by triggering an error when it doesn't mach with the API. It can be used manually or in a CI environment in order to check the consistency on every build.

## Installation

Install it globally with:

```
npm install -g raml-js-validator
```

If you don't want to install it globally you will need to run it as `node_modules/.bin/raml-validate` instead of `raml-validate`

## How to use it

To use it, you can simply run this command:

```
raml-validate path/to/file.raml
```

This command will read the RAML definition in the file `file.raml` and query the backend for each endpoint. If the response codes match the ones specified, no error will be reported. However, if an endpoint fails, an exception will be thrown.

If you want to test the RAML against a different host than the one specified in the RAML file, you can do it this way:

```
raml-validate path/to/file.raml --target http://localhost:8080
```

The `--target` option sets the target server url. If it is not present, it will look for the `baseUri` attribute in the RAML file. Again, if the RAML doesn't contain any `baseUri`, the default `http://localhost:8080` will be used. Note that you can change the default host defined in the file `config.js`.

## Checking response codes

In order to say if a response code is valid or not, `raml-validate` uses two priorities. By default, if the RAML file contains the response codes, those will be considered the accepted ones and the check will fail if the real response code is not one of those.

However, if the response codes are not present in the API definition, the only accepted code will be the 200 one. Again, you can change the default accepted response codes in the file `config.js`.

## Checking the response schema

By default, `raml-validate` doesn't check the response schema. If you want to check it, you can use the option `--validate-response`. This option will check that the first level of the json keys returned from the API matches the ones defined in the RAML. In the next versions, there will be an option to check all the schema recursively.

Note that to validate the response, you need to have an example response defined in the RAML apart from the type definition. Check the example for more details.

## Sending uri parameters

In order to allow `raml-validate` to check the API with the appropriate uri parameters you should define them with examples:

```
/task/{taskid}:
    uriParameters:
        taskid:
            type: integer
            example: 3

    get:
        ...
```

If a parameter doesn't have an example, a non deterministic value will be used instead.

## Sending query parameters

Query parameters will be sent to the API if they are defined with an example value:

```
/url/with/params:
    get:
        queryParameters:
            today:
                type: date-only
                required: true
                example: 2016-11-23
            tomorrow:
                type: date-only
                required: false
                example: 2016-11-24
```

In this case, the tested endpoint would be `baseUri/url/with/params?today=2016-11-23&tomorrow=2016-11-24`. Note that required field doesn't affect.

## Sending post data in the request body

In some cases, it is necessary to send data in the body of the request. Specially in `POST` methods. `raml-validate` supports it according to the RAML 1.0 syntax:

```
/task:
    post:
        description: |
            Creates a task
        body:
            application/x-www-form-urlencoded:
                properties:
                    name:
                        description: Nam of the task
                        type: string
                        example: Code things
                    owner:
                        description: Who's going to do it
                        type: string
                        example: Joan
```

In this case, the body of the request would contain the corresponding data in JSON format:

```
{
    name: "Code things",
    owner: "Joan"
}
```

## Running and testing the example

If you browse into the package contents you will find an `examples` folder. There, you can find an example API and it's own RAML definition. In order check how it works, from a terminal in the directory of the module run:

```
node examples/server.js
```

This will start the API. Then from another terminal in the same directory, run:

```
raml-validate examples/definition.raml
```

You will see that all the endpoints are correct except from the `/unexisting` endpoint.

## Contributing

See the `CONTRIBUTING.md` file.

## License

MIT License (c) 2016 Joan Vilà Cuñat
