CREATE DATABASE IF NOT EXISTS restaurant;

create extension if not exists "uuid-ossp";

create table users(
	user_id uuid primary key default uuid_generate_v4(),
	user_name varchar(255) not null,
	user_email varchar(255) not null,
	user_password varchar(255) not null
);

insert into users (user_name, user_email, user_password)
values ('hiep','hiep@gmail.com', 'hiepicthust');

select * from users;


CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

INSERT INTO customers (name) VALUES ('John');

SELECT * FROM customers;