/*
TODO:
1. Make sure during creation, no duplicate users
*/

// This db file contains:
// Actions pertaining to interacting with the USERS db or interacts with a 'user'

// Importing other libs I need to use
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 13;

const usersDB = {
    init(pool){
        this.pool = pool;
    },
    // Main function for actions in the db below
    createANewUser(avatar_icon_file_name, username, password){
        return new Promise((resolve, reject) => {
            // First part here is to generate password hash
            bcrypt.hash(password, SALT_ROUNDS, function(err, password_hash){
                if(err){
                    // If there are any bcrypt errors
                    reject(err);
                }
                else{
                    // If password_hash was successfully generated
                    resolve(password_hash);
                }
            });
        })
        .then(
            function(password_hash){
                return new Promise((resolve, reject) => {
                    // Here we will generate the jwt refresh token
                    const payload = {
                        'Result': 'This is a refresh token',
                    };
                    jwt.sign(payload, JWT_SECRET, {
                        algorithm: 'HS256',
                    }, function(err, token){
                        if(err){
                            // If there are any jwt errors
                            reject(err);
                        }
                        // If jwt refresh token was successfully generated
                        resolve([password_hash, token]);
                    });
                });
            }
        )
        .then(
            function([password_hash, refresh_token]){
                // Now here we are sending a query to the db to create the user
                // Deleted is given to be 0 on creation
                // uuid is also only created at the time for insert
                return new Promise((resolve, reject) => {
                    const user_id = uuid();
                    this.pool.query(`
                    INSERT INTO USERS
                    (user_id, username, password, avatar_icon_file_name, refresh_token, deleted)
                    values
                    (?, ?, ?, ?, ?, ?)
                    `, [user_id, username, password_hash, avatar_icon_file_name, refresh_token, 0], function(err, data){
                        if(err){
                            // If there are any MySQL errors
                            reject(err);
                        }
                        else{
                            // User is successfully created
                            resolve(data);
                        }
                    });
                });
            }.bind(this)
        );
    },
    // Get the user by the username from the db
    getUserByUsername(username){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            SELECT * FROM USERS
            WHERE ((username = ?) AND (deleted = 0))
            `, [username], function(err, data){
                if(err){
                    // If there is SQL errors
                    reject(err);
                }
                else{
                    resolve(data);
                }
            });
        });
    },
    // Get the user by its ID
    getUserByUserId(user_id){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            SELECT * FROM USERS
            WHERE ((user_id = ?) AND (deleted = 0)) 
            `, [user_id], function(err, data){
                if(err){
                    // If there is SQL errors
                    return reject(err);
                }
                else if(data.length === 0){
                    const err = new Error('User does not exist');
                    err.code = 'USER_NOT_EXIST';
                    return reject(err);
                }
                else{
                    return resolve(data[0]);
                }
            });
        });
    },
    getUserByRefreshToken(refresh_token){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            SELECT * FROM USERS
            WHERE ((refresh_token = ?) AND (deleted = 0))
            `, [refresh_token], function(err, data){
                if(err){
                    reject(err);
                }
                else if(data.length === 0){
                    const err = new Error('Invalid refresh token');
                    err.code = 'INVALID_TOKEN';
                    reject(err);
                }
                else{
                    resolve(data[0]);
                }
            });
        });
    },
    editUserProfile(user_id, username, password, avatar_icon_file_name){
        return new Promise((resolve, reject) => {
            // First check if any other users are using the username you are trying to change to
            this.pool.query(`
            SELECT * FROM USERS
            WHERE ((username = ?) AND (NOT(user_id = ?)) AND (deleted = 0)) 
            `, [username, user_id], function(err, data){
                if(err){
                    reject(err);
                }
                else if(data.length > 0){
                    const err = new Error('Username already exists');
                    err.code = 'USERNAME_TAKEN';
                    reject(err);
                }
                else{
                    resolve(data);
                }
            });

        })
        .then(
            function(){
                // If no one else is using the username
                // Get the user details
                return this.getUserByUserId(user_id);
            }.bind(this)
        )
        .then(
            function(user){
                // First part here is to generate password hash
                return new Promise((resolve, reject) => {
                    bcrypt.hash(password, SALT_ROUNDS, function(err, password_hash){
                        if(err){
                            // If there are any bcrypt errors
                            reject(err);
                        }
                        else{
                            // If password_hash was successfully generated
                            user.password_hash = password_hash;
                            resolve(user);
                        }
                    });
                });

            }
        )
        .then(
            function(user){
                // If getting the user is successful
                // Delete the user old avatar_icon
                return new Promise((resolve, reject) => {
                    const file_path = 'uploads/avatarIcons/' + user.avatar_icon_file_name;
                    fs.unlink(file_path, function(err){
                        if(err){
                            // Somehow the file is not deleted
                            reject(err);
                        }
                        else{
                            resolve(user);
                        }
                    });
                });
            }
        )
        .then(
            function(user){
                // If the previous file is deleted
                return new Promise((resolve, reject) => {
                    this.pool.query(`
                    UPDATE USERS
                    SET username = ?, password = ?, avatar_icon_file_name = ?
                    WHERE user_id = ?
                    `, [username, user.password_hash, avatar_icon_file_name, user_id], function(err, data){
                        if(err){
                            // If there was an error updateing
                            reject(err);
                        }
                        else{
                            resolve(data);
                        }
                    });
                });
            }.bind(this)
        );
    },
    checkPassword(password, password_hash){
        return new Promise((resolve, reject) => {
            // Compares the two values
            bcrypt.compare(password, password_hash, function(err, same){
                if(err){
                    return reject(err);
                }
                // If there are no errs, returns bool if they are the same
                return resolve(same);
            });
        });
    }
};

module.exports = usersDB;