/*schema file for Postgresql*/

create table rooms (
  room_id integer PRIMARY KEY,
  nightly_fee integer NOT NULL,
  reviews integer DEFAULT 0,
  rating decimal(3,2) DEFAULT 0,
  minimum_stay integer DEFAULT 1,
  maximum_guest integer DEFAULT 1
);

/*will match original schema: i.e. one record for each day of a stay*/
create table reservations (
  room_id integer references rooms(room_id),
  reservation_id integer references reservation_info(reservation_id),
  booked_date date NOT NULL
);

create table reservation_info (
  reservation_id integer PRIMARY KEY,
  room_id references rooms(room_id),
  user_id integer NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  num_adults integer NOT NULL,
  num_children integer NOT NULL,
  num_infants integer NOT NULL
);

create table reviews (
  room_id integer references rooms(room_id),
  user_id integer NOT NULL,
  score integer NOT NULL
);