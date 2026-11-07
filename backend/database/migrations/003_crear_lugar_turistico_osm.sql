CREATE TABLE lugar_turistico_osm (
    id_osm SERIAL PRIMARY KEY,
    osm_tipo VARCHAR(10) NOT NULL,
    osm_id BIGINT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    tipo_turismo VARCHAR(100),
    latitud NUMERIC,
    longitud NUMERIC,
    etiquetas JSONB,
    id_localidad INTEGER,
    importado BOOLEAN DEFAULT FALSE,
    fecha_consulta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (osm_tipo, osm_id),
    FOREIGN KEY (id_localidad) REFERENCES localidad(id_localidad)
);