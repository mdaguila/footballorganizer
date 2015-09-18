'use strict';

var express = require('express');
var controller = require('./partido.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/partidosorganizados/:id', controller.partidosorganizados);
router.get('/buscarpartido/:id', controller.buscarpartido);

router.put('/', auth.isAuthenticated(), controller.update);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;