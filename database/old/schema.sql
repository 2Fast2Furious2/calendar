DROP DATABASE IF EXISTS calendar;

CREATE DATABASE calendar;

USE calendar;

CREATE TABLE rooms (
  id INT NOT NULL AUTO_INCREMENT,
  nightly_fee SMALLINT NOT NULL,
  rating DECIMAL(3,2),
  reviews SMALLINT,
  minimum_stay TINYINT NOT NULL,
  maximum_guest TINYINT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE reservations (
  id INT NOT NULL AUTO_INCREMENT,
  room_id INT NOT NULL,
  booked_date DATE NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

/*  Execute this file from the command line by typing:
 *    mysql -u root < path to schema.sql
 *  to create the database and the tables.*/