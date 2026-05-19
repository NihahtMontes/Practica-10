const db = require('../config/db');

// Crear producto
exports.crearProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, imagen, stock } = req.body;
        const [result] = await db.execute(
            'INSERT INTO productos (nombre, descripcion, precio, imagen, stock) VALUES (?, ?, ?, ?, ?)',
            [nombre, descripcion, precio, imagen, stock]
        );
        res.status(201).json({ id: result.insertId, message: 'Producto creado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Listar todos los productos
exports.listarProductos = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM productos ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un producto por ID
exports.obtenerProducto = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM productos WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar producto
exports.actualizarProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, imagen, stock } = req.body;
        const [result] = await db.execute(
            'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, imagen = ?, stock = ? WHERE id = ?',
            [nombre, descripcion, precio, imagen, stock, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar producto
exports.eliminarProducto = async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM productos WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Generar link de WhatsApp para reservar un producto
exports.generarLinkWhatsApp = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM productos WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });

        const producto = rows[0];
        const numero = process.env.WHATSAPP_NUMBER;
        const mensaje = `Hola, deseo reservar el producto ${producto.nombre} con precio de ${producto.precio} Bs.`;
        const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

        res.json({
            producto: {
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio
            },
            whatsapp_url: url,
            mensaje: mensaje
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
