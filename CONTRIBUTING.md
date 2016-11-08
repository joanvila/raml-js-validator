# Contributing to raml-js-validator

We're glad you want to make a contribution!

If you want to discuss or make a change, start by opening an [issue](https://github.com/joanvila/raml-js-validator/issues). Then fork this repository and in a new branch make your changes. Once it's done, submit your pull request.

Take note of the build status of your pull request, only builds that pass will be accepted. Please also keep to our conventions and style so we can keep this repository nice and clean.

## Working locally

Once you have forked the repo and it is cloned to your local machine run this command:

```
npm install && npm link
```

This will install all the dependencies and add the `raml-validate` command to your path.

At this point you can do your changes. You can test them manually using the example API and RAML you can find in the `examples` directory. Feel free to improve the example too.

## Testing

Each contribution should come with it's own tests. In order to run them, use:

```
grunt test
```

The testing is being done using:

- [Mocha](https://mochajs.org) as the testing framework.
- [Chai](http://chaijs.com) as the assertion library.
- [Sinon](http://sinonjs.org) as a provider for spies, stubs and mocks.