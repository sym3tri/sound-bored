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
      _.bindAll(this, 'render', 'onFileLoad');
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
      return this;
    },

    play: function () {
      this.sample.play();
    },

    loadFile: function (file) {
      var fileReader = new FileReader();
      fileReader.onload = this.onFileLoad;
      fileReader.readAsArrayBuffer(file);
      this.$el.removeClass('loading');
      this.sample.set('name', file.name);
    },

    onFileLoad: function (e) {
      this.sample.loadSound(e.target.result);
    },

    onDragEnter: function (e) {
      this.$el.addClass('drag');
    },

    onDragLeave: function (e) {
      this.$el.removeClass('drag');
    },

    onDragOver: function (e) {
      e.preventDefault();
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
      e.preventDefault();
      return false;
    }

  });

  return SamplePadView;
});
