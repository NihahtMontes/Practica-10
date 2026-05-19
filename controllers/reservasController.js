const db = require('../config/db');

// Crear reserva
exports.crearReserva = async (req, res) => {
    try {
        const { producto_id, cliente_nombre, cliente_telefono, mensaje } = req.body;
        const [result] = await db.execute(
            'INSERT INTO reservas (producto_id, cliente_nombre, cliente_telefono, mensaje) VALUES (?, ?, ?, ?)',
            [producto_id, cliente_nombre, cliente_telefono, mensaje]
        );
        res.status(201).json({ id: result.insertId, message: 'Reserva creada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Listar todas las reservas
exports.listarReservas = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT r.*, p.nombre AS producto_nombre, p.precio AS producto_precio
            FROM reservas r
            JOIN productos p ON r.producto_id = p.id
            ORDER BY r.fecha_reserva DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener una reserva por ID
exports.obtenerReserva = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT r.*, p.nombre AS producto_nombre, p.precio AS producto_precio
            FROM reservas r
            JOIN productos p ON r.producto_id = p.id
            WHERE r.id = ?
        `, [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Reserva no encontrada' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar estado de la reserva
exports.actualizarEstadoReserva = async (req, res) => {
    try {
        const { estado } = req.body;
        const [result] = await db.execute(
            'UPDATE reservas SET estado = ? WHERE id = ?',
            [estado, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Reserva no encontrada' });
        res.json({ message: 'Estado de reserva actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar reserva
exports.eliminarReserva = async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM reservas WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Reserva no encontrada' });
        res.json({ message: 'Reserva eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
