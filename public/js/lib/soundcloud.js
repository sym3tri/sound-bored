/**
 * @fileOverview
 * A simple wrapper for the Sound Cloud SDK.
 */

define([
  'soundCloudBase'
],
function (SC) {
  'use strict';

  SC.initialize({
    client_id: '162666e1fed33416d3f720b85b9aec74',
    redirect_uri: 'http://localhost:3000/login-complete'
  });

  return SC;
});
