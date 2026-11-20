const pool = require('../../src/config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../../src/config/database', () => ({
    query: jest.fn()
}));

jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
    compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn()
}));

const {
    registrarUsuario,
    iniciarSesion,
    cerrarSesion
} = require('../../src/controllers/authController');

// Simular los objetos request y response
const crearMocks = (body = {}) => {
    const req = { body };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    return { req, res };
};

beforeEach(() => {
    jest.clearAllMocks();
});


describe('Registro de usuario', () => {

    test('Debe registrar un usuario correctamente', async () => {
        const { req, res } = crearMocks({
            nombre: 'Usuario de prueba',
            email: 'prueba@viajar.com',
            password: 'viajar1234'
        });

        // Simular que el email no está registrado
        pool.query
            .mockResolvedValueOnce({ rows: [] })
            .mockResolvedValueOnce({
                rows: [{
                    id_usuario: 1,
                    nombre: 'Usuario de prueba',
                    email: 'prueba@viajar.com',
                    fecha_registro: '2026-11-20'
                }]
            });

        // Simular el hash de la contraseña
        bcrypt.hash.mockResolvedValue('password_encriptada');

        await registrarUsuario(req, res);

        // Verificar la respuesta
        expect(res.status).toHaveBeenCalledWith(201);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: 'Usuario registrado correctamente',
            usuario: {
                id_usuario: 1,
                nombre: 'Usuario de prueba',
                email: 'prueba@viajar.com',
                fecha_registro: '2026-11-20'
            }
        });

        // Verificar que se haya encriptado la contraseña
        expect(bcrypt.hash).toHaveBeenCalledWith('viajar1234', 10);

        // Verificar que se hayan realizado las dos consultas
        expect(pool.query).toHaveBeenCalledTimes(2);
    });

    test('No debe registrar un usuario si faltan campos obligatorios', async () => {
        const { req, res } = crearMocks({
            nombre: '',
            email: 'prueba@viajar.com',
            password: 'viajar1234'
        });

        await registrarUsuario(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: 'Todos los campos son obligatorios'
        });

        // No debe consultar la base de datos
        expect(pool.query).not.toHaveBeenCalled();

        // No debe encriptar la contraseña
        expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    test('No debe registrar un usuario con un email inválido', async () => {
        const { req, res } = crearMocks({
            nombre: 'Usuario de prueba',
            email: 'correo_invalido',
            password: 'viajar1234'
        });

        await registrarUsuario(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: 'El formato del email no es válido o supera los 254 caracteres'
        });

        expect(pool.query).not.toHaveBeenCalled();
        expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    test('No debe registrar un usuario con un email ya existente', async () => {
        const { req, res } = crearMocks({
            nombre: 'Usuario de prueba',
            email: 'prueba@viajar.com',
            password: 'viajar1234'
        });

        // Simular que el email ya existe
        pool.query.mockResolvedValueOnce({
            rows: [{ id_usuario: 1 }]
        });

        await registrarUsuario(req, res);

        expect(res.status).toHaveBeenCalledWith(409);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: 'El email ya se encuentra registrado'
        });

        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    test('No debe registrar un usuario con una contraseña menor a 8 caracteres', async () => {
        const { req, res } = crearMocks({
            nombre: 'Usuario de prueba',
            email: 'nuevo@viajar.com',
            password: '1234567'
        });

        await registrarUsuario(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: 'La contraseña debe tener al menos 8 caracteres'
        });

        expect(pool.query).not.toHaveBeenCalled();
        expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    test('No debe registrar un usuario con una contraseña superior a 72 bytes', async () => {
        const { req, res } = crearMocks({
            nombre: 'Usuario de prueba',
            email: 'nuevo@viajar.com',
            password: 'a'.repeat(73)
        });

        await registrarUsuario(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: 'La contraseña no puede superar los 72 bytes'
        });

        expect(pool.query).not.toHaveBeenCalled();
        expect(bcrypt.hash).not.toHaveBeenCalled();
    });

});

