/**
 * @fileOverview
 * View for a single sample pad's options.
 */

define([
  'jquery',
  'underscore',
  'backbone',
  'models/sample',
  'templates/sample_pad_options'
],
/**
 * @returns {ackbone.View}
 */
function($, _, Backbone, Sample, tpl) {
  'use strict';

  var SamplePadOptionsView;

  /**
   * @constructor
   */
  SamplePadOptionsView = Backbone.View.extend({

    /**
     * @private
     */
    template: tpl,
    className: 'sample-pad-options-container modal hide fade',
    tagName: 'div',

    /**
     * @private
     */
    events: {
      'click .close-btn': 'onCloseClick',
      'click .play-btn': 'onPlayClick',
      'change input[name="keymap"]': 'onKeymapChange'
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
      if (!this.sample.get('loaded')) {
        this.$('.play-btn').attr('disabled', 'disabled');
      }
      this.goModal();
      return this;
    },

    goModal: function () {
      $(document.body).append(this.$el);
      this.$el.on('hidden', _.bind(this.remove, this));
      this.$el.modal();
    },

    onKeymapChange: function (e) {
      this.sample.set('keymap', this.$(e.target).val());
    },

    onPlayClick: function (e) {
      this.sample.play();
      e.preventDefault();
    },

    onCloseClick: function (e) {
      this.$el.modal('hide');
    }

  });

  return SamplePadOptionsView;
});
