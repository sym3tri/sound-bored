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
      'click .btn-stop-all': 'onStopAllClick',
      'click .btn-save': 'onSaveClick',
      'change .sampler-volume': 'onVolumeChange',
      'blur .sampler-name': 'onNameChange'
    },

    initialize: function () {
      _.bindAll(this, 'render', 'renderSamplePads');
      this.sampler = this.model;
      this.samplePadViews = [];
      this.sampler.samples.on('add remove', this.renderSamplePads);
      this.changeVolume = _.debounce(
        _.bind(this.sampler.setVolume, this.sampler),
        50);
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
    },

    onStopAllClick: function (e) {
      this.sampler.stopAll();
    },

    onSaveClick: function (e) {
      this.sampler.save();
      e.preventDefault();
    },

    onVolumeChange: function (e) {
      var volume = parseInt(e.target.value, 10);
      this.changeVolume(volume);
    },

    onNameChange: function (e) {
      var name = this.$(e.target).val();
      this.sampler.set('name', name);
    }

  });

  return SamplerView;
});
