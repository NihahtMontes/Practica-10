const db = require('../config/db');

// Crear categoría
exports.crearCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const [result] = await db.execute(
            'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
            [nombre, descripcion]
        );
        res.status(201).json({ id: result.insertId, message: 'Categoría creada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Listar todas las categorías
exports.listarCategorias = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM categorias ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener una categoría por ID
exports.obtenerCategoria = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM categorias WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Categoría no encontrada' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar categoría
exports.actualizarCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const [result] = await db.execute(
            'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?',
            [nombre, descripcion, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Categoría no encontrada' });
        res.json({ message: 'Categoría actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar categoría
exports.eliminarCategoria = async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM categorias WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Categoría no encontrada' });
        res.json({ message: 'Categoría eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
