const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Público: listar, obtener, whatsapp
router.get('/', productosController.listarProductos);
router.get('/:id', productosController.obtenerProducto);
router.get('/:id/whatsapp', productosController.generarLinkWhatsApp);

// Admin: crear, actualizar, eliminar
router.post('/', verifyToken, isAdmin, productosController.crearProducto);
router.put('/:id', verifyToken, isAdmin, productosController.actualizarProducto);
router.delete('/:id', verifyToken, isAdmin, productosController.eliminarProducto);

module.exports = router;
