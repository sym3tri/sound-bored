/**
 * @fileOverview
 * View that manages and renders the Home page.
 */

define([
  'jquery',
  'underscore',
  'backbone',
  'd3',
  'models/sound',
  'templates/home'
],
/**
 * @returns {Backbone.View}
 */
function ($, _, Backbone, d3, Sound, homeTpl) {
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
      VIZ_HEIGHT: 200,
      VIZ_WIDTH: 512
    },

    timeData: null,
    freqData:  null,

    /**
     * @private
     */
    events: {
      'click #start': 'onStartClick',
      'click #stop': 'onStopClick'
    },

    el: $('#main-container'),

    initialize: function () {
      // Bind all non-event handler methods to 'this'.
      _.bindAll(this, 'render', 'renderVizualizer', 'refreshVizualizer');

      this.sound = new Sound({ filePath: '/sounds/beat.mp3' });

      this.sound.on('loaded', _.bind(function () {
      }, this));
      this.sound.load();
    },

    /**
     * @public
     * @returns {Backbone.View}
     */
    render: function () {
      this.$el.html(this.template({
        // this should work if underscore.string was setup properly
        title: 'Audio vizualizer thing'
      }));
      this.renderVizualizer();
      return this;
    },

    renderVizualizer: function () {
      this.vizualizer = this.$('#wave-container');
      //this.vizualizer.html('vizualizer loading...');
      this.vizualizer = d3.select('#wave-container').append('svg')
        .attr('class', 'vizualizer')
        .style('width', this.constants.VIZ_WIDTH)
        .style('height', this.constants.VIZ_HEIGHT);

      var gradient = this.vizualizer.append("svg:defs")
        .append("svg:linearGradient")
          .attr("id", "gradient")
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "0%")
          .attr("y2", "100%")
          .attr("spreadMethod", "pad");

      gradient.append("svg:stop")
          .attr("offset", "0%")
          .attr("stop-color", "#00A4F7")
          .attr("stop-opacity", 1);

      gradient.append("svg:stop")
          .attr("offset", "100%")
          .attr("stop-color", "#030060")
          .attr("stop-opacity", 1);

      this.freqViz = this.$('#freq-container');
      //this.vizualizer.html('vizualizer loading...');
      this.freqViz = d3.select('#freq-container').append('svg')
        .attr('class', 'vizualizer')
        .style('width', this.constants.VIZ_WIDTH)
        .style('height', this.constants.VIZ_HEIGHT);

      this.sound.on('play', _.bind(function () {
        this.timeData = new Uint8Array(
          this.sound.get('analyser').frequencyBinCount);
        this.freqData = new Uint8Array(
          this.sound.get('analyser').frequencyBinCount);
        this.refreshVizualizer();
        this.refreshFreq();
      }, this));
    },

    refreshFreq: function () {
      var analyser = this.sound.get('analyser'),
          h = this.constants.VIZ_HEIGHT,
          radius = 4,
          particle;

      analyser.getByteFrequencyData(this.freqData);

      particle = this.freqViz.selectAll('circle')
        .data(this.freqData, function (d, i) { return d; });

      particle.enter()
        .append('circle')
          .attr('r', radius)
          .attr('cx', function (d, i) {
            return i * radius;
          })
          .attr('cy', function (d) {
            return h - d;
          })
          .attr('class', 'dot');

        particle
          .transition()
          .remove();

      if (this.sound.get('isPlaying')) {
        webkitRequestAnimationFrame(_.bind(this.refreshFreq, this), this.freqViz);
      }
    },

    refreshVizualizer: function () {
      var analyser = this.sound.get('analyser'),
          h = this.constants.VIZ_HEIGHT,
          particleWidth = 1,
          particleHeight = 8,
          particle;

      // update the time data with the analyzer
      analyser.getByteTimeDomainData(this.timeData);

      particle = this.vizualizer.selectAll('rect')
        .data(this.timeData, function (d, i) { return {id: i, d: d}; });

      particle.enter()
        .append('rect')
          .attr('x', function (d, i) {
            return (i * (particleWidth + 1));
          })
          .attr('y', function (d) {
            return h - d;
          })
          .attr('width', particleWidth)
          .attr('height', function (d) { return d; })
          .attr('class', 'bar');

      //particle
        //.transition()
        //.remove();

      particle
        .exit()
        //.transition()
        //.duration(50)
        //.attr('width', 10)
        //.style('fill', '#f00')
        .remove();

      if (this.sound.get('isPlaying')) {
        webkitRequestAnimationFrame(_.bind(this.refreshVizualizer, this), this.vizualizer);
      }
    },

    // EVENT HANDLERS

    /**
     * @private
     * @param {Event} e
     */
    onStartClick: function (e) {
      if (this.sound.isLoaded()) {
        this.sound.play();
      }
    },

    onStopClick: function (e) {
      this.sound.stop();
    }

  });

  return HomeView;
});
