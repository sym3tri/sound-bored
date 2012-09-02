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
      name: '',
      loaded: false
    },

    /**
     * @public
     */
    initialize: function () {
      this.sound = new Sound();
      this.sound.on('loaded', _.bind(function (e) {
        this.set('loaded', true);
        this.trigger('loaded');
      }, this));
    },

    loadSound: function (data) {
      this.sound.loadData(data);
    },

    play: function () {
      if (this.get('loaded')) {
        this.sound.play();
      }
    }

  });

  return Sample;
});
