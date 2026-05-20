const express = require('express');
const router = express.Router();
const reservasController = require('../controllers/reservasController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Público: crear reserva (desde WhatsApp o formulario)
router.post('/', reservasController.crearReserva);

// Admin: listar, obtener, actualizar estado, eliminar
router.get('/', verifyToken, isAdmin, reservasController.listarReservas);
router.get('/:id', verifyToken, isAdmin, reservasController.obtenerReserva);
router.put('/:id/estado', verifyToken, isAdmin, reservasController.actualizarEstadoReserva);
router.delete('/:id', verifyToken, isAdmin, reservasController.eliminarReserva);

module.exports = router;
