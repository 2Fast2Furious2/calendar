const mysql = require('mysql');
const mysqlConfig = require('./config.js');

// For local host
// module.exports.connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : mysqlConfig.mysqlUser,
//   password : mysqlConfig.mysqlPW,
//   database : 'calendar'
// });

// For docker network
module.exports.connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  database : 'calendar',
});