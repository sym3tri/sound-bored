(function () {
  'use strict';

  var path = require('path'),
      middleware = require('../lib/middleware');

  module.exports = function (app, express) {

    // General Config
    app.configure(function () {
      app.set('views', __dirname + '/views');
      app.set('view engine', 'hbs');
      app.use(express.methodOverride());
      app.use(express.static(path.join(__dirname, '..', 'public')));
      app.use(express.bodyParser({
        limit: 1000000, // 1MB
        keepExtensions: true,
        uploadDir: __dirname + '/uploads'
      }));
      app.use(app.router);
    });

    app.configure('development', function () {
      app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

    app.configure('production', function () {
      app.use(express.errorHandler());
    });

    return this;
  };

}());
