/**
 * @fileOVerview
 * Sample Model - Contains a sound and extra meta-data.
 */

define([
  'underscore',
  'backbone',
  'models/sound'
],

/**
 * @returns {Backbone.Model}
 */
function(_, Backbone, Sound) {
  'use strict';

  var Sample;

  /**
   * @constructor
   */
  Sample = Backbone.Model.extend({

    defaults: {
      name: ''
    },

    /**
     * @public
     */
    initialize: function () {
      this.sound = new Sound();
    }

  });

  return Sample;
});
