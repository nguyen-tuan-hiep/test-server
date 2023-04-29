CREATE DATABASE IF NOT EXISTS restaurant;

create extension if not exists "uuid-ossp";

create table
  users (
    user_id uuid primary key default uuid_generate_v4 (),
    user_name varchar(255) not null,
    user_email varchar(255) not null,
    user_password varchar(255) not null
  );

insert into
  users (user_name, user_email, user_password)
values
  ('hiep', 'hiep@gmail.com', 'hiepicthust');

select
  *
from
  users;

CREATE TABLE
  customers (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL);

INSERT INTO
  customers (name)
VALUES
  ('John');

SELECT
  *
FROM
  customers;

CREATE TABLE
  class (id INT PRIMARY KEY, name VARCHAR(50));

INSERT INTO
  class (id, name)
VALUES
  (1, 'Math'),
  (2, 'Science'),
  (3, 'English');

CREATE TABLE
  student (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    age INT,
    class_id INT,
    FOREIGN KEY (class_id) REFERENCES class (id)
  );

INSERT INTO
  student (id, name, age, class_id)
VALUES
  (1, 'John Smith', 18, 1),
  (2, 'Jane Doe', 19, 1),
  (3, 'Sam Johnson', 18, 1),
  (4, 'David Lee', 17, 1),
  (5, 'Olivia Brown', 19, 1),
  (6, 'Emily Davis', 18, 2),
  (7, 'Lucas Wilson', 19, 2),
  (8, 'Sophie Adams', 17, 2),
  (9, 'Ethan Jones', 18, 2),
  (10, 'Liam Wilson', 19, 2),
  (11, 'Ava Jackson', 17, 3),
  (12, 'Noah Parker', 18, 3),
  (13, 'Isabella Lee', 19, 3),
  (14, 'William Chen', 17, 3),
  (15, 'Mia Gomez', 18, 3),
  (16, 'Benjamin Scott', 19, 1),
  (17, 'Chloe James', 17, 2),
  (18, 'Jacob Young', 18, 3),
  (19, 'Abigail Kim', 19, 1),
  (20, 'Daniel Hernandez', 17, 3);

select
  s.id id,
  s.name name,
  s.age age,
  c.id class_id,
  c.name class_name
from
  student s
  join class c on s.class_id = c.id
order by
  s.id;
