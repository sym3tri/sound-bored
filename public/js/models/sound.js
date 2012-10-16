/**
 * @fileOVerview
 * Model for an actual playable sound.
 * Implemented using the W3C Web Audio API: http://www.w3.org/TR/webaudio/
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
      /**
       * Entry point to the Web Audio API.
       * @type {AudioContext}
       */
      context: null,
      /**
       * Raw sound data loaded from a file.
       * @type {ArrayBuffer}
       */
      soundData: null,
      /**
       * Sound data decoded from the file.
       * @type {AudioBuffer}
       */
      decodedAudioBuffer: null,
      /**
       * To control gain for all voices of this sound.
       * @type {AudioGainNode}
       */
      gainNode: null,
      /**
       * Where the output should be routed.
       * @type {AudioNode}
       */
      outputNode: null,
      /**
       * Analyser node to detect frequency/amplitude changes.
       * @type {RealtimeAnalyserNode}
       */
      analyser: null,
      /**
       * Indicates if sound data has loaded or not.
       * @type {boolean}
       */
      loaded: false,
      /** @type {boolean} */
      isPlaying: false
    },

    /**
     * @public
     */
    initialize: function () {
      /**
       * Reference to all playback buffers (Notes).
       * @type {AudioBufferSourceNode}
       */
      this.audioNodes = [];
    },

    /**
     * @return {Blob}
     */
    getSoundDataBlob: function () {
      return new Blob([new Uint8Array(this.get('soundData'))]);
    },

    /**
     * @param {string} url Url from which to load file.
     */
    loadUrl: function (url) {
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';

      // Decode asynchronously
      request.onload = _.bind(function() {
        this.loadData(request.response);
      }, this);
      request.send();
    },

    /**
     * @param {File} file
     */
    loadFile: function (file) {
      var fileReader = new FileReader();
      fileReader.onload = _.bind(function (e) {
        this.loadData(e.target.result);
      }, this);
      fileReader.readAsArrayBuffer(file);
    },

    /**
     * @param {ArrayBuffer} data
     */
    loadData: function (data) {
      this.set('soundData', data);
      this.get('context').decodeAudioData(
        data,
        _.bind(function (decodedAudioBuffer) {
          this.set({
            decodedAudioBuffer: decodedAudioBuffer,
            loaded: true
          });
        }, this),
        _.bind(function () {
          console.error('error decoding sound data');
        }, this)
      );
    },

    /**
     * Creates a new AudioNode instance and sets a reference in the base sound
     * object.
     */
    createAudioNode: function () {
      var context = this.get('context'),
          audioNode = context.createBufferSource();
      audioNode.buffer = this.get('decodedAudioBuffer');
      this.audioNodes.push(audioNode);
      return audioNode;
    },

    connectAnalyser: function (audioNode) {
      var context = this.get('context'),
          analyser = context.createAnalyser();
      analyser.fftSize = 128;
      audioNode.connect(analyser);
      this.set('analyser', analyser);
    },

    connectGain: function (audioNode) {
      var context, gainNode;
      if (!this.get('gainNode')) {
        context = this.get('context');
        gainNode = context.createGainNode();
        gainNode.connect(this.get('outputNode') || context.destination);
        this.set('gainNode', gainNode);
      } else {
        gainNode = this.get('gainNode');
      }
      audioNode.connect(gainNode);
    },

    disposeVoice: function (voice) {
      this.audioNodes[this.audioNodes.indexOf(voice)] = null;
      this.audioNodes = _.compact(this.audioNodes);
    },

    stop: function () {
      if (!this.get('loaded') || !this.get('isPlaying')) {
        return;
      }
      this.audioNodes.forEach(function (audioNode) {
        audioNode.noteOff(0);
      });
      this.audioNodes = [];
      this.set('isPlaying', false);
      this.trigger('stop');
    },

    play: function () {
      var context,
          audioNode;

      if (!this.get('loaded')) {
        return;
      }
      context = this.get('context');
      audioNode = this.createAudioNode();
      this.connectGain(audioNode);
      //this.connectAnalyser(audioNode);
      //audioNode.connect(context.destination);
      audioNode.noteOn(0);
      // Remove references to the voice once play duration has passed.
      _.delay(
          _.bind(this.disposeVoice, this, audioNode),
          this.getDuration() * 1000);
      this.set('isPlaying', true);
      this.trigger('play');
    },

    getDuration: function () {
      return this.get('decodedAudioBuffer').duration;
    }

  });

  return Sound;
});
