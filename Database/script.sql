create database login;

CREATE TABLE user (
    id_user INT(255) AUTO_INCREMENT NOT NULL,
    name_user VARCHAR(50) NOT NULL,
    rol_user VARCHAR(50) NOT NULL,
    pass_user VARCHAR(255) NOT NULL,
        CONSTRAINT pk_user PRIMARY KEY (id_user) 
);