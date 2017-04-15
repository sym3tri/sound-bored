define([
  'cmd/command',
  'gapi'
],
function (Command, gapi) {
  'use strict';

    var UploadFileCommand;

    UploadFileCommand= Command.extend({

      uploadFile: function (name, fileData, parentId) {

        var boundary = '-------314159265358979323846',
            delimiter = "\r\n--" + boundary + "\r\n",
            close_delim = "\r\n--" + boundary + "--",
            contentType = 'application/octet-stream',
            fileReader = new FileReader(),
            metadata,
            multipartRequestBody,
            request;


        metadata = {
          'title': name,
          'mimeType': contentType,
          'parents': [{'kind': 'drive#fileLink', 'id': parentId}],
        };

        fileReader.onload = function(e) {
          multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: ' + contentType + '\r\n' +
            'Content-Transfer-Encoding: base64\r\n' +
            '\r\n' +
            btoa(fileReader.result) +
            close_delim;

          request = gapi.client.request({
            'path': '/upload/drive/v2/files',
            'method': 'POST',
            'params': { 'uploadType': 'multipart' },
            'headers': {
              'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody
          });

          request.execute(this.onComplete.bind(this));
        }.bind(this);
        fileReader.readAsBinaryString(fileData);
      },

      onComplete: function (result) {
        if (!result || result.error) {
          this.deferred.reject(result);
        } else {
          this.deferred.resolve(result);
        }
      },

      execute: function (options) {
        Command.prototype.execute.call(this, options);
        this.uploadFile(
            this.options.name,
            this.options.data,
            this.options.parentId);
        return this.deferred.promise();
      }

    });

    return UploadFileCommand;
});
