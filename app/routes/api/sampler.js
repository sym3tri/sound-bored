(function () {
  'use strict';

  var redis = require('redis'),
      client = new redis.createClient(),
      DB_INDEX = 1;

  module.exports = function (app) {

    var testSampler = {
      name: 'untitled',
      updated: (new Date()).getTime().toString()
    };

    function generateHashId(req) {
      return req.sessionID.replace('/', '') + 'sound';
    }

    app.get('/api/soundbored', function (req, res) {
      res.send(200, 'nothing here');
    });

    app.get('/api/soundbored/:id', function (req, res) {
      var hashId = req.params.id;
      client.select(DB_INDEX);
      client.hgetall(hashId, function (err, data) {
        if (err) {
          res.send(500, 'error');
        } else if (data) {
          res.send(200, { data: data });
        } else {
          res.send(404, { error: 'not found' });
        }
      });
    });

    app.post('/api/soundbored', function (req, res) {
      var hashId = generateHashId(req),
          samplerData = req.params.sampler;
      client.select(DB_INDEX);
      client.hmset(hashId, testSampler);
    });

  };

}());
