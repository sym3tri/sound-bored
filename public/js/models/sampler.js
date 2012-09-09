/**
 * @fileOVerview
 * Sample Model - Contains a sound and extra meta-data.
 */

define([
  'underscore',
  'backbone',
  'AudioContext',
  'models/sound',
  'models/sample',
  '../collections/samples'
],

/**
 * @returns {Backbone.Model}
 */
function(_, Backbone, AudioContext, SoundModel, Sample, Samples) {
  'use strict';

  var Sampler;

  /**
   * @constructor
   */
  Sampler = Backbone.Model.extend({

    defaults: {
      /**
       * @type {AudioContext}
       */
      context: null,
      name: '',
      totalRows: 4
    },

    /**
     * @public
     */
    initialize: function () {
      var testSamples = [],
          context = new AudioContext(),
          i;
      this.set('context', context);
      this.masterOut = context.createGainNode();
      this.masterOut.connect(context.destination);
      for (i=1; i<=16; i+=1) {
        testSamples.push({
          context: context,
          name: 'sample #' + i,
          outputNode: this.masterOut
        });
      }
      this.samples = new Samples(testSamples);
    },

    getLoadedSamples: function () {
      return this.samples.filter(function (sample) {
        return sample.get('loaded');
      });
    },

    setVolume: function (volume) {
      this.masterOut.gain.value = volume / 100;
    },

    //getPlayingSamples: function () {
      //return this.getLoadedSamples().filter(function (sample) {
        //return sample.isPlaying();
      //});
    //},

    /**
     * Stop all the samples.
     */
    stopAll: function () {
      this.samples.forEach(function (sample) {
        sample.stop();
      });
    },

    save: function () {
      this.getLoadedSamples().forEach(function (sample) {
        sample.save();
      }, this);
    }

  });

  return Sampler;
});
