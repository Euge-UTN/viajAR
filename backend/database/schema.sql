-- BASE DE DATOS VIAJAR

CREATE TABLE Usuario (
    ID_Usuario SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    Fecha_Registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Fecha_Modificacion TIMESTAMP,
    Activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE Provincia (
    ID_Provincia SERIAL PRIMARY KEY,
    ID_GeoRef INTEGER UNIQUE,
    Nombre VARCHAR(100) NOT NULL UNIQUE,
    Activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE Entorno (
    ID_Entorno SERIAL PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL UNIQUE,
    Descripcion TEXT
);

CREATE TABLE Categoria_Gasto (
    ID_Categoria SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL UNIQUE,
    Fecha_Modificacion TIMESTAMP,
    Activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE Medalla (
    ID_Medalla SERIAL PRIMARY KEY,
    Codigo_Logro VARCHAR(50) NOT NULL UNIQUE,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    Tipo_Condicion VARCHAR(50),
    Valor_Objetivo INTEGER,
    Fecha_Modificacion TIMESTAMP,
    Activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE Localidad (
    ID_Localidad SERIAL PRIMARY KEY,
    ID_Provincia INTEGER NOT NULL,
    ID_GeoRef BIGINT UNIQUE,
    Nombre VARCHAR(100) NOT NULL,
    Activo BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (ID_Provincia)
        REFERENCES Provincia(ID_Provincia)
);

CREATE TABLE Lugar_Turistico (
    ID_Lugar SERIAL PRIMARY KEY,
    ID_Localidad INTEGER NOT NULL,
    ID_Entorno INTEGER NOT NULL,
    Nombre VARCHAR(150) NOT NULL,
    Descripcion TEXT,
    Direccion VARCHAR(255),
    Latitud NUMERIC,
    Longitud NUMERIC,
    Fecha_Modificacion TIMESTAMP,
    Activo BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (ID_Localidad)
        REFERENCES Localidad(ID_Localidad),

    FOREIGN KEY (ID_Entorno)
        REFERENCES Entorno(ID_Entorno)
);

CREATE TABLE Actividad (
    ID_Actividad SERIAL PRIMARY KEY,
    ID_Lugar INTEGER NOT NULL,
    ID_Usuario INTEGER NOT NULL,
    Nombre VARCHAR(150) NOT NULL,
    Descripcion TEXT,
    Fecha_Creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Fecha_Modificacion TIMESTAMP,
    Activo BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (ID_Lugar)
        REFERENCES Lugar_Turistico(ID_Lugar),

    FOREIGN KEY (ID_Usuario)
        REFERENCES Usuario(ID_Usuario)
);

CREATE TABLE Viaje (
    ID_Viaje SERIAL PRIMARY KEY,
    ID_Usuario INTEGER NOT NULL,
    ID_Localidad INTEGER NOT NULL,
    Nombre VARCHAR(150) NOT NULL,
    Fecha_Creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Fecha_Inicio DATE NOT NULL,
    Fecha_Fin DATE NOT NULL,
    Presupuesto NUMERIC(12, 2),
    Estado VARCHAR(50) NOT NULL,
    Fecha_Modificacion TIMESTAMP,

    FOREIGN KEY (ID_Usuario)
        REFERENCES Usuario(ID_Usuario),

    FOREIGN KEY (ID_Localidad)
        REFERENCES Localidad(ID_Localidad),

    CHECK (Fecha_Fin >= Fecha_Inicio),
    CHECK (Presupuesto IS NULL OR Presupuesto >= 0)
);

CREATE TABLE Itinerario (
    ID_Itinerario SERIAL PRIMARY KEY,
    ID_Lugar INTEGER NOT NULL,
    ID_Categoria INTEGER NOT NULL,
    ID_Usuario INTEGER NOT NULL,
    ID_Viaje INTEGER NOT NULL,
    Fecha_Visita TIMESTAMP NOT NULL,
    Estado_Visita VARCHAR(50) NOT NULL,
    Observaciones TEXT,
    Fecha_Modificacion TIMESTAMP,
    Activo BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (ID_Lugar)
        REFERENCES Lugar_Turistico(ID_Lugar),

    FOREIGN KEY (ID_Categoria)
        REFERENCES Categoria_Gasto(ID_Categoria),

    FOREIGN KEY (ID_Usuario)
        REFERENCES Usuario(ID_Usuario),

    FOREIGN KEY (ID_Viaje)
        REFERENCES Viaje(ID_Viaje)
);

CREATE TABLE Favorito (
    ID_Usuario INTEGER NOT NULL,
    ID_Lugar INTEGER NOT NULL,
    Fecha_Agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Fecha_Modificacion TIMESTAMP,

    PRIMARY KEY (ID_Usuario, ID_Lugar),

    FOREIGN KEY (ID_Usuario)
        REFERENCES Usuario(ID_Usuario),

    FOREIGN KEY (ID_Lugar)
        REFERENCES Lugar_Turistico(ID_Lugar)
);

CREATE TABLE Resena (
    ID_Resena SERIAL PRIMARY KEY,
    ID_Usuario INTEGER NOT NULL,
    ID_Lugar INTEGER NOT NULL,
    Puntuacion INTEGER NOT NULL,
    Comentario TEXT,
    Fecha_Creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (ID_Usuario)
        REFERENCES Usuario(ID_Usuario),

    FOREIGN KEY (ID_Lugar)
        REFERENCES Lugar_Turistico(ID_Lugar),

    CHECK (Puntuacion BETWEEN 1 AND 5),
    UNIQUE (ID_Usuario, ID_Lugar)
);

CREATE TABLE Foto_Resena (
    ID_Foto SERIAL PRIMARY KEY,
    ID_Resena INTEGER NOT NULL,
    Url_Foto VARCHAR(500) NOT NULL,
    Fecha_Carga TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (ID_Resena)
        REFERENCES Resena(ID_Resena)
);

CREATE TABLE Gasto (
    ID_Gasto SERIAL PRIMARY KEY,
    ID_Viaje INTEGER NOT NULL,
    ID_Categoria INTEGER NOT NULL,
    ID_Itinerario INTEGER,
    ID_Usuario INTEGER NOT NULL,
    Descripcion TEXT,
    Monto NUMERIC(12, 2) NOT NULL,
    Fecha_Gasto DATE NOT NULL,
    Fecha_Modificacion TIMESTAMP,
    Activo BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (ID_Viaje)
        REFERENCES Viaje(ID_Viaje),

    FOREIGN KEY (ID_Categoria)
        REFERENCES Categoria_Gasto(ID_Categoria),

    FOREIGN KEY (ID_Itinerario)
        REFERENCES Itinerario(ID_Itinerario),

    FOREIGN KEY (ID_Usuario)
        REFERENCES Usuario(ID_Usuario),

    CHECK (Monto >= 0)
);

CREATE TABLE Usuario_Medalla (
    ID_Usuario INTEGER NOT NULL,
    ID_Medalla INTEGER NOT NULL,
    Fecha_Desbloqueo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Fecha_Modificacion TIMESTAMP,

    PRIMARY KEY (ID_Usuario, ID_Medalla),

    FOREIGN KEY (ID_Usuario)
        REFERENCES Usuario(ID_Usuario),

    FOREIGN KEY (ID_Medalla)
        REFERENCES Medalla(ID_Medalla)
);

