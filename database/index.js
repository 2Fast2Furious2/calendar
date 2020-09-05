//database index.js file using Postgres interface

const { Client } = require('pg');
const client = new Client();
const pool = require('./postgres_login.js');