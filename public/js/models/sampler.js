/**
 * @fileOVerview
 * Sample Model - Contains a sound and extra meta-data.
 */

define([
  'underscore',
  'backbone',
  'models/sound',
  'models/sample',
  '../collections/samples'
],

/**
 * @returns {Backbone.Model}
 */
function(_, Backbone, SoundModel, Sample, Samples) {
  'use strict';

  var Sampler;

  /**
   * @constructor
   */
  Sampler = Backbone.Model.extend({

    defaults: {
      name: '',
      totalRows: 4
    },

    /**
     * @public
     */
    initialize: function () {

      var testSamples = [], i;
      for (i=1; i<=16; i+=1) {
        testSamples.push({ name: 'sample #' + i});
      }
      this.samples = new Samples(testSamples);
    }

  });

  return Sampler;
});
