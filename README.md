# RAML 1.0 validator

Simple RAML 1.0 validator that reads a RAML definition and performs a query to the endpoint to check the return codes.

## How to use

If you don't have the package installed globally, you can run `npm link` from the project root in order to add the raml-test command to your path.

To use it, you can simply type:

```
raml-validate path/to/file.raml --target http://localhost:8080
```

The `--target` option sets the target server url. If it is not present, the default http://localhost:8080 will be used.

## Installation

```
npm install
```

In order to add the raml-test command to your path, run this:

```
npm link
```
