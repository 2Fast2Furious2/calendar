//database index.js file using Postgres interface

const { Client, Pool } = require('pg');
const client = new Client();
const credentials = require('./postgres_login.js');
//const pool = new Pool(credentials);

const pool = new Pool({
  user: credentials.user,
  host: credentials.host,
  database: credentials.database,
  password: credentials.password,
  port: credentials.port
});

var getReservationsByRoom = function(roomId, callback) {
  pool.query(`select rooms.room_id, nightly_fee, reviews, rating, minimum_stay, maximum_guest, cleaning_fee, service_fee, start_date, end_date from rooms, reservation_info where rooms.room_id = reservation_info.room_id and rooms.room_id = ${roomId} order by reservation_info.start_date`, (err, res) => {
    if(err) {
      console.log(err);
      callback(err);
    } else {
      //console.log(res.rows);
      callback(null,res.rows);
    }
  });
}

// room_id
// user_id
// start_date
// end_date
// num_adults
// num_children
// num_infants
//note: function will generate a random userId and number of guests (adults, children, infants), as this functionality is not supported by the front end client.
var createNewReservation = function(roomId, startDate, endDate, callback) {
  let userId = Math.floor(Math.random() * 10000000);
  let numAdults = Math.floor(Math.random()*2) + 1;
  let numChildren = Math.floor(Math.random()*3);
  let numInfants = Math.floor(Math.random() * 2);

  pool.connect()
  .then(client => {
    return client
      .query(`insert into reservation_info values(${roomId}, ${userId}, '${startDate}', '${endDate}', ${numAdults},${numChildren},${numInfants})`)
      .then(res => {
        client.release()
        callback(null, 'Reservation submitted');
      })
      .catch(err => {
        client.release()
        callback(err);
      })
  })
};

//test function
var test = function(callback) {
  pool.query('select rooms.room_id, nightly_fee, reviews, rating, minimum_stay, maximum_guest, cleaning_fee, service_fee, start_date, end_date from rooms, reservation_info where rooms.room_id = reservation_info.room_id and rooms.room_id = 1 limit 1', (err, res) => {
    if(err) {
      console.log(err);
      callback(err);
    } else {
      console.log(res.rows);
      callback(null,res.rows);
    }
  });
}

module.exports.test = test;
module.exports.getReservationsByRoom = getReservationsByRoom;
module.exports.createNewReservation = createNewReservation;