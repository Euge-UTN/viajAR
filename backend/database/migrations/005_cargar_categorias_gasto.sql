INSERT INTO categoria_gasto (nombre)
VALUES
    ('Alojamiento'),
    ('Transporte'),
    ('Comida'),
    ('Excursión'),
    ('Otros')
ON CONFLICT (nombre) DO NOTHING;