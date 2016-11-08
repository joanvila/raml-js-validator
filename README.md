# RAML 1.0 validator

[![Build Status](https://travis-ci.org/joanvila/raml-js-validator.svg?branch=master)](https://travis-ci.org/joanvila/raml-js-validator)
[![Coverage Status](https://coveralls.io/repos/github/joanvila/raml-js-validator/badge.svg?branch=master)](https://coveralls.io/github/joanvila/raml-js-validator?branch=master)
[![Dependency Status](https://david-dm.org/joanvila/raml-js-validator/status.svg)](https://david-dm.org/joanvila/raml-js-validator)
[![devDependency Status](https://david-dm.org/joanvila/raml-js-validator/dev-status.svg)](https://david-dm.org/joanvila/raml-js-validator?type=dev)

Simple **RAML 1.0** validator that reads a file containing an API definition and performs a query to each endpoint to check that the RAML matches the backend implementation.
It pretends to be a way to prevent the RAML file to be outdated by triggering an error when it doesn't mach with the API. It can be used manually or in a CI environment in order to check the consistency on every build.

## How to use it

If you don't have the package installed globally, you can run `npm link` from the project root in order to add the raml-test command to your path.

To use it, you can simply type:

```
raml-validate path/to/file.raml
```

This command will read the raml definition in the file `file.raml` and query the backend for each endpoint. If the response codes are 200, no error will be reported. However, if an endpoint fails, an exception will be thrown.

If you want to test the raml against a host different than the one specified in the RAML, you can use this:

```
raml-validate path/to/file.raml --target http://localhost:8080
```

The `--target` option sets the target server url. If it is not present, it will look for the `baseUri` attribute in the RAML file. Again, if the RAML doesn't contain any `baseUri`, the default `http://localhost:8080` will be used. Note that you can change the default host defined in the file `config.js`

## Running the example

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
