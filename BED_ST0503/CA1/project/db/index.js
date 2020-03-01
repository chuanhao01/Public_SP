// This is the main file imported to get access to the mysql db, containing the db config setup
// The other files are specific functions to do an action on the db

// Setting up config and poolconnection
const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: process.env.MysqlUser,
    password: process.env.MysqlPassword,
    database: 'BED_CA1_Assignment',
    port: 3306
});

// Importing the other db interface in the folder
const usersDB = require('./usersDB');
const assignmentDB = require('./assignmentDB');
const listingsDB = require('./listingsDB');
const offersDB = require('./offersDB');
const likesDB = require('./likesDB');

usersDB.init(pool);
assignmentDB.init(pool);
listingsDB.init(pool);
offersDB.init(pool);
likesDB.init(pool);

// Setting up the main object to export to access the db
const dataAccess = {
    user: usersDB,
    assignment: assignmentDB,
    listing: listingsDB,
    offer: offersDB,
    like: likesDB
};

module.exports = dataAccess;