define([
  'cmd/command',
  'gapi',
  'const'
],
function (Command, gapi) {
  'use strict';

  var MakeFilePublicCommand = Command.extend({

    makePublic: function (fileId) {
      var request = gapi.client.request({
        'path': '/drive/v2/files/' + fileId + '/permissions',
        'method': 'POST',
        'headers': {
          'Content-Type': 'application/json'
        },
        'body': {
          'role': 'reader',
          'type': 'anyone',
          'value': null // everyone
        }
      });
      request.execute(this.onMakePublic.bind(this));
    },

    onMakePublic: function (result) {
      if (!result || result.error) {
        this.deferred.reject(result);
      } else {
        this.deferred.resolve(result);
      }
    },

    execute: function (options) {
      Command.prototype.execute.call(this, options);
      this.makePublic(this.options.fileId);
      return this.deferred.promise();
    }

  });

  return MakeFilePublicCommand;
});
