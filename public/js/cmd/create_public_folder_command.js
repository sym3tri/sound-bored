define([
  'cmd/command',
  'cmd/create_folder_command',
  'cmd/make_public_command',
  'gapi',
  'const'
],
function (Command, CreateFolderCommand, MakePublicCommand, gapi) {
  'use strict';

  var CreatePublicFolderCommand = Command.extend({

    execute: function (options) {
      var createFolderCommand,
        makePublicCommand,
        folderObject;

      Command.prototype.execute.call(this, options);

      createFolderCommand = new CreateFolderCommand(
        null, this.options);

      return createFolderCommand.execute()
        .pipe(
          function (result) {
            folderObject = result;
            makePublicCommand = new MakePublicCommand();
            return makePublicCommand.execute({ fileId: result.id });
          },
          function (result) {
            return 'folder creation failed';
          })
        .pipe(
          function (result) {
            return folderObject;
          },
          function (result) {
            return 'failed to make folder public.';
          });
    }

  });

  return CreatePublicFolderCommand;
});
