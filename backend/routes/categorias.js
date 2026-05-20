const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Público: listar y obtener
router.get('/', categoriasController.listarCategorias);
router.get('/:id', categoriasController.obtenerCategoria);

// Admin: crear, actualizar, eliminar
router.post('/', verifyToken, isAdmin, categoriasController.crearCategoria);
router.put('/:id', verifyToken, isAdmin, categoriasController.actualizarCategoria);
router.delete('/:id', verifyToken, isAdmin, categoriasController.eliminarCategoria);

module.exports = router;
