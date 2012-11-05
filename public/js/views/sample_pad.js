/**
 * @fileOverview
 * View for a single sample pad.
 */

define([
  'jquery',
  'underscore',
  'backbone',
  'models/sample',
  'views/sample_pad_options',
  'templates/sample_pad',
  'bootstrapModal'
],
/**
 * @returns {ackbone.View}
 */
function($, _, Backbone, Sample, SamplePadOptionsView, tpl) {
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
    tagName: 'div',

    /**
     * @private
     */
    events: {
      'dragenter .trigger-pad': 'onDragEnter',
      'dragleave .trigger-pad': 'onDragLeave',
      'dragover .trigger-pad': 'onDragOver',
      'drop .trigger-pad': 'onDrop',
      'mousedown .trigger-pad': 'onMousedown',
      'click .pad-options-nav .edit': 'onEditClick'
    },

    initialize: function () {
      _.bindAll(this, 'render', 'onSoundPlay');
      this.sample = this.model;
      this.sample.on('change', this.render);
      this.sample.sound.on('play', _.debounce(this.onSoundPlay, 20));
    },

    /**
     * @public
     * @returns {Backbone.View}
     */
    render: function () {
      this.$el.html(this.template({
        sample: this.sample.toJSON()
      }));
      this.triggerPadEl = this.$('.trigger-pad');
      if (this.sample.get('loaded')) {
        this.triggerPadEl
          .removeClass('loading')
          .addClass('is-loaded');
      }
      return this;
    },

    play: function () {
      this.sample.play();
    },

    loadFile: function (file) {
      this.sample.loadFile(file);
    },

    onDragEnter: function (e) {
      this.triggerPadEl.addClass('drag');
    },

    onDragOver: function (e) {
      e.preventDefault();
    },

    onDragLeave: function (e) {
      this.triggerPadEl.removeClass('drag');
    },

    onDrop: function (e) {
      var files = e.originalEvent.dataTransfer.files;
      this.triggerPadEl
        .removeClass('drag')
        .addClass('loading');
      this.loadFile(files[0]);
      e.stopPropagation();
      e.preventDefault();
    },

    onMousedown: function (e) {
      this.play();
    },

    onSoundPlay: function (e) {
      var triggerPadEl = this.triggerPadEl;
      triggerPadEl.addClass('is-active');
      _.debounce(
        _.delay(function () {
            triggerPadEl.removeClass('is-active');
        },
        100),
      100);
    },

    onEditClick: function (e) {
      var optionsView;
      optionsView = new SamplePadOptionsView({
        model: this.sample
      });
      optionsView.render();
      e.preventDefault();
      return false;
    }

  });

  return SamplePadView;
});
