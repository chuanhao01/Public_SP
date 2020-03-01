// This file is for all the API end points required in the BED CA1 Assignment 2019
// In this file there might be some repeats from the other files

/*
Name: Lim CHuan Hao
Class: DIT/FT/1B/11
Admin number: 19222764
*/

// Importing other libs I need to use
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 13;

// Exported object
const assignmentDB = {
    init(pool){
        this.pool = pool;
    },
    // Q1 GET /users`
    getUsers(){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            SELECT * FROM USERS
            WHERE deleted = 0
            `, function(err, data){
                if(err){
                    reject(err);
                }
                else{
                    resolve(data);
                }
            });
        });
    },
    // Q2 POST /users
    postUsers(avatar_icon_file_name, username, password){
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
                    `, [user_id, username, password_hash, avatar_icon_file_name, refresh_token, 0], function(err){
                        if(err){
                            // If there are any MySQL errors
                            reject(err);
                        }
                        else{
                            // User is successfully created
                            resolve(user_id);
                        }
                    });
                });
            }.bind(this)
        );
    },
    // Q3 GET /users/:id
    getUsersId(user_id){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            SELECT * FROM USERS
            WHERE ((user_id = ?) AND (deleted = 0))
            `, [user_id], function(err, data){
                if(err || data.length === 0){
                    reject('MySQL error');
                }
                else{
                    resolve(data[0]);
                }
            });
        });
    },
    // Q4 PUT /users/:id
    putUserId(avatar_icon_file_name, username, password, user_id){
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
                return this.getUsersId(user_id);
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
                    WHERE ((user_id = ?) AND (deleted = 0))
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
    // Q5 GET /users/:user_id/listings
    getUsersIdListings(user_id){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            SELECT * FROM LISTINGS
            WHERE ((listing_user_id = ?) AND (deleted = 0))
            `, [user_id], function(err, data){
                if(err){
                    reject(err);
                }
                else{
                    resolve(data);
                }
            });
        });
    },
    // Q6 GET /listings
    getListings(){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            SELECT * FROM LISTINGS
            WHERE deleted = 0
            `, function(err, data){
                if(err){
                    reject(err);
                }
                else{
                    resolve(data);
                }
            });
        });
    },
    // Q7 GET /listings/:listing_id
    getListingId(listing_id){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            SELECT * FROM LISTINGS
            WHERE ((listing_id = ?) AND (deleted = 0))
            `, [listing_id], function(err, data){
                if(err || data.length === 0){
                    // If there was a MySQL error or if no listings were returned
                    reject('Error in retrieving listing');
                }
                else{
                    resolve(data[0]);
                }
            });
        });
    },
    // Q8 POST /listings
    postListings(title, description, price, listing_user_id){
        return new Promise((resolve, reject) => {
            // Generating the listing_id
            const listing_id = uuid();
            // Here availability and delted defaults to 0
            // Mapping of values can be seen in the markdown
            this.pool.query(`
            INSERT INTO LISTINGS
            (listing_id, title, description, price, listing_user_id, availability, deleted)
            VALUES
            (?, ?, ?, ?, ?, ?, ?)           
            `, [listing_id, title, description, price, listing_user_id, 0, 0], function(err){
                if(err){
                    reject(err);
                }
                else{
                    resolve(listing_id);
                }
            });
        });
    },
    // Q9 DELETE /listings/:listing_id
    deleteListings(listing_id){
        return new Promise((resolve, reject) => {
            // Deletes the likes linked to the listing_id
            this.pool.query(`
            UPDATE LIKES
            SET deleted = 1
            WHERE ((listing_id = ?) AND (deleted = 0))
            `, [listing_id], function(err, data){
                if(err){
                    reject(err);
                }
                else{
                    resolve(data);
                }
            });
        })
        .then(
            function(){
                // Delete the offers linked to the listing_id
                return new Promise((resolve, reject) => {
                    this.pool.query(`
                    UPDATE OFFERS
                    SET deleted = 1
                    WHERE ((listing_id = ?) AND (deleted = 0))
                    `, [listing_id], function(err, data){
                        if(err){
                            reject(err);
                        }
                        else{
                            resolve(data);
                        }
                    });
                });
            }.bind(this)
        )
        .then(
            function(){
                // Delete the listing pictures
                return new Promise((resolve, reject) => {
                    this.pool.query(`
                    UPDATE LISTING_PICTURES
                    SET deleted = 1
                    WHERE ((listing_id = ?) AND (deleted = 0))  
                    `, [listing_id], function(err, data){
                        if(err){
                            reject(err);
                        }
                        else{
                            resolve(data);
                        }
                    });
                });
            }.bind(this)
        )
        .then(
            function(){
                // Deletes the listing
                return new Promise((resolve, reject) => {
                    this.pool.query(`
                    UPDATE LISTINGS
                    SET deleted = 1
                    WHERE ((listing_id = ?) AND (deleted = 0)) 
                    `, [listing_id], function(err, data){
                        if(err){
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
    // Q10 PUT /listings/:id
    putListings(listing_id, title, description, price, listing_user_id){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            UPDATE LISTINGS
            SET title = ?, description = ?, price = ?, listing_user_id = ?
            WHERE ((listing_id = ?) AND (deleted = 0))
            `, [title, description, price, listing_user_id, listing_id], function(err, data){
                if(err){
                    reject(err);
                }
                else{
                    resolve(data);
                }
            });
        });
    },
    // Q11 GET /listings/:id/offers
    getListingsIdOffers(listing_id){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            SELECT * FROM OFFERS
            WHERE ((listing_id = ?) AND (deleted = 0))
            `, [listing_id], function(err, data){
                if(err){
                    reject(err);
                }
                else{
                    resolve(data);
                }
            });
        });
    },
    // Q12 POST /listing/:id/offers
    postListingsIdOffers(listing_id, offer_user_id, offer_price){
        return new Promise((resolve, reject) =>{
            const offer_id = uuid();
            this.pool.query(`
            INSERT INTO OFFERS
            (offer_id, listing_id, offer_user_id, offer_price, status, deleted)
            VALUES
            (?, ?, ?, ?, ?, ?)
            `, [offer_id, listing_id, offer_user_id, offer_price, 0, 0], function(err, data){
                if(err){
                    reject(err);
                }
                else{
                    resolve(offer_id);
                }
            });
        });       
    }
};

module.exports = assignmentDB;