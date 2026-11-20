require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const pool = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const verificarToken = require('./middlewares/authMiddleware');
const lugarRoutes = require('./routes/lugarRoutes');
const cron = require('node-cron');
const { actualizarGeoRef } = require('./tasks/actualizarGeoRef');
const viajeRoutes = require('./routes/viajeRoutes');
const itinerarioRoutes = require('./routes/itinerarioRoutes');
const gastoRoutes = require('./routes/gastoRoutes');
const favoritoRoutes = require('./routes/favoritoRoutes');
const resenaRoutes = require('./routes/resenaRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas de autenticación
app.use('/api/auth', authRoutes);
app.use('/api/lugares', verificarToken, lugarRoutes);
app.use('/api/viajes', verificarToken, viajeRoutes);
app.use('/api/itinerarios', verificarToken, itinerarioRoutes);
app.use('/api/gastos', verificarToken, gastoRoutes);
app.use('/api/favoritos', verificarToken, favoritoRoutes);
app.use('/api/resenas', verificarToken, resenaRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ mensaje: 'Servidor ViajAR funcionando correctamente' });
});

// Consultar perfil del usuario autenticado
app.get('/api/auth/perfil', verificarToken, async (req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT id_usuario, nombre, email
             FROM usuario
             WHERE id_usuario = $1
             AND activo = TRUE`,
            [req.usuario.id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        return res.status(200).json({
            mensaje: 'Acceso autorizado',
            usuario: {
                id: resultado.rows[0].id_usuario,
                nombre: resultado.rows[0].nombre,
                email: resultado.rows[0].email
            }
        });

    } catch (error) {
        console.error('Error al consultar el perfil:', error);

        return res.status(500).json({
            mensaje: 'Error al consultar el perfil del usuario'
        });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ViajAR escuchando en el puerto ${PORT}`);
});

// Tarea automática: actualizar datos de GeoRef todos los días a las 03:00
cron.schedule('0 3 * * *', () => {
    console.log('Ejecutando tarea programada de GeoRef...');
    actualizarGeoRef();
}, {
    timezone: 'America/Argentina/Buenos_Aires'
});
