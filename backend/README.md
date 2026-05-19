# Backend - API de Productos y Reservas por WhatsApp

## Instalacion

1. Ejecutar el script `database.sql` en MySQL para crear la base de datos y tablas.
2. Renombrar `.env.example` a `.env` y configurar las credenciales de la base de datos.
3. Ejecutar `npm install` para instalar las dependencias.
4. Ejecutar `npm start` para iniciar el servidor (o `npm run dev` con nodemon).

---

## Endpoints

### Productos

#### 1. Listar todos los productos
- **GET** `/api/productos`
- **Respuesta:**
```json
[
  {
    "id": 1,
    "nombre": "Samsung Galaxy A55",
    "descripcion": "Celular de gama media alta",
    "precio": 2500.00,
    "imagen": "https://...",
    "stock": 10,
    "fecha_registro": "2026-05-19T10:00:00.000Z"
  }
]
```

#### 2. Obtener un producto por ID
- **GET** `/api/productos/:id`
- **Respuesta:**
```json
{
  "id": 1,
  "nombre": "Samsung Galaxy A55",
  "descripcion": "Celular de gama media alta",
  "precio": 2500.00,
  "imagen": "https://...",
  "stock": 10,
  "fecha_registro": "2026-05-19T10:00:00.000Z"
}
```

#### 3. Crear un producto
- **POST** `/api/productos`
- **Body:**
```json
{
  "nombre": "Samsung Galaxy A55",
  "descripcion": "Celular de gama media alta",
  "precio": 2500.00,
  "imagen": "https://url-de-imagen.com",
  "stock": 10
}
```

#### 4. Actualizar un producto
- **PUT** `/api/productos/:id`
- **Body:** (mismos campos que POST)

#### 5. Eliminar un producto
- **DELETE** `/api/productos/:id`

#### 6. Generar link de WhatsApp para reservar un producto
- **GET** `/api/productos/:id/whatsapp`
- **Respuesta:**
```json
{
  "producto": {
    "id": 1,
    "nombre": "Samsung Galaxy A55",
    "precio": 2500
  },
  "whatsapp_url": "https://wa.me/59172792030?text=Hola%2C%20deseo%20reservar...",
  "mensaje": "Hola, deseo reservar el producto Samsung Galaxy A55 con precio de 2500 Bs."
}
```
- **Uso en Frontend:** El boton "Reservar por WhatsApp" debe hacer una peticion a este endpoint, obtener la `whatsapp_url` y abrirla en una nueva pestana (`window.open(url, '_blank')`).

---

### Reservas

#### 1. Listar todas las reservas
- **GET** `/api/reservas`
- **Respuesta:**
```json
[
  {
    "id": 1,
    "producto_id": 1,
    "cliente_nombre": "Juan Perez",
    "cliente_telefono": "59172792030",
    "mensaje": "Hola, deseo reservar...",
    "estado": "pendiente",
    "fecha_reserva": "2026-05-19T10:00:00.000Z",
    "producto_nombre": "Samsung Galaxy A55",
    "producto_precio": 2500
  }
]
```

#### 2. Obtener una reserva por ID
- **GET** `/api/reservas/:id`

#### 3. Crear una reserva
- **POST** `/api/reservas`
- **Body:**
```json
{
  "producto_id": 1,
  "cliente_nombre": "Juan Perez",
  "cliente_telefono": "59177712345",
  "mensaje": "Hola, deseo reservar..."
}
```

#### 4. Actualizar estado de una reserva
- **PUT** `/api/reservas/:id/estado`
- **Body:**
```json
{
  "estado": "confirmada"
}
```
- **Valores permitidos:** `pendiente`, `confirmada`, `cancelada`

#### 5. Eliminar una reserva
- **DELETE** `/api/reservas/:id`

---

## Variables de Entorno (.env)

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=tienda_reservas
WHATSAPP_NUMBER=59172792030
```
