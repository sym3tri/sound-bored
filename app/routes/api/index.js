(function () {
  'use strict';

  module.exports = function (app) {
    return {
      sampler: require('./sampler')(app)
    };
  };

}());
