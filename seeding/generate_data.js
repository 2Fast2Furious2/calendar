//seeding script for database testing of a calendar app
//should generate a set of files that can be used in multiple dbs to generate data

const fs = require('fs');
const stream = require('stream');
const moment = require('moment');

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
const reservationDateRange = 365;
const avgOccupancy = 0.33;

//pregenerated random number array and counter that will be used in place of a Math.random value to improve performance
const randomArray = [];
let counter = 0;
const counterMax = 1000;

//array containers for test data: should be written to a file after processing is complete
const roomArray = [];


//function declarations

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
function saveFile(data, fileName) {

  let filepath = ('./output/').concat(fileName);
  console.log('Writing data to ' + filepath);

  const writeStream = fs.createWriteStream(filepath);

  const writeToFile = function(record) {
    if(!writeStream.write(`${JSON.stringify(record)}\n`)) {
      writeStream.once('drain',() => {writeToFile(record)});
    }
  }

  data.forEach(record => {

    //writeStream.write(`${JSON.stringify(record)}\n`);
    writeToFile(record);

  });

  writeStream.on('finish', () => {
    console.log(`Data written to ${filepath}`);
  });

  writeStream.on('error', (err) => {
    console.error(`There is an error writing the file ${pathName} => ${err}`)
  });

  writeStream.end();
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

  for(let i = 0; i < maxRooms; i++) {


    let roomId = i;
    let maxGuests = guestCountOptions[Math.floor(randomNumber() * guestCountOptions.length)];
    let minReservation = reservationOptions[Math.floor(randomNumber() * reservationOptions.length)];
    let nightlyFee = nightlyFeeOptions[Math.floor(randomNumber() * nightlyFeeOptions.length)]; //TBD
    let cleaningFee = cleaningFeeOptions[Math.floor(randomNumber() * cleaningFeeOptions.length)]; //TBD
    let serviceFee = serviceFeeRange[Math.floor(randomNumber() * serviceFeeRange.length)]; //TBD;

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
console.log("Generating room data...");
generateRooms(2000000);
saveFile(roomArray, 'room_data.txt');

//console log testing
//console.log(roomArray);
//console.log(randomArray);
//console.log(randomNumber());
//console.log(randomNumber());