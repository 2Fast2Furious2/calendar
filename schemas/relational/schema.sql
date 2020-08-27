/*schema file for Postgresql*/

/*TBD: define table keys, constraints*/

create table rooms (
  room_id integer,
  nightly_fee integer,
  rating decimal(3,2),
  minimum_stay integer,
  maximum_guest integer,

);

create table reservations (
    room_id integer,
  reservation_id integer,
  booked_date date,
);

create table reservation_info (
  reservation_id integer,
  user_id integer,
  start_date date,
  end_date date,
  num_adults integer,
  num_children integer,
  num_infants integer
);

create table reviews (
  user_id integer,
  room_id integer,
  score integer
);