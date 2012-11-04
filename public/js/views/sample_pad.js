/**
 * @fileOverview
 * View for a single sample pad.
 */

define([
  'jquery',
  'underscore',
  'backbone',
  'models/sample',
  'templates/sample_pad',
  'bootstrapPopover'
],
/**
 * @returns {ackbone.View}
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
      _.bindAll(this, 'render');
      this.sample = this.model;
      this.sample.on('change', this.render);
    },

    /**
     * @public
     * @returns {Backbone.View}
     */
    render: function () {
      this.$el.html(this.template({
        sample: this.sample.toJSON()
      }));
      this.triggerPadEl = this.$('.trigger-pad').first();
      if (this.sample.get('loaded')) {
        this.triggerPadEl
          .removeClass('loading')
          .addClass('is-loaded');
      }
      //this.$el.popover({
        //trigger: 'manual',
        //animation: false,
        //content: 'sound settings...' });
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

    onEditClick: function (e) {
      this.$('.trigger-pad');
      e.preventDefault();
      return false;
    }

  });

  return SamplePadView;
});
