(function () {
  'use strict';

  var redis = require('redis');
  module.exports = function (app) {

    app.get('/api/sampler', function (req, res) {
      res.send(200, { name: 'foo bar test' });
    });

  };

}());
