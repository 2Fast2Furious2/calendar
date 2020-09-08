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
  pool.query(`select rooms.room_id, reviews, rating, minimum_stay, maximum_guest, cleaning_fee, service_fee, start_date, end_date from rooms, reservation_info where rooms.room_id = reservation_info.room_id and rooms.room_id = ${roomId} order by reservation_info.start_date`, (err, res) => {
    if(err) {
      console.log(err);
      callback(err);
    } else {
      //console.log(res.rows);
      callback(null,res.rows);
    }
  });
}

//test function
var test = function(callback) {
  pool.query('select rooms.room_id, reviews, rating, minimum_stay, maximum_guest, cleaning_fee, service_fee, start_date, end_date from rooms, reservation_info where rooms.room_id = reservation_info.room_id and rooms.room_id = 1 limit 1', (err, res) => {
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