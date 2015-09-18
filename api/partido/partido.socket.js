/**
 * Broadcast updates to player when the model changes
 */

'use strict';

var partido = require('./partido.model');

exports.register = function(socket) {
  partido.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  partido.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('partido:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('partido:remove', doc);
}