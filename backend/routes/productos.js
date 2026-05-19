const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');

// CRUD Productos
router.get('/', productosController.listarProductos);
router.get('/:id', productosController.obtenerProducto);
router.post('/', productosController.crearProducto);
router.put('/:id', productosController.actualizarProducto);
router.delete('/:id', productosController.eliminarProducto);

// Generar link de WhatsApp para un producto
router.get('/:id/whatsapp', productosController.generarLinkWhatsApp);

module.exports = router;
