/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /players              ->  index
 * POST    /players              ->  create
 * GET     /players/:id          ->  show
 * PUT     /players/:id          ->  update
 * DELETE  /players/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Player = require('./player.model');

// Get list of players
exports.index = function(req, res) {
  Player.find(function (err, players) {
    if(err) { return handleError(res, err); }
    return res.json(200, players);
  });
};

// Get me
exports.me = function(req, res) {
  Player.findOne({email:req.user.email}, function (err, player) {
    if(err) { return handleError(res, err); }
    if(!player) { return res.send(404); }
    return res.json(200, player);
  });
};

// Updates an existing player in the DB.
exports.update = function(req, res) {
  Player.findOne({email:req.user.email}, function (err, player) {
    if (err) { return handleError(res, err); }
    if(!player) { return res.send(404); }
    var updated = _.merge(player, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, player);
    });
  });
};

// Lista de amigos
exports.misamigos = function(req, res) {
  Player.findOne({email:req.user.email}, function (err, player) {
    if (err) { return handleError(res, err); }
    if(!player) { return res.send(404); }

    var amigos=[];
    var jsonamigos;
    var nombre='';

    if(player.amigos.length>0)
    {
      for(var i=0; i<player.amigos.length; i++){
        Player.findOne({email:player.amigos[i]},function (err, player2){
          if (err) { return handleError(res, err); }
          if(!player2) { return res.send(404); }
          nombre=player2.nombre+' '+player2.apellidos;
          amigos.push({"nombre":nombre,"foto":player2.foto,"email":player2.email,"posicion":player2.posicion});
          if(amigos.length==player.amigos.length){
            jsonamigos = JSON.parse(JSON.stringify({amigos:amigos}));  
            return res.json(200, jsonamigos);  
          } 
        });
      }
    }else{
      jsonamigos = JSON.parse(JSON.stringify({amigos:amigos}));  
      return res.json(200, jsonamigos);
    }      
  });
};

// Lista de peticiones de amistad
exports.mispeticiones = function(req, res) {
  Player.findOne({email:req.user.email}, function (err, player) {
    if (err) { return handleError(res, err); }
    if(!player) { return res.send(404); }

    var amigos=[];
    var jsonamigos;
    var nombre='';

    if(player.peticiones.length>0)
    {
      for(var i=0; i<player.peticiones.length; i++){
        Player.findOne({email:player.peticiones[i]},function (err, player2){
          if (err) { return handleError(res, err); }
          if(!player2) { return res.send(404); }
          nombre=player2.nombre+' '+player2.apellidos;
          amigos.push({"nombre":nombre,"foto":player2.foto,"email":player2.email,"posicion":player2.posicion});
          if(amigos.length==player.peticiones.length){
            jsonamigos = JSON.parse(JSON.stringify({amigos:amigos}));
            return res.json(200, jsonamigos);  
          } 
        });
      }
    }else{
      jsonamigos = JSON.parse(JSON.stringify({amigos:amigos}));  
      return res.json(200, jsonamigos);
    }        
  });
};

// Lista de usuarios en la misma ciudad
exports.buscaramigos = function(req, res) {
  Player.findOne({email:req.user.email}, function (err, player) {
    if (err) { return handleError(res, err); }
    if(!player) { return res.send(404); }

    var amigos=[];
    var users=[];
    var noAñadidos=0;
    var jsonamigos;
    var nombre='';
    var solicitado='';

    amigos=player.amigos.concat(player.peticiones);
    amigos.push(player.email);

    Player.find({ciudad:player.ciudad}, function (err, players) {
      if(err) { return handleError(res, err); }
      
      if(players.length>0){

        for(var i=0; i<players.length; i++){
          Player.findOne({email:players[i].email},function (err, player2){
            if (err) { return handleError(res, err); }
            if(!player2) { return res.send(404); }

            if(amigos.indexOf(player2.email)==-1){
              if(player.solicitudes.indexOf(player2.email)==-1){
                solicitado='';
              }else{
                solicitado='Esperando Respuesta';
              }
              nombre=player2.nombre+' '+player2.apellidos;
              users.push({"nombre":nombre,"foto":player2.foto,"email":player2.email,"posicion":player2.posicion,"solicitado":solicitado});
            }
            else{
              noAñadidos=noAñadidos+1;
            }

            if((users.length+noAñadidos)==players.length){
              jsonamigos = JSON.parse(JSON.stringify({amigos:users}));
              return res.json(200, jsonamigos);  
            } 
          });
        }
      }else{
        jsonamigos = JSON.parse(JSON.stringify({amigos:users}));  
        return res.json(200, jsonamigos);
      }
    });

  });  
};

