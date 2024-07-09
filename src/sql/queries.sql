
CREATE DATABASE lab_commerce

CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    cpf VARCHAR(50) UNIQUE NOT NULL,
    contact VARCHAR(20) NOT NULL
);

ALTER TABLE clients 
ALTER COLUMN cpf 
SET DATA TYPE VARCHAR(11);

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

alter table products 
add column price decimal(10,2)


/*TABELA ORDERS*/
create table orders(
	
    id serial primary key,
    client_id int not null,
    total decimal (10,2) not null,
    address TEXT not null,
    observations varchar(200),
	constraint fk_client
	foreign key (client_id)
	references clients (id)

)
/*TABELA ORDERS_ITEMS*/
create table orders_items(
	
    id serial primary key,
    orders_id int not null,
    products_id int not null,
    amount int not null,
    price decimal (10,2) not null, /*//<--preço no momento da compra, para consultas posteriores*/
	foreign key (orders_id) references orders(id),
	foreign key (products_id)references products(id)
)

/*LISTAR USANDO JOIN*/
SELECT products.name AS produto, categories.name AS tipo, products.amount AS estoque, products.color AS cores, 
products.voltage AS voltagem, products.description AS descrição
FROM products
JOIN categories
ON products.category_id = categories.id