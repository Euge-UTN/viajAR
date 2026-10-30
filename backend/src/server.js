const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const pool = require('./config/database');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ mensaje: 'Servidor ViajAR funcionando correctamente' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ViajAR escuchando en el puerto ${PORT}`);
});