//seeding script for database testing of a calendar app
//should generate a set of files that can be used in multiple dbs to generate data

const fs = require('fs');

/*global variable declarations
numRooms: number of room records.
*/
const numRooms = 10000000;

//reiew variables
const avgReviews: 50;
const reviewRange: [1,5];