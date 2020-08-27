//MongoDB schema for non-relational DB

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/airbnb');

//Schema for room information.
let roomSchema = mongoose.Schema({
  roomId: {
    type: Number,
    unique: true
  },
  nightlyFee: Number,
  rating: mongoose.Decimal128,
  reviews: Number,
  minimumStay: Number,
  maximumGuest: Number,
  bookedDate: [{
    reservationId: Number,
    date: Date,
  }]
});

//stores review information for rooms.  Record count and average score should be calculated from this data and saved to the relevant room ID in the roomSchema
let reviewSchema = mongoose.Schema({
  roomId: Number,
  userId: Number,
  score: Number
});

let reservationSchema = mongoose.Schema({
  reservationId: {
    type: Number,
    unique: true
  },
  userId: Number,
  numAdults: Number,
  numChildren: Number,
  numInfants: Number
})