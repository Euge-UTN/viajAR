require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const pool = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const verificarToken = require('./middlewares/authMiddleware');
const lugarRoutes = require('./routes/lugarRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas de autenticación
app.use('/api/auth', authRoutes);
app.use('/api/lugares', lugarRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ mensaje: 'Servidor ViajAR funcionando correctamente' });
});

// Ruta protegida de prueba
app.get('/api/auth/perfil', verificarToken, (req, res) => {
    res.json({
        mensaje: 'Acceso autorizado',
        usuario: req.usuario
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ViajAR escuchando en el puerto ${PORT}`);
});