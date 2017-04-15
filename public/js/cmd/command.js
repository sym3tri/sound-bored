define([
  'jquery',
  'underscore',
  'backbone'
],
function ($, _, Backbone) {
  'use strict';

  var Command = function (model, options) {
    this.model = model;
    this.options = options;
    this.deferred = $.Deferred();
  };
  // use same static extend function as models
  Command.extend = Backbone.Model.extend;

  _.extend(Command.prototype, Backbone.Events, {

    execute: function (options) {
      this.options = _.extend(this.options || {}, options);
    }

  });

  return Command;

});
