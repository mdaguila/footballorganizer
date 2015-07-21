/**
 * Broadcast updates to player when the model changes
 */

'use strict';

var player = require('./player.model');

exports.register = function(socket) {
  player.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  player.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('player:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('player:remove', doc);
}