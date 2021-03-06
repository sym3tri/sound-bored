/**
 * @fileOVerview
 * The main applicatoin Router.
 * Defines routes, initializes and renders views.
 */

define([
  'backbone',
  'views/nav',
  'views/home',
  'views/about'
],
/**
 * @returns {Backbone.Router}
 */
function (Backbone, NavView, HomeView, AboutView) {
  'use strict';

  var AppRouter;

  /**
   * @constructor
   */
  AppRouter = Backbone.Router.extend({

    routes: {
      '': 'home',
      'home': 'home',
      'about': 'about',
      'login-complete': 'loginComplete',
      // Default
      '*actions': 'defaultAction'
    },

    /**
     * Initializes all the views used by the app at load time.
     * @param {Object} options
     */
    initialize: function (options) {
      this.navView = new NavView({ router: this });
      this.homeView = new HomeView();
      this.aboutView = new AboutView();
    },

    home: function () {
      this.homeView.render();
    },

    about: function () {
      this.aboutView.render();
    },

    loginComplete: function () {
      window.opener.SC.connectCallback();
    },

    defaultAction: function (actions) {
      // No route.
      this.navigate('home', { trigger: true, replace: true });
    }

  });

  return {
    initialize: function () {
      var appRouter = new AppRouter();
      Backbone.history.start({ pushState: true });
      window.App = appRouter;
    }
  };

});
