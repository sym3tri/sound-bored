define([
  'cmd/command',
  'cmd/auth_command',
  'cmd/get_file_command',
  'cmd/create_folder_command',
  'cmd/create_public_folder_command',
  'cmd/upload_file_command',
  'gapi'
],
function (
  Command,
  AuthCommand,
  GetFileCommand,
  CreateFolderCommand,
  CreatePublicFolderCommand,
  UploadFileCommand,
  gapi) {
  'use strict';

  // TODO: load the gapi in a better way? or maybe just use rest
  // TODO: if not already authorized, show popup by setting 'immediate': false
  //   in gapi.auth.authorize()
  // TODO: move all gapi wrapper stuff into a separate module
  // TODO: better error msg if higher up the chain things fail


  var SaveCommand = Command.extend({

    execute: function (options) {
      var that = this, authCmd;

      Command.prototype.execute.call(this, options);
      // 1. auth
      // 2. check for root 'sound-bored' folder,
      //    create if not exists & make public.
      // 3. check for project name folder, create if not exists.
      // 4  check for manifest.json
      // 5. overwrite manifest.json if exists else upload new.
      // 6. delete any other files not in manifest.
      // 7. upload all audio files
      authCmd = new AuthCommand();
      authCmd.execute()
        .pipe(
          // auth ok
          function (result) {
            var getFileCommand = new GetFileCommand(
              null, { name: 'sound-bored' });
            return getFileCommand.execute();
          },
          // auth fail
          function (result) {
            return 'auth error';
          })
        .pipe(
          // 'sound-bored' folder exist check ok
          function (result) {
            if (result) {
              // 'sound-bored' folder exists.
              return result;
            }
            var createPublicFolderCommand = new CreatePublicFolderCommand(
              null, { name: 'sound-bored' });
            return createPublicFolderCommand.execute();
          },
          // 'sound-bored' folder exist check fail
          function (result) {
            return 'root folder exist check failed';
          })
        .pipe(
          // create 'sound-bored' folder ok
          function (result) {
            var createFolderCommand = new CreateFolderCommand(
              null, { name: that.model.get('name'), parentId: result.id });
            return createFolderCommand.execute();
          },
          // create 'sound-bored' folder fail
          function (result) {
            return 'could not create root "sound-bored" folder';
          })
        .pipe(
          function (result) {
            var haveSounds = that.model.samples.filter(function (sample) {
              return !!sample.sound.get('soundData');
            });
            haveSounds.forEach(function (sample) {
              var sound = sample.sound,
                //data = sound.get('soundData'),
                data = sound.getSoundDataBlob(),
                name = sample.get('name'),
                parentId = result.id,
                uploadFileCmd;

              uploadFileCmd = new UploadFileCommand(sound, {
                name: name,
                data: data,
                parentId: parentId
              });
              uploadFileCmd.execute();

              // TODO: queue all results and report status
            });
          },
          function (result) {
            return 'could not create new user-specified sb folder.';
          })
        .then(
          function (result) {
            that.deferred.resolve(result);
          },
          function (result) {
            that.deferred.reject(result);
          });

      return this.deferred.promise();
    }

  });

  return SaveCommand;
});
