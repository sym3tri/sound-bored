/**
 * @fileOverview
 * View that manages and renders the Home page.
 */

define([
  'jquery',
  'underscore',
  'backbone',
  'models/sound',
  'templates/home'
],
/**
 * @returns {Backbone.View}
 */
function($, _, Backbone, Sound, homeTpl) {
  'use strict';

  var HomeView;

  /**
   * @constructor
   */
  HomeView = Backbone.View.extend({

    /**
     * @private
     */
    template: homeTpl,

    /**
     * @private
     */
    events: {
      'click #start': 'onStartClick',
      'click #stop': 'onStopClick'
    },

    el: $('#main-container'),

    initialize: function () {
      // Bind all non-event handler methods to 'this'.
      _.bindAll(this, 'render');

      this.sound = new Sound({ filePath: '/sounds/beat.mp3' });
      this.sound.load();
    },

    /**
     * @public
     * @returns {Backbone.View}
     */
    render: function () {
      this.$el.html(this.template({
        // this should work if underscore.string was setup properly
        title: 'Home Title'
      }));

      return this;
    },


    // EVENT HANDLERS

    /**
     * @private
     * @param {Event} e
     */
    onStartClick: function (e) {
      if (this.sound.isLoaded()) {
        this.sound.play();
      }
    },

    onStopClick: function (e) {
      this.sound.stop();
    }

  });

  return HomeView;
});
