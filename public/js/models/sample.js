/**
 * @fileOVerview
 * Sample Model - Contains a sound and extra meta-data.
 */

define([
  'underscore',
  'backbone',
  'AudioContext',
  'models/sound'
],

/**
 * @returns {Backbone.Model}
 */
function(_, Backbone, AudioContext, Sound) {
  'use strict';

  var Sample;

  /**
   * @constructor
   */
  Sample = Backbone.Model.extend({

    defaults: {
      /**
       * @type {AudioContext}
       */
      context: null,
      /**
       * @type {AudioNode}
       */
      outputNode: null,
      /**
       * User defined sample name.
       * @type {string}
       */
      name: '',
      /** @type {boolean} */
      loaded: false,
      /**
       * Optional position info for the sample.
       * @type {number}
       */
      position: 0
    },

    /**
     * @public
     */
    initialize: function () {
      var context = this.get('context');
      this.sound = new Sound({
        context: context,
        outputNode: this.get('outputNode')
      });
      this.sound.on('change:loaded', function (e) {
        this.set('loaded', true);
      }, this);
    },

    loadFile: function (file) {
      this.sound.loadFile(file);
      this.set('name', file.name);
    },

    loadSound: function (data) {
      this.sound.loadData(data);
    },

    play: function () {
      this.sound.play();
    },

    stop: function () {
      this.sound.stop();
    },

    save: function () {
      var xhr = new XMLHttpRequest(),
          formData = new FormData();

      formData.append('sound', this.sound.getSoundDataBlob(), this.get('name'));
      // TOOD: save position information?

      xhr.open('POST', '/upload');
      xhr.onload = function () {
        if (xhr.status === 200) {
          console.log('all done: ' + xhr.status);
        } else {
          console.log('Something went terribly wrong...');
        }
      };

      xhr.send(formData);
    }

  });

  return Sample;
});
