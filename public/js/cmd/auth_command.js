define([
  'cmd/command',
  'gapi',
  'const'
],
function (Command, gapi, Const) {
  'use strict';

  var AuthCommand = Command.extend({

    authorize: function () {
      gapi.auth.authorize({
        'client_id': Const.GAPI_CLIENT_ID,
        'scope': Const.GAPI_SCOPES,
        'immediate': true
      }, this.onAuthorize.bind(this));
    },

    onAuthorize: function (result) {
      if (result && !result.error) {
        this.deferred.resolve(result);
      } else {
        this.deferred.reject(result);
      }
    },

    execute: function (options) {
      Command.prototype.execute.call(this, options);
      this.authorize();
      return this.deferred.promise();
    }

  });

  return AuthCommand;
});
