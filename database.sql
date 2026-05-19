-- Base de datos: tienda_reservas
-- Ejecutar este script en MySQL para crear las tablas necesarias

CREATE DATABASE IF NOT EXISTS tienda_reservas;
USE tienda_reservas;

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    imagen VARCHAR(500),
    stock INT DEFAULT 0,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de reservas
CREATE TABLE IF NOT EXISTS reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    cliente_nombre VARCHAR(100) NOT NULL,
    cliente_telefono VARCHAR(20),
    mensaje TEXT,
    estado ENUM('pendiente', 'confirmada', 'cancelada') DEFAULT 'pendiente',
    fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);
