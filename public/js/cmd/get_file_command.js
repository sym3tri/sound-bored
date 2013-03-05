define([
  'cmd/command',
  'gapi',
  'const'
],
function (Command, gapi) {
  'use strict';

  var GetFileCommand = Command.extend({

    searchFiles: function (name) {
      var request = gapi.client.request({
        'path': '/drive/v2/files',
        'method': 'GET',
        'headers': {
          'Content-Type': 'application/json'
        },
        'params': {
          'fields': 'items(id,labels/trashed,title)',
          'q': "title = '" + name + "'"
        }
      });
      request.execute(this.onSearchFiles.bind(this));
    },

    onSearchFiles: function (result) {
      var notTrashedItems, ret;

      if (!result || !result.items || result.error) {
        this.deferred.reject(result);
      } else {
        notTrashedItems = result.items.filter(function (file) {
          return !file.labels.trashed;
        });
        ret = notTrashedItems.length ? notTrashedItems[0] : null;
        this.deferred.resolve(ret);
      }
    },

    execute: function (options) {
      Command.prototype.execute.call(this, options);
      this.searchFiles(this.options.name);
      return this.deferred.promise();
    }

  });

  return GetFileCommand;
});
