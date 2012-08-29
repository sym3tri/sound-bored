require.config({
  baseUrl: '../public/js/',

  paths: {
    'templates':            '../templates',
    'text':                 '../extern/require/text',
    'jquery':               '../extern/jquery/jquery-1.8.0',
    'backbone':             '../extern/backbone/backbone',
    'underscoreBase':       '../extern/underscore/underscore',
    'underscore':           'lib/underscore',
    'handlebars':           'lib/handlebars',
    'mocha':                '../../testrunner/mocha/mocha',
    'chai':                 '../../testrunner/chai/chai',
    'testlist':             '../../testrunner/testlist'
  },
  shim: {
    'underscoreBase': {
      deps: [],
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'mocha': {
      exports: 'mocha'
    },
    'chai': {
      deps: ['mocha'],
      exports: 'expect'
    }
  }

});

require([
  'require',
  'mocha',
  'chai',
  'testlist'
  ], function (require, mocha, chai, testList) {

  'use strict';

  window.expect = chai.expect;
  mocha.setup({ ui: 'bdd', reporter: mocha.reporters.HTML });

  require(testList, function () {
    // Add global reference to testrunner so scrapers can access it and
    // listen to its events.
    window.mochaphantom = {
      testrunner: mocha.run(),
      complete: false
    };
  });

});
