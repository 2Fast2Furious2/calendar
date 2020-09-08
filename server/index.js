// Dependency
const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const path = require('path');
const expressStaticGzip = require("express-static-gzip");
const db = require('../database/index.js');

const app = express();
const PORT = 3002;
const publicPath = path.join(__dirname, '/../public');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/rooms/:room_id', expressStaticGzip(publicPath, {
  enableBrotli: true,
  orderPreference: ['br']
}));


//----*Postgres Routes*----//
//RB: route to test PostgresSQL connection
app.get('/test', (req,res) => {
  db.test(function(error,results) {
    res.send(results);
  });
});

app.get('/rooms/:room_id/reservation', (req, res) => {
  let roomId = [req.params.room_id];
  db.getReservationsByRoom(roomId, (err, results) => {
    if(err) {
      console.log("Failed to get data from databases: ", err);
      res.status(404).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

app.post('/rooms/:room_id/reservation', (req, res) => {
  let roomId = [req.params.room_id];
  let startDate = moment(req.body.check_in);
  let endDate = moment(req.body.check_out);

  db.createNewReservation(roomId,startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'), (err, results) => {
    if(err) {
      console.log("Failed to insert record: ", err);
      res.status(404).send(err);
    } else {
      res.status(202).send(results);
    }
  });
});


//----*NOTE: OLD ROUTES FOR MYSQL*----//
// Route
// GET request to '/rooms/:room_id/reservation' route
// app.get('/rooms/:room_id/reservation', (req, res) => {
//   console.log(req.params.room_id);
//   // declare query string
//   let queryString = 'SELECT rooms.nightly_fee, rooms.rating, rooms.reviews, rooms.minimum_stay, rooms.maximum_guest, reservations.id, reservations.booked_date FROM rooms, reservations WHERE rooms.id = ? AND rooms.id = reservations.room_id ORDER BY reservations.booked_date;';
//   // declare query params
//   let queryParams = [req.params.room_id];
//   // get all the informations and reservations of a specify room with the room_id from the endpoint
//   db.connection.query(queryString, queryParams, function(error, results, fields){
//     if (error) {
//       console.log("Failed to get data from databases: ", error);
//       res.status(404).send(error);
//     } else {
//       console.log("Succeed to get data from databases");
//       res.status(200).send(results);
//     }
//   });
// });

// POST request to '/rooms/:room_id/reservation' route
// app.post('/rooms/:room_id/reservation', (req, res) => {
//   // get the check_in date from request
//   let check_in = moment(req.body.check_in);
//   // get the check_out date from request
//   let check_out = moment(req.body.check_out);
//   // create a list of dates in YYYY-MM-DD format that started from the check_in date to the check_out date
//   let dates = [];
//   for (let i = check_in; i <= check_out; check_in.add(1, 'days')) {
//     dates.push(check_in.format('YYYY-MM-DD'));
//   }
//   // iterate over the dates array
//   for (let i = 0; i < dates.length; i++) {
//     // declare query string
//     let queryString = 'INSERT INTO reservations (room_id, booked_date) VALUES (?, ?)';
//     // declare query params
//     let queryParams = [req.params.room_id, dates[i]];
//     // insert current date into reservations table where room_id is equal to the room_id from the endpoint
//     db.connection.query(queryString, queryParams, (error, results, fields) => {
//       if (error) {
//         console.log(`Failed to insert data to reservations table where room id = ${req.params.room_id}: `, error);
//         res.status(404).send(error);
//       } else {
//         console.log(`Success to insert data to reservations table where room id = ${req.params.room_id}`);
//         res.status(200).send();
//       }
//     });
//   }
// });

// Start server
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
