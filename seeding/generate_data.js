//seeding script for database testing of a calendar app
//should generate a set of files that can be used in multiple dbs to generate data

'use strict';

const fs = require('fs');
const stream = require('stream');
const moment = require('moment');
const util = require('util');
const heapdump = require('heapdump');

/*global variable declarations
Range global variables should specifiy a minimum/maximum value in a two record array unless otherwise specified.
*/
//rooms
const numRooms = 10000000;
const reservationRange = [1,3];
const maxGuestsRange = [1,8];
const nightlyFeeRange = [10,200];
const cleaningFeeRange = [10,100];
//unlike the above, serviceFeeRange should use a defined array of fees.  This is to avoid unexpected results with float math
const serviceFeeRange = [.10, .15, .20];

//reiew variables
const avgReviews = 50;
const reviewRange = [1,5];

//reservation variables: assume a year out with 1/3 occupancy
const reservationDateRange = 90;
const avgOccupancy = 0.33;
const maxReservationLength = 7;

//used to generate a random user ID
const numUsers = 8675309;

//pregenerated random number array and counter that will be used in place of a Math.random value to improve performance
const randomArray = [];
let counter = 0;
const counterMax = 1000;

//array containers for test data: should be written to a file after processing is complete
const roomArray = [];

//declarations for file limiters
const maxReviewsPerFile = 5000000;
const maxReservationsPerFile = 5000000;

/*----function declarations----*/

//test function to check memory use
function checkMemory() {
  const used = process.memoryUsage();
  for (let key in used) {
    console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
  }
}

/*---RANDOM NUMBER SCRIPTS: USE THESE IN PLACE OF MATH.RANDOM()---*/

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

/*---Save file script---*/

//data should be in an array format.  File will be saved to the ./output directory
//TBD: convert to csv file
function saveFile(data, fileName, callback) {
  let filepath = ('./output.tmp/').concat(fileName);
  console.log('Writing data to ' + filepath);

  const writeStream = fs.createWriteStream(filepath);
  //writeStream.setDefaultEncoding('ascii');

  const writeToFile = function(record) {
    if(!writeStream.write(record,'ascii')) {
      const onDrain = function() {
        writeStream.removeListener('drain', onDrain);
        writeToFile(record,'ascii');
      }
      writeStream.once('drain', onDrain);
    }
  }

  //CSV implementation: get headers from first record in the file, convert to a CSV string and push to file
  let headers = Object.keys(data[0]);
  let headerString = '';
  for(let i = 0; i < headers.length; i++) {
    headerString = headerString.concat(headers[i] +',');
  }
  headerString = headerString.substring(0, headerString.length-1);

  writeStream.write(headerString,'ascii');
  writeStream.write('\n','ascii');

  data.forEach(record => {
    let recordString = '';
    for(let i = 0; i < headers.length; i++) {
      recordString = recordString.concat(record[headers[i]]+',');
    }
    recordString = recordString.substring(0, recordString.length-1)+`\n`;
    //writeStream.write(`${JSON.stringify(record)}\n`);
    //writeToFile(record);
    writeToFile(recordString);
  });

  //TBD: remove logging data when troubleshooting is complete
  writeStream.on('finish', () => {
    let today = new Date();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.log(`Data written to ${filepath}, finished at ${time}`);
    console.log("Current drain listeners before removeAllListeners: " + writeStream.listenerCount('drain'));
    writeStream.removeAllListeners();
    console.log("Current drain listeners: " + writeStream.listenerCount('drain'));
    console.log("Current error listeners: " + writeStream.listenerCount('error'));
    console.log("Current finish listeners: " + writeStream.listenerCount('finish'));
    checkMemory();
    callback();
  });

  writeStream.on('error', (err) => {
    console.error(`There is an error writing the file ${pathName} => ${err}`)
  });

  writeStream.end();
  writeStream.close();
}

/*---Data generation scripts---*/

