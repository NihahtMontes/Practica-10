const express = require('express');
const router = express.Router();
const reservasController = require('../controllers/reservasController');

// CRUD Reservas
router.get('/', reservasController.listarReservas);
router.get('/:id', reservasController.obtenerReserva);
router.post('/', reservasController.crearReserva);
router.put('/:id/estado', reservasController.actualizarEstadoReserva);
router.delete('/:id', reservasController.eliminarReserva);

module.exports = router;
