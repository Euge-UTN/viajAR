const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// VALIDAR FORMATO DE EMAIL
const esEmailValido = (email) => {
    const expresion = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return typeof email === 'string' &&
        email.length <= 254 &&
        expresion.test(email);
};

// REGISTRO DE USUARIO
const registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // Validar los datos recibidos
        if (
            typeof nombre !== 'string' ||
            !nombre.trim() ||
            typeof email !== 'string' ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const emailNormalizado = email.trim().toLowerCase();

        // Validar el formato del email
        if (!esEmailValido(emailNormalizado)) {
            return res.status(400).json({
                mensaje: 'El formato del email no es válido o supera los 254 caracteres'
            });
        }

        // Validar la contraseña
        if (typeof password !== 'string' || password.length < 8) {
            return res.status(400).json({
                mensaje: 'La contraseña debe tener al menos 8 caracteres'
            });
        }

        if (Buffer.byteLength(password, 'utf8') > 72) {
            return res.status(400).json({
                mensaje: 'La contraseña no puede superar los 72 bytes'
            });
        }

        // Verificar si el email ya está registrado
        const usuarioExistente = await pool.query(
            'SELECT id_usuario FROM usuario WHERE email = $1',
            [emailNormalizado]
        );

        if (usuarioExistente.rows.length > 0) {
            return res.status(409).json({
                mensaje: 'El email ya se encuentra registrado'
            });
        }

        // Encriptar la contraseña mediante un hash
        const passwordHash = await bcrypt.hash(password, 10);

        // Guardar el nuevo usuario
        const resultado = await pool.query(
            `INSERT INTO usuario (nombre, email, password)
             VALUES ($1, $2, $3)
             RETURNING id_usuario, nombre, email, fecha_registro`,
            [nombre.trim(), emailNormalizado, passwordHash]
        );

        return res.status(201).json({
            mensaje: 'Usuario registrado correctamente',
            usuario: resultado.rows[0]
        });

    } catch (error) {
        console.error('Error al registrar usuario:', error);

        return res.status(500).json({
            mensaje: 'Error al registrar el usuario'
        });
    }
};

// INICIO DE SESIÓN
const iniciarSesion = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== 'string' ||
            !email.trim() ||
            typeof password !== 'string' ||
            !password
        ) {
            return res.status(400).json({
                mensaje: 'El email y la contraseña son obligatorios'
            });
        }

        const emailNormalizado = email.trim().toLowerCase();

        // Validar el formato del email
        if (!esEmailValido(emailNormalizado)) {
            return res.status(400).json({
                mensaje: 'El formato del email no es válido'
            });
        }

        // Validar la longitud de la contraseña
        if (Buffer.byteLength(password, 'utf8') > 72) {
            return res.status(400).json({
                mensaje: 'La contraseña no puede superar los 72 bytes'
            });
        }

        // Buscar el usuario por email
        const resultado = await pool.query(
            `SELECT id_usuario, nombre, email, password, activo
             FROM usuario
             WHERE email = $1`,
            [emailNormalizado]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({
                mensaje: 'Email o contraseña incorrectos'
            });
        }

        const usuario = resultado.rows[0];

        if (!usuario.activo) {
            return res.status(403).json({
                mensaje: 'El usuario se encuentra inactivo'
            });
        }

        // Comparar la contraseña ingresada con el hash almacenado
        const passwordValida = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordValida) {
            return res.status(401).json({
                mensaje: 'Email o contraseña incorrectos'
            });
        }

        // Generar el token JWT
        const token = jwt.sign(
            {
                id: usuario.id_usuario,
                email: usuario.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            mensaje: 'Inicio de sesión exitoso',
            token,
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                email: usuario.email
            }
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);

        return res.status(500).json({
            mensaje: 'Error al iniciar sesión'
        });
    }
};

// CERRAR SESIÓN
const cerrarSesion = async (req, res) => {
    try {
        const encabezado = req.headers.authorization;
        const token = encabezado.split(' ')[1];

        // Obtener los datos del token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Generar un hash del token
        const tokenHash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Registrar el token como revocado
        await pool.query(
            `INSERT INTO token_revocado (token_hash, fecha_expiracion)
             VALUES ($1, TO_TIMESTAMP($2))
             ON CONFLICT (token_hash) DO NOTHING`,
            [tokenHash, decoded.exp]
        );

        return res.status(200).json({
            mensaje: 'Sesión cerrada correctamente'
        });

    } catch (error) {
        if (error.name === 'JsonWebTokenError' ||
            error.name === 'TokenExpiredError') {
            return res.status(401).json({
                mensaje: 'Token inválido o expirado'
            });
        }

        console.error('Error al cerrar sesión:', error);

        return res.status(500).json({
            mensaje: 'Error al cerrar la sesión'
        });
    }
};

module.exports = {
    registrarUsuario,
    iniciarSesion,
    cerrarSesion
};