//generate a list of rooms and add them to the roomArray
function generateRooms(maxRooms) {
  //create arrays of possible values, based on global variable settings;
  let reservationOptions= [];
  let guestCountOptions = [];
  let nightlyFeeOptions = [];
  let cleaningFeeOptions = [];
  let serviceFeeOptions = [];

  for(let i = reservationRange[0]; i <= reservationRange[1]; i++) {
    reservationOptions.push(i);
  }

  for(let i = maxGuestsRange[0]; i <= maxGuestsRange[1]; i++) {
    guestCountOptions.push(i);
  }

  for(let i = nightlyFeeRange[0]; i <= nightlyFeeRange[1]; i++) {
    nightlyFeeOptions.push(i);
  }

  for(let i = cleaningFeeRange[0]; i <= cleaningFeeRange[1]; i++) {
    cleaningFeeOptions.push(i);
  }

  //RB: move review handling to main room data
  let reviewArray = [];
  let reviewCountVariation = Math.floor(avgReviews / 2);

  for(let i = 0; i < maxRooms; i++) {


    let roomId = i;
    let maxGuests = guestCountOptions[Math.floor(randomNumber() * guestCountOptions.length)];
    let minReservation = reservationOptions[Math.floor(randomNumber() * reservationOptions.length)];
    let nightlyFee = nightlyFeeOptions[Math.floor(randomNumber() * nightlyFeeOptions.length)];
    let cleaningFee = cleaningFeeOptions[Math.floor(randomNumber() * cleaningFeeOptions.length)];
    let serviceFee = serviceFeeRange[Math.floor(randomNumber() * serviceFeeRange.length)];
    //review data info
    let addOrSubtract = (randomNumber() < 0.5) ? 1 : - 1;
    let numReviews = avgReviews + (addOrSubtract *  Math.floor(reviewCountVariation * randomNumber()));
    let averageScore = Math.min(Math.max((randomNumber() * 5 + 1).toPrecision(3),1), 5);

    roomArray.push({
      'roomId': roomId,
      'maxGuests': maxGuests,
      'minReservation': minReservation,
      'nightlyFee': nightlyFee,
      'cleaningFee': cleaningFee,
      'serviceFee': serviceFee,
      'reviews': numReviews,
      'rating': averageScore
    });
  }
  console.log(`${roomArray.length} room records created.`);
}

//generates a list of reviews for the rooms in roomArray.
//Should be run only after generateRooms() is complete and room data is written to file.
function generateReviews(start=0, end=numRooms) {

  //generate list of possible scores and max variation in number of reviews.
  let reviewArray = [];
  let reviewCountVariation = Math.floor(avgReviews / 2);
  let reviewScoreOptions = [];

  for(let i = reviewRange[0]; i <= reviewRange[1]; i++) {
    reviewScoreOptions.push(i);
  }

  for(let i = start; i < end; i++) {
    //determine the number of reviews for each room, and apply a random weighting to each room's score.
    let addOrSubtract = (randomNumber() < 0.5) ? 1 : - 1;
    let numReviews = avgReviews + (addOrSubtract *  Math.floor(reviewCountVariation * randomNumber()));
    let weighting = Math.floor(3 * randomNumber());

    for(let j = 0; j < numReviews; j++) {
      let roomId = i;
      let userId = Math.floor(numUsers * randomNumber());
      let score = weighting + reviewScoreOptions[Math.floor(randomNumber() * reviewScoreOptions.length)];
      let reviewScore = Math.min(Math.max(score, 1), 5);

      reviewArray.push({
        'roomId': roomId,
        'userId': userId,
        'reviewScore': reviewScore
      });
    }
  }

  console.log("Review data generated with record count: " + reviewArray.length);
  return reviewArray;
}

