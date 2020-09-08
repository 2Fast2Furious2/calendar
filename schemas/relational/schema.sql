/*schema file for Postgresql*/

\c airbnb;

/*drop schema airbnb_schema cascade;*/

/*create schema airbnb_schema;*/

drop table if exists rooms cascade;

drop table if exists reservations cascade;

drop table if exists reservation_info cascade;

drop table if exists reviews cascade;

create table rooms (
  room_id integer PRIMARY KEY,
  nightly_fee integer NOT NULL,
  reviews integer DEFAULT 0,
  rating decimal(3,2) DEFAULT 0,
  minimum_stay integer DEFAULT 1,
  maximum_guest integer DEFAULT 1,
  cleaning_fee integer,
  service_fee decimal(3,2)
);

/*will match original schema: i.e. one record for each day of a stay*/
create table reservations (
  room_id integer NOT NULL,
  reservation_id integer,
  booked_date date NOT NULL
);

create table reservation_info (
  room_id integer NOT NULL,
  user_id integer NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  num_adults integer NOT NULL,
  num_children integer NOT NULL,
  num_infants integer NOT NULL
);

create table reviews (
  room_id integer NOT NULL,
  user_id integer NOT NULL,
  score integer NOT NULL
);