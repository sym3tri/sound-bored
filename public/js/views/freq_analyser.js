/**
 * @fileOverview
 * Frequency vizualization View.
 */

define([
  'jquery',
  'underscore',
  'backbone',
  'd3',
  'templates/freq_analyser'
],
/**
 * @returns {Backbone.View}
 */
function(
  $,
  _,
  Backbone,
  d3,
  tpl) {
  'use strict';

  var FreqAnalyserView;

  /**
   * @constructor
   */
  FreqAnalyserView = Backbone.View.extend({

    /**
     * @private
     */
    template: tpl,
    /**
     * The frequency data to vizualize.
     * @type {Uint8Array}
     */
    data:  null,
    /**
     * Reference to the analyser from which to refresh data.
     * @type {RealtimeAnalyserNode}
     */
    analyser: null,
    /** @type {number} */
    width: 100,
    /** @type {number} */
    height: 100,
    particleRadius: 4,

    initialize: function () {
      _.bindAll(this, 'render', 'refresh');
      this.analyser = this.model;
      this.width = this.options.width;
      this.height = this.options.height;
    },

    /**
     * @public
     * @returns {Backbone.View}
     */
    render: function () {
      this.$el.html(
        this.template({
          title: 'Frequency Analyser'
        })
      );

      this.vizualizerContainerEl = this.$('.vizualizer-container')[0];
      this.vizualizerEl = d3.select(this.vizualizerContainerEl)
        .append('svg')
        .attr('class', 'vizualizer')
        .style('width', this.width)
        .style('height', this.height);

      this.data = new Uint8Array(this.analyser.frequencyBinCount);
      this.refresh();

      return this;
    },

    refresh: function () {
      var particle,
          height = this.height,
          radius = this.particleRadius;

      this.analyser.getByteFrequencyData(this.data);



      particle = this.vizualizerEl.selectAll('circle')
        .data(this.data, function (d, i) {
          return d;
        });


      particle
        .enter()
        .append('circle')
          .attr('r', radius)
          .attr('cx', function (d, i) {
            return i * radius;
          })
          .attr('cy', function (d) {
            return height - d;
          })
          .attr('class', 'dot');

      particle
        .transition()
        .remove();

      webkitRequestAnimationFrame(
        _.bind(this.refresh, this), this.vizualizerEl[0][0]);
    }

  });

  return FreqAnalyserView;
});
