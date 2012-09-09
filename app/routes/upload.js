var fs = require('fs');

(function () {
  'use strict';

  module.exports = function (app) {

    app.post('/upload', function (req, res) {
      var file = req.files.sound,
          newPath = file.path.split('/');
      newPath.pop();
      newPath.push(file.name);
      newPath = newPath.join('/');
      fs.rename(file.path, newPath);
      console.log(file);
      res.send(200, 'upload ok');
    });

  };

}());
