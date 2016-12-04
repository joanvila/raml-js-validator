#!/usr/bin/env node

'use strict';

const raml = require('raml-1-parser');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

const Validator = require('../lib/validator');

const argv = yargs
    .usage('Usage:\n  raml-validate.js </path/to/raml> [options]')

    .help('h')
    .alias('h', 'help')

    .option('t', {
        alias: 'target',
        demand: false,
        describe: 'The endpoint to test',
        type: 'string'
    })

    .option('r', {
        alias: 'validate-response',
        demand: false,
        describe: 'Validate the response schema',
        type: 'boolean'
    })

    .example('raml-validate definition.raml', '--target http://localhost:8080')
    .example('raml-validate definition.raml', '--validate-response')

    .check(argv => {
        if (argv._.length < 1) {
            throw new Error('raml-validate.js: Must specify path to RAML file');
        }
        return true;
    })

    .epilog('More info and docs:\n' +
    '  ' + 'https://github.com/joanvila/raml-js-validator')
    .argv;

const fileName = path.resolve(process.cwd(), argv._[0]);

let api = null;

try {
    api = raml.loadApiSync(fileName, {rejectOnErrors: true});
} catch (err) {
    err.parserErrors.forEach((parserError) => {
        console.log('Parsing error: ' + parserError.message);
    });
    throw err.message;
}

console.log('RAML parsing success. Querying the API now...');

const validator = new Validator(
    api,
    argv.target,
    argv['validate-response']
);
validator.validate();
