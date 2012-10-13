/**
 * @fileOverview
 * View that manages and renders the Home page.
 */

define([
  'jquery',
  'underscore',
  'backbone',
  'soundCloud',
  'models/sound',
  'models/sampler',
  'views/sampler',
  'views/freq_analyser',
  'views/wave_analyser',
  'templates/home'
],
/**
 * @returns {Backbone.View}
 */
function (
  $, 
  _,
  Backbone,
  SC,
  Sound,
  Sampler,
  SamplerView,
  FreqAnalyserView,
  WaveAnalyserView,
  homeTpl) {
  'use strict';

  var HomeView;

  /**
   * @constructor
   */
  HomeView = Backbone.View.extend({

    /**
     * @private
     */
    template: homeTpl,

    constants: {
      WIDGET_HEIGHT: 200,
      WIDGET_WIDTH: 512
    },

    /**
     * @private
     */
    events: {
      'click #soundcloud-connect': 'onLoginClick'
    },

    el: $('#main-container'),

    initialize: function () {
      _.bindAll(this, 'render', 'renderWidgets');
      this.sampler = new Sampler();
      this.samplerView = new SamplerView({ model: this.sampler });
    },

    /**
     * @public
     * @returns {Backbone.View}
     */
    render: function () {
      this.$el.html(
        this.template({
        })
      );
      this.renderSampler(this.$('.sampler-view-container'));
      //this.renderWidgets();
      return this;
    },

    renderSampler: function (el) {
      this.samplerView.setElement(el);
      this.samplerView.render();
    },

    renderWidgets: function () {
      if (!this.freqAnalyserView) {
        this.freqAnalyserView = new FreqAnalyserView({
          model: this.sampler.get('analyser'),
          width: this.constants.WIDGET_WIDTH,
          height: this.constants.WIDGET_HEIGHT
        });
        this.$('.widget-container').append(this.freqAnalyserView.render().el);
      }
      if (!this.waveAnalyserView) {
        this.waveAnalyserView = new WaveAnalyserView({
          model: this.sampler.get('analyser'),
          width: this.constants.WIDGET_WIDTH,
          height: this.constants.WIDGET_HEIGHT
        });
        this.$('.widget-container').append(this.waveAnalyserView.render().el);
      }
    },

    onLoginClick: function (e) {
      SC.connect(function() {
        SC.get('/me', function(me) { 
          alert('Hello, ' + me.username); 
        });
      });
    }

  });

  return HomeView;
});
