/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /partidos             ->  index
 * POST    /partidos             ->  create
 * GET     /partidos/:id          ->  show
 * PUT     /partidos/:id          ->  update
 * DELETE  /partidos/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Partido = require('./partido.model');
var Player = require('../player/player.model');

// Get list of partidos
exports.index = function(req, res) {
  Partido.find(function (err, partidos) {
    if(err) { return handleError(res, err); }
    return res.json(200, partidos);
  });
};


// Creates a new partido in the DB.
exports.create = function(req, res) {
  Partido.create(req.body, function(err, partido) {
    if(err) { return handleError(res, err); }
    return res.json(201, partido);
  });
};

// Get a single partido
exports.show = function(req, res) {
  Partido.findOne({email:req.params.id}, function (err, partido) {
    if(err) { return handleError(res, err); }
    if(!partido) { return res.send(404); }
    return res.json(200, partido);
  });
};


// Updates an existing partido in the DB.
exports.update = function(req, res) {
  Partido.findOne({email:req.user.email}, function (err, partido) {
    if (err) { return handleError(res, err); }
    if(!partido) { return res.send(404); }
    var updated = _.merge(partido, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, partido);
    });
  });
};


// Deletes a partido from the DB.
exports.destroy = function(req, res) {
  Partido.findOne({email:req.params.id}, function (err, partido) {
    if(err) { return handleError(res, err); }
    if(!partido) { return res.send(404); }
    partido.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

// Lista de partidos abiertos
exports.partidosorganizados = function(req, res) {
    var hoy=new Date();

    Partido.find({mailorganizador:req.params.id}, function (err, partidos) {
      if(err) { return handleError(res, err); }
      return res.json(200, partidos);
    });

};

// Lista de partidos abiertos
exports.buscarpartido = function(req, res) {
  Player.findOne({email:req.params.id}, function (err, player) {
    if(err) { return handleError(res, err); }
    if(!player) { return res.send(404); }

    var hoy=new Date();

    Partido.find({ciudad:player.ciudad, abierto:true, estado:1, fecha:{ $gte : hoy }}, function (err, partidos) {
      if(err) { return handleError(res, err); }
      return res.json(200, partidos);
    });
  });

};

function handleError(res, err) {
  return res.send(500, err);
}

