const express = require('express');
const router = express.Router();

const { rateLimit } = require('express-rate-limit');

const verificarToken = require('../middlewares/authMiddleware');

const {
    registrarUsuario,
    iniciarSesion,
    cerrarSesion
} = require('../controllers/authController');

// Limitar los intentos de inicio de sesión
const limitarIntentosLogin = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        mensaje: 'Demasiados intentos de inicio de sesión. Intente nuevamente en 15 minutos.'
    }
});

// Ruta para registrar un usuario
router.post('/registro', registrarUsuario);

// Ruta para iniciar sesión
router.post('/login', limitarIntentosLogin, iniciarSesion);

// Ruta para cerrar sesión
router.post('/logout', verificarToken, cerrarSesion);

module.exports = router;
