'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PartidoSchema = new Schema({
		nombre: 		{ type: String },
		mailorganizador:{ type: String },
		organizador: 	{ type: String },
		grupo: 			{ type: String },
		imagen: 		{ type: String }, 
		abierto: 		{ type: Boolean },
		ciudad:  		{ type: String },  
		fecha: 			{ type: Date },
		campo:  		{ type: String },
		precio:  		{ type: Number },
		estado: 		{ type: Number },
		invitados: 		[{type: String }],
		solicitudes: 	[{type: String }],
		min: 			{ type: Number },
		max:            { type: Number },
		convocados:     [{type: String }],
		nombreequipo1:  { type: String },
		color1: 		{ type: String },
		equipo1:  		[{type: String }],
		posiciones1: 	[{type: String }],
		nombreequipo2:  { type: String },
		color2: 		{ type: String },
		equipo2:  		[{type: String }],
		posiciones2: 	[{type: String }],
		goles1: 		[{type: Number }],
		goles2:  		[{type: Number }]
	});

module.exports = mongoose.model('Partido', PartidoSchema);