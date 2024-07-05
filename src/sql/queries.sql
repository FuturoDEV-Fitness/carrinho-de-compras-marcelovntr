
CREATE DATABASE lab_commerce

CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    cpf VARCHAR(50) UNIQUE NOT NULL,
    contact VARCHAR(20) NOT NULL
);

/*CADASTRO DE PRODUTO*/
create table categories(
	id serial primary key,
	name varchar(150) not null
)

insert into categories(name) values('mouse'), ('monitor'), ('tablet'), ('notebook'), ('PC'),
 ('impressora'), ('smartphone'), ('webcam'), ('microfone'), ('smartwatch')


/*TABELA PRODUCTS*/
create type voltage_enum as enum ('110', '220')

create table products(
id serial primary key,
name varchar(150) NOT NULL,
amount int default 0,
color varchar(50),
voltage voltage_enum,
description TEXT,
category_id int NOT NULL,
CONSTRAINT fk_category
FOREIGN KEY(category_id) 
REFERENCES categories(id)
)