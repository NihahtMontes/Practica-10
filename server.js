require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const productosRoutes = require('./routes/productos');
const reservasRoutes = require('./routes/reservas');

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/productos', productosRoutes);
app.use('/api/reservas', reservasRoutes);

// Ruta raiz
app.get('/', (req, res) => {
    res.json({ message: 'API de Productos y Reservas funcionando correctamente' });
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
