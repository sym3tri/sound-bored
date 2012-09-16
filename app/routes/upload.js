(function () {
  'use strict';

  var fs = require('fs');
  module.exports = function (app) {

    // Creates the directory if it doesn't exist
    function createUploadDir(path, cb) {
      fs.exists(path, function (exists) {
        if (exists) {
          console.log('dir already exists');
          cb();
        } else {
          console.log('making dir: ' + path);
          fs.mkdir(path, cb);
       }
      });
    }

    function getUniqueUserId(req) {
      return req.sessionID.replace('/', '');
    }

    // Generates the new user-specific directory to store file uploads
    function generatePath(req) {
      var file = req.files.sound,
          newPath = file.path.split('/');
      newPath.pop();
      newPath.push(getUniqueUserId());
      return newPath;
    }

    function sendResponse(err, res) {
      if (err) {
        res.send(500, 'error');
        // TODO: cleanup on failure
        return;
      }
      res.send(200, 'upload ok');
    }

    app.post('/upload', function (req, res) {
      var file = req.files.sound,
          path = generatePath(req);

      createUploadDir(path.join('/'), function (err) {
        if (err) {
          sendResponse(err, res);
        }
        path.push(file.name);
        fs.rename(file.path, path.join('/'), function (err) {
          sendResponse(err, res);
        });
      });
    });

  };

}());
