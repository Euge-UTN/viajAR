const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTRO DE USUARIO
const registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // Validar los datos recibidos
        if (!nombre || !email || !password) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                mensaje: 'La contraseña debe tener al menos 8 caracteres'
            });
        }

        const emailNormalizado = email.trim().toLowerCase();

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

        if (!email || !password) {
            return res.status(400).json({
                mensaje: 'El email y la contraseña son obligatorios'
            });
        }

        const emailNormalizado = email.trim().toLowerCase();

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

module.exports = {
    registrarUsuario,
    iniciarSesion
};