describe('Inicio de sesión', () => {
    test('Debe iniciar sesión correctamente', async () => {
        const { req, res } = crearMocks({
            email: 'prueba@viajar.com',
            password: 'viajar1234'
        });

        pool.query.mockResolvedValueOnce({
            rows: [{
                id_usuario: 1,
                nombre: 'Usuario de prueba',
                email: 'prueba@viajar.com',
                password: 'password_encriptada',
                activo: true
            }]
        });

        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('token_de_prueba');

        await iniciarSesion(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                mensaje: 'Inicio de sesión exitoso',
                token: 'token_de_prueba'
            })
        );

        expect(bcrypt.compare).toHaveBeenCalledWith(
            'viajar1234',
            'password_encriptada'
        );

        expect(jwt.sign).toHaveBeenCalled();
        expect(pool.query).toHaveBeenCalledTimes(1);
    });

    test('No debe iniciar sesión si faltan campos obligatorios', async () => {
    const { req, res } = crearMocks({
        email: '',
        password: ''
    });

    await iniciarSesion(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        mensaje: 'El email y la contraseña son obligatorios'
    });

    expect(pool.query).not.toHaveBeenCalled();
    expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    test('No debe iniciar sesión con un email inválido', async () => {
    const { req, res } = crearMocks({
        email: 'correo_invalido',
        password: 'viajar1234'
    });

    await iniciarSesion(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        mensaje: 'El formato del email no es válido'
    });

    expect(pool.query).not.toHaveBeenCalled();
    expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    test('No debe iniciar sesión con una contraseña superior a 72 bytes', async () => {
    const { req, res } = crearMocks({
        email: 'prueba@viajar.com',
        password: 'a'.repeat(73)
    });

    await iniciarSesion(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        mensaje: 'La contraseña no puede superar los 72 bytes'
    });

    expect(pool.query).not.toHaveBeenCalled();
    expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    test('No debe iniciar sesión si el usuario no está registrado', async () => {
    const { req, res } = crearMocks({
        email: 'inexistente@viajar.com',
        password: 'viajar1234'
    });

    pool.query.mockResolvedValueOnce({
        rows: []
    });

    await iniciarSesion(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
        mensaje: 'Email o contraseña incorrectos'
    });

    expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    test('No debe iniciar sesión con un usuario inactivo', async () => {
    const { req, res } = crearMocks({
        email: 'prueba@viajar.com',
        password: 'viajar1234'
    });

    pool.query.mockResolvedValueOnce({
        rows: [{
            id_usuario: 1,
            nombre: 'Usuario de prueba',
            email: 'prueba@viajar.com',
            password: 'password_encriptada',
            activo: false
        }]
    });

    await iniciarSesion(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    test('No debe iniciar sesión con una contraseña incorrecta', async () => {
    const { req, res } = crearMocks({
        email: 'prueba@viajar.com',
        password: 'password_incorrecta'
    });

    pool.query.mockResolvedValueOnce({
        rows: [{
            id_usuario: 1,
            nombre: 'Usuario de prueba',
            email: 'prueba@viajar.com',
            password: 'password_encriptada',
            activo: true
        }]
    });

    bcrypt.compare.mockResolvedValue(false);

    await iniciarSesion(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(bcrypt.compare).toHaveBeenCalledWith(
        'password_incorrecta',
        'password_encriptada'
    );
  });

  test('Debe devolver error 500 si falla la consulta a la base de datos', async () => {
    const { req, res } = crearMocks({
        email: 'prueba@viajar.com',
        password: 'viajar1234'
    });

    pool.query.mockRejectedValueOnce(new Error('Error de conexión'));

    await iniciarSesion(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
        mensaje: 'Error al iniciar sesión'
    });
 });

});

describe('Cierre de sesión', () => {
    test('Debe cerrar sesión correctamente', async () => {
        const token = 'token_de_prueba';

        const { req, res } = crearMocks();

        req.headers = {
            authorization: `Bearer ${token}`
        };

        jwt.verify = jest.fn().mockReturnValue({
            exp: 1790000000
        });

        pool.query.mockResolvedValueOnce({ rows: [] });

        await cerrarSesion(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            mensaje: 'Sesión cerrada correctamente'
        });

        expect(jwt.verify).toHaveBeenCalledWith(
            token,
            process.env.JWT_SECRET
        );

        expect(pool.query).toHaveBeenCalledTimes(1);
    });

    test('No debe cerrar sesión con un token inválido', async () => {
        const { req, res } = crearMocks();

        req.headers = {
            authorization: 'Bearer token_invalido'
        };

        jwt.verify.mockImplementation(() => {
            const error = new Error('Token inválido');
            error.name = 'JsonWebTokenError';
            throw error;
        });

        await cerrarSesion(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            mensaje: 'Token inválido o expirado'
        });

        expect(pool.query).not.toHaveBeenCalled();
    });

});