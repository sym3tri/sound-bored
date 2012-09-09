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
    tagName: 'button',

    /**
     * @private
     */
    events: {
      'dragenter': 'onDragEnter',
      'dragleave': 'onDragLeave',
      'dragover': 'onDragOver',
      'drop': 'onDrop',
      'mousedown': 'onMousedown',
      'contextmenu': 'onRightClick'
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
      // btn class makes pads pressable
      if (this.sample.get('loaded')) {
        this.$el.addClass('btn');
      }
      this.$el.popover({
        trigger: 'manual',
        animation: false,
        content: 'sound settings...' });
      return this;
    },

    play: function () {
      this.sample.play();
    },

    loadFile: function (file) {
      this.sample.loadFile(file);
    },

    onDragEnter: function (e) {
      this.$el.addClass('drag');
    },

    onDragOver: function (e) {
      e.preventDefault();
    },

    onDragLeave: function (e) {
      this.$el.removeClass('drag');
    },

    onDrop: function (e) {
      var files = e.originalEvent.dataTransfer.files;
      this.$el
        .removeClass('drag')
        .addClass('loading');
      this.loadFile(files[0]);
      e.stopPropagation();
      e.preventDefault();
    },

    onMousedown: function (e) {
      this.play();
    },

    onRightClick: function (e) {
      console.log('right click');
      this.$el.popover('show');
      e.preventDefault();
      return false;
    }

  });

  return SamplePadView;
});
