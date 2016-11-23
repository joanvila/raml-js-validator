#!/usr/bin/env node

'use strict';

const raml = require('raml-1-parser');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

const Validator = require('../lib/validator');

const argv = yargs
    .usage('Usage:\n  raml-validate.js </path/to/raml> [target]' +
    '\n\nExample:\n  ' + 'raml-validate definition.raml --target http://localhost:8080')
    .check(argv => {
        if (argv._.length < 1) {
            throw new Error('raml-validate.js: Must specify path to RAML file');
        }
        return true;
    })
    .epilog("Website:\n  " + 'https://github.com/joanvila/raml-js-validator')
    .argv;

const fileName = path.resolve(process.cwd(), argv._[0]);

const api = raml.loadApiSync(fileName, {rejectOnErrors: true});

console.log('RAML parsing success. Querying api now...');

const validator = new Validator(api, argv.target);
validator.validate();
