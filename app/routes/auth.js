(function () {
  'use strict';

  module.exports = function (app) {

    app.get('/login-complete', function (req, res) {
      res.render('login-complete', { title: 'logged in' });
    });

  };

}());
