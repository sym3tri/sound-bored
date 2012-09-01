/**
 * @fileOverview
 * View for a single sample pad.
 */

define([
  'jquery',
  'underscore',
  'backbone',
  'models/sample',
  'templates/sample_pad'
],
/**
 * @returns {Backbone.View}
 */
function($, _, Backbone, Sample, tpl) {
  'use strict';

  var SamplePadView;

  /**
   * @constructor
   */
  SamplePadView = Backbone.View.extend({

    /**
     * @private
     */
    template: tpl,
    className: 'sample-pad',

    /**
     * @private
     */
    events: {
    },

    initialize: function () {
      _.bindAll(this, 'render');
      this.sample = this.model;
    },

    /**
     * @public
     * @returns {Backbone.View}
     */
    render: function () {
      this.$el.html(this.template({
        sample: this.sample.toJSON()
      }));
      return this;
    }

  });

  return SamplePadView;
});
