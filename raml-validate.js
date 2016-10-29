#!/usr/bin/env node

var raml = require("raml-1-parser");
var fs = require("fs");
var path = require("path");

// Here we create a file name to be loaded
var fName = path.resolve(__dirname, "test/definition.raml");

// Parse our RAML file with all the dependencies
var api = raml.loadApiSync(fName, {rejectOnErrors: true});
console.log(JSON.stringify(api.toJSON(), null, 2));
