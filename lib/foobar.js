// For CommonJS/AMD compatibility
if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function () {
  'use strict';

  return {
    doFoo: function () {
      return 'foo';
    },
    doBar: function () {
      return 'bar';
    }
  };

});
