/**
 * @fileOverview
 * Wave Analyser View.
 */

define([
  'jquery',
  'underscore',
  'backbone',
  'd3',
  'templates/wave_analyser'
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

  var WaveAnalyserView;

  /**
   * @constructor
   */
  WaveAnalyserView = Backbone.View.extend({

    /**
     * @private
     */
    template: tpl,
    /**
     * The wave time data to vizualize.
     * @type {Uint8Array}
     */
    data: null,
    /**
     * Reference to the analyser from which to refresh data.
     * @type {RealtimeAnalyserNode}
     */
    analyser: null,
    /** @type {number} */
    width: 100,
    /** @type {number} */
    height: 100,
    particleWidth: 4,
    particleHeight: 8,

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
          title: 'Wave Analyser'
        })
      );

      this.vizualizerContainerEl = this.$('.vizualizer-container')[0];
      this.vizualizerEl = d3.select(this.vizualizerContainerEl)
        .append('svg')
        .attr('class', 'vizualizer')
        .style('width', this.width)
        .style('height', this.height);

      //var gradient = this.vizualizerEl.append("svg:defs")
        //.append("svg:linearGradient")
          //.attr("id", "gradient")
          //.attr("x1", "0%")
          //.attr("y1", "0%")
          //.attr("x2", "0%")
          //.attr("y2", "100%")
          //.attr("spreadMethod", "pad");

      //gradient.append("svg:stop")
          //.attr("offset", "0%")
          //.attr("stop-color", "#00A4F7")
          ////.attr("stop-color", "#FF3399")
          //.attr("stop-opacity", 1);

      //gradient.append("svg:stop")
          //.attr("offset", "100%")
          //.attr("stop-color", "#030060")
          ////.attr("stop-color", "#9900CC")
          //.attr("stop-opacity", 1);

      this.data = new Uint8Array(this.analyser.frequencyBinCount);
      this.refresh();

      return this;
    },

    refresh: function () {
      var particle,
          height = this.height,
          particleWidth = this.particleWidth;

      // update the time data with the analyzer
      this.analyser.getByteTimeDomainData(this.data);

      particle = this.vizualizerEl.selectAll('line')
        .data(this.data, function (d, i) {
          return {id: i, d: d};
        });

      function getX(d,i) {
        return (i * (particleWidth + 1));
      }

      particle
        .enter()
        .append('line')
          .attr({
            'stroke': '#f00',
            'stroke-width': particleWidth,
            'class': 'bar',
            'x1': getX,
            'y1': this.height,
            'x2': getX,
            'height': function (d) {
              return d;
            },
            'y2': function (d) {
              return height - d;
            }
          });

      particle
        .exit()
        .remove();

      //webkitRequestAnimationFrame(
        //_.bind(this.refresh, this), this.vizualizerEl[0][0]);
    }

  });

  return WaveAnalyserView;
});
