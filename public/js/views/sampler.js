/**
 * @fileOverview
 * View for the whole sampler, contains many sample views.
 */

define([
  'jquery',
  'underscore',
  'backbone',
  'models/sampler',
  'views/sample_pad',
  'templates/sampler'
],
/**
 * @returns {Backbone.View}
 */
function($, _, Backbone, Sampler, SamplePadView, tpl) {
  'use strict';

  var SamplerView;

  /**
   * @constructor
   */
  SamplerView = Backbone.View.extend({

    /**
     * @private
     */
    template: tpl,

    /**
     * @private
     */
    events: {
    },

    initialize: function () {
      _.bindAll(this, 'render', 'renderSamplePads');
      this.sampler = this.model;
      this.samplePadViews = [];
      this.sampler.samples.on('all', this.renderSamplePads);
    },

    /**
     * @public
     * @returns {Backbone.View}
     */
    render: function () {
      this.$el.html(this.template({
        sampler: this.sampler.toJSON()
      }));
      //this.samplePadsContainerEl = this.$('.sample-pads-container');
      this.renderSamplePads();
      return this;
    },

    renderSamplePads: function () {
      var padCount = 1;
      // remove all current views
      this.samplePadViews.forEach(function (samplePadView) {
        samplePadView.remove();
      });
      // create-render-append new view for each sample in appropriate row
      this.sampler.samples.forEach(function (sample) {
        var samplePadView = new SamplePadView({ model: sample }),
            rowIndex = Math.ceil((padCount) / this.sampler.get('totalRows')),
            parentEl;
        parentEl = this.$('.sample-pads-container .row-' + rowIndex);
        parentEl.append(samplePadView.render().$el);
          this.samplePadViews.push(samplePadView);
        padCount += 1;
      }, this);
    }

  });

  return SamplerView;
});
