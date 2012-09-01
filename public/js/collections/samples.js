/**
 * @fileOVerview
 * Collection of Sample models.
 */

define([
  'underscore',
  'backbone',
  'models/sample'
],
/**
 * @returns {Backbone.Collection}
 */
function(_, Backbone, Sample){
  'use strict';

  var Samples;

  /**
   * @constructor
   */
  Samples = Backbone.Collection.extend({

    model: Sample,

    /**
     * @public
     */
    helperFunction: function () {
      // do public stuff
      return true;
    }

  });

  return Samples;
});
