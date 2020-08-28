//seeding script for database testing of a calendar app
//should generate a set of files that can be used in multiple dbs to generate data

const fs = require('fs');
const moment = require('moment');

/*global variable declarations
Rooms: controls record of numbef of rooms, range of minimum days for a reservation, and range of maximum number of guests
Reviews: controls the average number of reviews for a given room, and the review score range as an integer array with [min,max]
Reservations: controls the average number of reservations for a given room
*/
//rooms
const numRooms = 10000000;
const reservationRange = [1,5];
const maxGuestsRange = [1,8];
const nightlyFeeRange = [10,200];
const cleaningFeeRange = [10,100];
const serviceFeeRange = [.10, .20];

//reiew variables
const avgReviews = 50;
const reviewRange = [1,5];

//reservation variables: assume a year out with 1/3 occupancy
const reservationDateRange = 365;
const avgOccupancy = 0.33;

//pregenerated random number array and counter that will be used in place of a Math.random value to improve performance
const randomArray = [];
let counter = 0;
const counterMax = 1000;

//array containers for test data: should be written to a file after processing is complete
const roomArray = [];


//functions

//generate a preset array of random numbers
function generateRandomArray() {
  for(let i = 0; i < counterMax; i++) {
    randomArray.push(Math.random());
  }
}

//get a number from the randomArray, based on the current counter value
function randomNumber() {
  let rng = randomArray[counter];
  counter = (counter + 1) % counterMax;
  return rng;
}


//generate a list of rooms and add them to the roomArray
function generateRooms(maxRooms) {
  for(let i = 0; i < maxRooms; i++) {


    let roomId = i;
    let maxGuests = 0; //TBD
    let minReservation = 0; //TBD
    let nightlyFee = 0; //TBD
    let cleaningFee = 0; //TBD
    let serviceFee = 0; //TBD;

    roomArray.push({
      'roomId': roomId,
      'maxGuests': maxGuests,
      'minReservation': minReservation,
      'nightlyFee': nightlyFee,
      'cleaningFee': cleaningFee,
      'serviceFee': serviceFee
    });
  }
}

//Random file generation starts here

//seed random number database
generateRandomArray();


//console log testing
generateRooms(10);
console.log(roomArray);
//console.log(randomArray);
console.log(randomNumber());
console.log(randomNumber());