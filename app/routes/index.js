(function () {
  'use strict';

  module.exports = function (app) {
    return {
      home: require('./home')(app),
      upload: require('./upload')(app),
      api: require('./api')(app)
    };
  };

}());
