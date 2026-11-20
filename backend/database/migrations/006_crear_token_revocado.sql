CREATE TABLE token_revocado (
    id_token_revocado SERIAL PRIMARY KEY,
    token_hash CHAR(64) NOT NULL UNIQUE,
    fecha_expiracion TIMESTAMP NOT NULL,
    fecha_revocacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);