//generate and return an array of reservations, beginning from the date the function is run
function generateReservations(start=0, end=numRooms) {
  let reservationArray = [];
  let daysPerRoom = Math.floor(reservationDateRange * avgOccupancy);
  let startDate = new Date(moment());
  let endDate = new Date(moment().add(reservationDateRange,'days'));

  //handle situation where end passed ot file is greater than max number of rooms
  let boundedEnd = end;
  if(end > numRooms) {
    boundedEnd = numRooms;
  }

  //console.log(daysPerRoom);
  for(let i = start; i < boundedEnd; i++) {
    let remainingDays = daysPerRoom;
    let currentDate = startDate;

    while(remainingDays > 0) {
      let daysToSkip = Math.floor(randomNumber() * 3);
      let reservationLength = Math.floor(randomNumber() * maxReservationLength) + 1;
      remainingDays = remainingDays - reservationLength;

      currentDate = moment(currentDate).add(daysToSkip,'days');
      let reservationStartDate = currentDate;
      let reservationEndDate = moment(currentDate).add(reservationLength,'days');
      currentDate = reservationEndDate;
      //console.log(`Reservation from ${reservationStartDate} to ${reservationEndDate}`);
      let roomId = i;
      let userId = Math.floor(numUsers * randomNumber());
      let numAdults = Math.floor(randomNumber() * 2) + 1;
      let numChildren = Math.floor(randomNumber() * 3);
      let numInfants = Math.floor(randomNumber() * 2);

      reservationArray.push({
        "roomId": roomId,
        "userId": userId,
        "startDate": reservationStartDate.format(),
        "endDate": reservationEndDate.format(),
        "numAdults": numAdults,
        "numChildren": numChildren,
        "numInfants": numInfants
      });
    }
  }
  console.log("Reservation data generated with record count: " + reservationArray.length);
  return reservationArray;
}

//file generation starts here

//Save the room data, then runs the next step via the callback argument in saveFile
function saveRooms(callback) {
  console.log("Generating room data...");
  generateRooms(numRooms);
  saveFile(roomArray, 'room_data.csv', callback);
}

//generate review data.  Split into multiple files as needed.
function saveReviews(){
  console.log("Generating review data...");

  //split review generation into chunks to try and get around memory pressure issues
  let numReviewFiles = Math.ceil((numRooms * avgReviews) / maxReviewsPerFile);
  let reviewChunk = numRooms / numReviewFiles;
  console.log(numReviewFiles);
  console.log(reviewChunk);

  //TBD: create a chain of functions that generate review records and then
  const reviewCallback = function(i) {
    console.log("Starting review file " + i);
    let start = reviewChunk * (i-1);
    let end = reviewChunk * i;
    let reviewArray = generateReviews(start,end);
    if(i < numReviewFiles) {
      saveFile(reviewArray, `review_data_${i}.csv`, ()=>{reviewCallback(i+1)});
    } else {
      saveFile(reviewArray, `review_data_${i}.csv`, saveReservations);
    }
  }

  reviewCallback(1);
}

//TBD: generate and save reservation information
function saveReservations() {
  console.log("Generating reservation data...");
  //Assume average reservation length is Math.ceil(maxReservationLength / 2)
  let numReservationFiles = Math.ceil((numRooms * (Math.floor(reservationDateRange * avgOccupancy / Math.ceil(maxReservationLength / 2)))) /maxReservationsPerFile);
  let reservationChunk = Math.ceil(numRooms / numReservationFiles);
  console.log(`For ${numRooms} rooms there will be ${numReservationFiles} files of ${reservationChunk} reservations each.`);

  const reservationCallback = function(i) {
    console.log("Starting reservation file " + i);
    let start = reservationChunk * (i-1);
    let end = reservationChunk * i;
    let reservationArray = generateReservations(start,end);
    if(i < numReservationFiles) {
      saveFile(reservationArray, `reservation_data_${i}.csv`, ()=>{reservationCallback(i+1)});
    } else {
      saveFile(reservationArray, `reservation_data_${i}.csv`, cleanup);
    }
  }

  reservationCallback(1);
}

function cleanup() {
  let scriptEndDate = new Date();
  let scriptEndTime = scriptEndDate.getHours() + ":" + scriptEndDate.getMinutes() + ":" + scriptEndDate.getSeconds();
  console.log("All files generated: please check output folder and verify data.");
  console.log(`Seeding script ended at ${scriptEndTime}`);
  console.log("***********************************************************************");
}

/*----Start processing here----*/
generateRandomArray();
let scriptStartDate = new Date();
let scriptStartTime = scriptStartDate.getHours() + ":" + scriptStartDate.getMinutes() + ":" + scriptStartDate.getSeconds();
console.log("***********************************************************************");
console.log(`Seeding script started at ${scriptStartTime}`);
saveRooms(saveReservations);