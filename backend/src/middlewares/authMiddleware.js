const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../config/database');

const verificarToken = async (req, res, next) => {
    try {
        const encabezado = req.headers.authorization;

        if (!encabezado || !encabezado.startsWith('Bearer ')) {
            return res.status(401).json({
                mensaje: 'No se proporcionó un token de autenticación'
            });
        }

        const token = encabezado.split(' ')[1];

        // Verificar el token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Generar el hash del token
        const tokenHash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Verificar si el token fue revocado
        const tokenRevocado = await pool.query(
            `SELECT id_token_revocado
             FROM token_revocado
             WHERE token_hash = $1
             AND fecha_expiracion > CURRENT_TIMESTAMP`,
            [tokenHash]
        );

        if (tokenRevocado.rows.length > 0) {
            return res.status(401).json({
                mensaje: 'La sesión fue cerrada. Inicie sesión nuevamente'
            });
        }

        req.usuario = decoded;

        next();

    } catch (error) {
        if (
            error.name === 'JsonWebTokenError' ||
            error.name === 'TokenExpiredError' ||
            error.name === 'NotBeforeError'
        ) {
            return res.status(401).json({
                mensaje: 'Token inválido o expirado'
            });
        }

        console.error('Error al verificar el token:', error);

        return res.status(500).json({
            mensaje: 'Error al verificar la autenticación'
        });
    }
};

module.exports = verificarToken;
