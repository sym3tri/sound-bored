(function () {
  'use strict';

  var express = require('express'),
      app = module.exports = express(),
      config = require('./config.js')(app, express),
      routes = require('./routes')(app),
      port = process.env.PORT || 3000;

  app.listen(port, function () {
    console.log('Express server listening on port %d in %s mode',
      port, app.settings.env);
  });

}());
