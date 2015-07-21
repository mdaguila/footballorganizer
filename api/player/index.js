'use strict';

var express = require('express');
var controller = require('./player.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/', auth.isAuthenticated(), controller.update);
router.get('/misamigos', auth.isAuthenticated(), controller.misamigos);
router.get('/mispeticiones', auth.isAuthenticated(), controller.mispeticiones);
router.get('/buscaramigos', auth.isAuthenticated(), controller.buscaramigos);
router.get('/amigo/:id', auth.isAuthenticated(), controller.amigo);
router.put('/solicitaramigo/:id', auth.isAuthenticated(), controller.solicitaramigo);
router.put('/aceptaramigo/:id', auth.isAuthenticated(), controller.aceptaramigo);
router.put('/rechazaramigo/:id', auth.isAuthenticated(), controller.rechazaramigo);
router.put('/eliminaramigo/:id', auth.isAuthenticated(), controller.eliminaramigo);

router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;