'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PlayerSchema = new Schema({
		email: 		{ type: String, lowercase: true, index: true, unique: true},
		nombre: 	{ type: String },
		apellidos: 	{ type: String },
		fechanac:   { type: Date },
		altura:		{ type: Number, default: 0},
		pie:	{
			type: String,
			enum: ['Diestro', 'Zurdo', 'Ambidiestro'],
			default: 'Diestro'
		},
		ciudad: 	{ type: String },
        foto:   	{ type: String, default: 'img/foto_default.jpg' },
		posicion:	{
			type: String,
			enum: ['No tiene', 'Portero', 'Defensa', 'Lateral', 'Medio Centro', 'Extremo', 'Delantero'],
			default: 'No tiene'
		},
        organizados:  	{ type: Number, default: 0 },
        jugados:  	[{type: Number }],
        convocado:  { type: Number, default: 0 },
		fiabilidad: { type: Number, default: 0},
		victorias:  [{type: Number }],
		promediovictorias: [{type: Number }],
		goles:  	[{type: Number }],
        promediogoles:[{type: Number }],
		encajados: 	[{type: Number }],
        promedioencajados:[{type: Number }],
        solicitudes: [{type: String }],
        peticiones: [{type: String }],
        amigos:     [{type: String }]
	});

module.exports = mongoose.model('Player', PlayerSchema);