// Get a single player
exports.amigo = function(req, res) {
  Player.findOne({email:req.params.id}, function (err, player) {
    if(err) { return handleError(res, err); }
    if(!player) { return res.send(404); }
    return res.json(200, player);
  });
};

// Añadir un email a la lista de solicitudes
exports.solicitaramigo = function(req, res) {
  Player.findOne({email:req.user.email}, function (err, player) {
    if (err) { return handleError(res, err); }
    if(!player) { return res.send(404); }
    
    var solicitudes = player.solicitudes;

    solicitudes.push(req.params.id);
    var updated = _.merge(player, solicitudes);

    updated.save(function (err) {
      if (err) { return handleError(res, err); }

      Player.findOne({email:req.params.id}, function (err, player2) {
        if (err) { return handleError(res, err); }
        if(!player2) { return res.send(404); }

        var peticiones = player2.peticiones;

        peticiones.push(req.user.email);
        var updated = _.merge(player2, peticiones);

        updated.save(function (err) {});
      });
      return res.json(200, player);
    });
  });
};

// Rechazar una peticion de amistad
exports.rechazaramigo = function(req, res) {
  Player.findOne({email:req.user.email}, function (err, player) {
    if (err) { return handleError(res, err); }
    if(!player) { return res.send(404); }
    
    var peticiones = player.peticiones;

    peticiones.splice(peticiones.indexOf(req.params.id), 1);

    var updated = _.merge(player, peticiones);

    updated.save(function (err) {
      if (err) { return handleError(res, err); }

      Player.findOne({email:req.params.id}, function (err, player2) {
        if (err) { return handleError(res, err); }
        if(!player2) { return res.send(404); }

        var solicitudes = player2.solicitudes;

        solicitudes.splice(solicitudes.indexOf(req.user.email), 1);

        var updated = _.merge(player2, solicitudes);

        updated.save(function (err) {});
      });
      return res.json(200, player);
    });
  });
};

// Aceptar una peticion de amistad
exports.aceptaramigo = function(req, res) {
  Player.findOne({email:req.user.email}, function (err, player) {
    if (err) { return handleError(res, err); }
    if(!player) { return res.send(404); }
    
    var amigos = player.amigos;
    var peticiones = player.peticiones;

    peticiones.splice(peticiones.indexOf(req.params.id), 1);
    amigos.push(req.params.id);

    var updated = _.merge(player, amigos);
    updated = _.merge(player, peticiones);

    updated.save(function (err) {
      if (err) { return handleError(res, err); }

      Player.findOne({email:req.params.id}, function (err, player2) {
        if (err) { return handleError(res, err); }
        if(!player2) { return res.send(404); }

        var amigos = player2.amigos;
        var solicitudes = player2.solicitudes;

        solicitudes.splice(solicitudes.indexOf(req.user.email), 1);
        amigos.push(req.user.email);

        var updated = _.merge(player2, solicitudes);
        updated = _.merge(player2, amigos);

        updated.save(function (err) {});
      });
      return res.json(200, player);
    });
  });
};

// Eliminar un usuario de tu lista de amigos
exports.eliminaramigo = function(req, res) {
  Player.findOne({email:req.user.email}, function (err, player) {
    if (err) { return handleError(res, err); }
    if(!player) { return res.send(404); }
    
    var amigos = player.amigos;

    amigos.splice(amigos.indexOf(req.params.id), 1);

    var updated = _.merge(player, amigos);

    updated.save(function (err) {
      if (err) { return handleError(res, err); }

      Player.findOne({email:req.params.id}, function (err, player2) {
        if (err) { return handleError(res, err); }
        if(!player2) { return res.send(404); }

        var amigos = player2.amigos;

       amigos.splice(amigos.indexOf(req.user.email), 1);

       var updated = _.merge(player2, amigos);

        updated.save(function (err) {});
      });
      return res.json(200, player);
    });
  });
};



// Get a single player
exports.show = function(req, res) {
  Player.findOne({email:req.params.id}, function (err, player) {
    if(err) { return handleError(res, err); }
    if(!player) { return res.send(404); }
    return res.json(200, player);
  });
};

// Creates a new player in the DB.
exports.create = function(req, res) {
  Player.create(req.body, function(err, player) {
    if(err) { return handleError(res, err); }
    return res.json(201, player);
  });
};

// Deletes a player from the DB.
exports.destroy = function(req, res) {
  Player.findOne({email:req.params.id}, function (err, player) {
    if(err) { return handleError(res, err); }
    if(!player) { return res.send(404); }
    player.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}