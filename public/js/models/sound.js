/**
 * @fileOVerview
 * Model for actualy playable sound.
 */

define([
  'underscore',
  'backbone',
  'AudioContext'
],

/**
 * @returns {Backbone.Model}
 */
function(_, Backbone, AudioContext) {
  'use strict';

  var Sound;

  /**
   * @constructor
   */
  Sound = Backbone.Model.extend({

    defaults: {
      filePath: null,
      buffer: null,
      context: null,
      analyser: null,
      bufferSource: null,
      isPlaying: false
    },

    /**
     * @public
     */
    initialize: function () {
      this.set('context', new AudioContext());
      this.loaded_ = false;
    },

    isLoaded: function () {
      return this.loaded_;
    },

    load: function(url) {
      var request = new window.XMLHttpRequest();
      request.open('GET', this.get('filePath'), true);
      request.responseType = 'arraybuffer';

      // Decode asynchronously
      request.onload = _.bind(function() {
        this.get('context').decodeAudioData(request.response,
        _.bind(function (buffer) {
          this.set('buffer', buffer);
          this.loaded_ = true;
          this.trigger('loaded');
          console.log('sound loaded.');
        }, this),
        function () {
          console.log('error loading sound');
        });
      }, this);
      request.send();
    },

    stop: function () {
      this.get('bufferSource').noteOff(0);
      this.set('isPlaying', false);
      this.trigger('stop');
    },

    play: function () {
      var context = this.get('context'),
          source;
      this.createBufferSource();
      source = this.get('bufferSource');
      this.connectAnalyser();
      source.connect(context.destination);
      source.noteOn(0);
      this.set('isPlaying', true);
      this.trigger('play');
    },

    createBufferSource: function () {
      var context = this.get('context'),
          source = context.createBufferSource();
      source.buffer = this.get('buffer');
      this.set('bufferSource', source);
    },

    connectAnalyser: function () {
      var context = this.get('context'),
          source = this.get('bufferSource'),
          analyser = context.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      this.set('analyser', analyser);
    }

  });

  return Sound;
});
