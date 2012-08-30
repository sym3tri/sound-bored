/**
 * @fileOverview
 * A simple wrapper for Sound Manger that adds some customization.
 */

define([
  'soundmanagerBase'
],
function(SoundManagerBase) {
  'use strict';

  /**
   * Does the initial setup and configuration for SoundManger.
   */
  var SoundManager = SoundManagerBase.setup({

    // location: path to SWF files, as needed (SWF file name is appended later.)
    url: '../../extern/soundmanager/',

    // optional: version of SM2 flash audio API to use (8 or 9; default is 8
    // if omitted, OK for most use cases.)
    //flashVersion: 9,

    // use soundmanager2-nodebug-jsmin.js, or disable debug mode
    // (enabled by default) after development/testing
    // debugMode: false,

    // good to go: the onready() callback
    onready: function() {
      console.log('sound manager loaded');
      // SM2 has started - now you can create and play sounds!
      //var mySound = SoundManager.createSound({
        //id: 'aSound',
        //url: '/path/to/an.mp3'
        //// onload: function() { console.log('sound loaded!', this); }
        //// other options here..
      //});
      //mySound.play();
    },

    // optional: ontimeout() callback for handling start-up failure
    ontimeout: function() {
      console.log('sound manager failed');
      // Hrmm, SM2 could not start. Missing SWF? Flash blocked?
      // Show an error, etc.?
      // See the flashblock demo when you want to start getting fancy.
    }
  });

  return SoundManager;
});
