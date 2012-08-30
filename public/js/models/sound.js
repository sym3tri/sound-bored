/**
 * @fileOVerview
 * A sample Backbone Model.
 */

define([
  'underscore',
  'backbone'
],

/**
 * @returns {Backbone.Model}
 */
function(_, Backbone) {
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
      bufferSource: null
    },

    /**
     * @public
     */
    initialize: function () {
      this.set('context', new webkitAudioContext());
      this.loaded_ = false;
    },

    isLoaded: function () {
      return this.loaded_;
    },

    load: function(url) {
      var request = new XMLHttpRequest();
      request.open('GET', this.get('filePath'), true);
      request.responseType = 'arraybuffer';

      // Decode asynchronously
      request.onload = _.bind(function() {
        this.get('context').decodeAudioData(request.response,
        _.bind(function (buffer) {
          this.set('buffer', buffer);
          this.trigger('loaded');
          this.loaded_ = true;
          console.log('sound loaded.');
        }, this),
        function () {
          window.alert('error loading sound');
        });
      }, this);
      request.send();
    },

    stop: function () {
      this.get('bufferSource').noteOff(0);
      clearInterval(this.analysisPollerId);
    },

    play: function () {
      // creates a sound source
      var source = this.get('context').createBufferSource(),
          analyser;
      // tell the source which sound to play
      source.buffer = this.get('buffer');

      // attach an anlayzer
      analyser = this.get('context').createAnalyser();
      analyser.fftSize = 2048;
      this.set('analyser', analyser);
      source.connect(analyser);


      // connect the source to the context's destination (the speakers)
      source.connect(this.get('context').destination);
      // play the source now
      source.noteOn(0);

      this.set('bufferSource', source);
      this.analysisPollerId = setInterval(_.bind(this.analyze, this), 500);
    },

    analyze: function () {
      var analyser = this.get('analyser'),
          //freqByteData = new Uint8Array(analyser.frequencyBinCount);
      //analyser.getByteTimeDomainData(freqByteData);
          freqByteData = new Float32Array(analyser.frequencyBinCount);
      analyser.getFloatFrequencyData(freqByteData);
      console.log(freqByteData);
    }

  });

  return Sound;
});
