const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    try {
        const encabezado = req.headers.authorization;

        if (!encabezado || !encabezado.startsWith('Bearer ')) {
            return res.status(401).json({
                mensaje: 'No se proporcionó un token de autenticación'
            });
        }

        const token = encabezado.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            mensaje: 'Token inválido o expirado'
        });
    }
};

module.exports = verificarToken;