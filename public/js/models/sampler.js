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
      created: null,
      updated: null,
      totalRows: 4,
      /**
       * To control gain for all samples.
       * @type {AudioGainNode}
       */
      masterOut: null,
      /**
       * Analyser node to detect frequency/amplitude changes.
       * @type {RealtimeAnalyserNode}
       */
      analyser: null
    },

    urlRoot: '/api/soundbored',

    /**
     * @public
     */
    initialize: function () {
      var testSamples = [],
          context = new AudioContext(),
          masterOut,
          i;
      this.set('context', context);
      masterOut = context.createGainNode();
      this.set('masterOut', masterOut);
      this.connectAnalyser(masterOut);
      masterOut.connect(context.destination);
      for (i=1; i<=16; i+=1) {
        testSamples.push({
          context: context,
          name: 'sample #' + i,
          outputNode: masterOut
        });
      }
      this.samples = new Samples(testSamples);
    },

    connectAnalyser: function (audioNode) {
      var context = this.get('context'),
          analyser = context.createAnalyser();
      analyser.fftSize = 256;
      audioNode.connect(analyser);
      this.set('analyser', analyser);
    },

    getLoadedSamples: function () {
      return this.samples.filter(function (sample) {
        return sample.get('loaded');
      });
    },

    setVolume: function (volume) {
      console.log('vol:' + volume);
      this.get('masterOut').gain.value = volume / 100;
    },

    /**
     * Stop all the samples.
     */
    stopAll: function () {
      this.samples.forEach(function (sample) {
        sample.stop();
      });
    },

    saveSamples: function () {
      this.getLoadedSamples().forEach(function (sample) {
        sample.save();
      }, this);
    },

    save: function () {
      // TODO: save the sampler meta-data thru api,
      // return deferred,
      // upon deferred completion save each sample and upload sound files,
      // set 'isSaved' flag to true,
      // listen for any other chnages and save everything on change

      // TODO: is this the best way to call backbone super save()?
      Backbone.Model.prototype.save.call(this);
      this.saveSamples();
    }

  });

  return Sampler;
});
