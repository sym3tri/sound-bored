define([
  'cmd/command',
  'gapi',
  'const'
],
function (Command, gapi) {
  'use strict';

  var CreateFolderCommand = Command.extend({

    createFolder: function (name, parentId) {
      var request, parents;

      parents = parentId ? [{ id: parentId }] : [];
      request = gapi.client.request({
        'path': '/drive/v2/files',
        'method': 'POST',
        'headers': {
          'Content-Type': 'application/json'
        },
        'body': {
          'title': name,
          'parents': parents,
          'mimeType': 'application/vnd.google-apps.folder'
        }
      });
      request.execute(this.onCreateFolder.bind(this));
    },

    onCreateFolder: function (result) {
      if (!result || result.error) {
        this.deferred.reject(result);
      } else {
        this.deferred.resolve(result);
      }
    },

    execute: function (options) {
      Command.prototype.execute.call(this, options);
      this.createFolder(this.options.name, this.options.parentId);
      return this.deferred.promise();
    }

  });

  return CreateFolderCommand;
});
