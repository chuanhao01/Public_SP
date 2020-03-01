// This file is for all the API end points required in the BED CA1 Assignment 2019
// In this file there might be some repeats from the other files

/*
Name: Lim CHuan Hao
Class: DIT/FT/1B/11
Admin number: 19222764
*/

// Importing other libs
const path = require('path');
const multer = require('multer');
const upload = multer({
    // Setting the destination where the avatar icons are stored
    dest: 'uploads/avatarIcons/',
    limits: {
        // 1MB limit for file upload
        fileSize: 1000000,
    },
    // Custom file filter function, only accepting file with image extensions
    // Throws a custom error if there is one
    fileFilter(req, file, cb){
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            let err = new Error('File extension of uploaded file is wrong');
            err.code = 'FILE_EXT';
            return cb(err);
        }
        return cb(null, true);
    }
}).single('avatar_icon');

// Importing dataAccess for db access
const dataAccess = require('../../db/index');
const utils = require('../../utils/index');

const assignmentAPIController= {
    init(app){
        // Q1 GET /users`
        app.get('/users', function(req, res){
            new Promise((resolve) => {
                resolve(
                    dataAccess.assignment.getUsers()
                    .catch(
                        function(err){
                            if(err){
                                res.status(500).send({
                                    'Condition': 'Unknown error',
                                    'Code': '500 Internal Server Error'
                                });
                            }
                            throw 'GETUSERS_DB_ERR';
                        }
                    )
                );
            })
            .then(
                function(users){
                    res.status(200).send(users);
                }
            )
            .catch(
                function(err){
                    console.log('Final catch err: ' + err);
                }
            );
        });
        // Q2 POST /users
        app.post('/users', function(req, res){
            upload(req, res, function(err){
                // Check if any of the fields are empty
                if(utils.validation.checkEmpty(req.body)){
                    res.status(500).send({
                        'Condition': 'Unknown error',
                        'Code': '500 Internal Server Error'
                    });
                    return;
                }
                // Cataching errors in the file uploaded
                if(err){
                    res.status(500).send({
                        'Condition': 'Unknown error',
                        'Code': '500 Internal Server Error'
                    });
                    return;
                }
                else{
                    if(req.file === undefined){
                        // Check if file was not empty
                        res.status(500).send({
                            'Condition': 'Unknown error',
                            'Code': '500 Internal Server Error'
                        });
                        return;
                    }
                    else{
                        // If there is no error in uploading the file
                        // Creating the new user now
                        new Promise((resolve) => {
                            resolve(
                                dataAccess.assignment.postUsers(req.file.filename, req.body.username, req.body.password)
                                .catch(
                                    function(err){
                                        console.log(err);
                                        res.status(500).send({
                                            'Condition': 'Unknown error',
                                            'Code': '500 Internal Server Error'
                                        });
                                        throw 'POSTUSERS_DB_ERR';
                                    }
                                )
                            );
                        })
                        .then(
                            function(user_id){
                                // If creating a user is successful
                                res.status(201).send({
                                    'user_id': user_id
                                });
                            }
                        )
                        .catch(
                            function(err){
                                console.log('Final catch err: ' + err);
                            }
                        );
                    }
                }
            });
        });
        // Q3 GET /users/:id
        app.get('/users/:id', function(req, res){
            const user_id = req.params.id;
            new Promise((resolve) => {
                resolve(
                    dataAccess.assignment.getUsersId(user_id)
                    .catch(
                        function(err){
                            if(err){
                                res.status(500).send({
                                    'Condition': 'Unknown error',
                                    'Code': '500 Internal Server Error'
                                });
                            }
                            throw 'GETUSERSID_DB_ERR';
                        }
                    )
                );
            })
            .then(
                function(user){
                    // Got the user
                    res.status(200).send(user);
                }
            )
            .catch(
                function(err){
                    console.log('Final catch err: ' + err);
                }
            );
        });
        // Q4 PUT /users/:id
        app.put('/users/:id', function(req, res){
            const user_id = req.params.id;
            upload(req, res, function(err){
                // Check if req.body is empty
                if(utils.validation.checkEmpty(req.body)){
                    res.status(500).send({
                        'Condition': 'Unknown error',
                        'Code': '500 Internal Server Error'
                    });
                    return;
                }
                // Cataching errors in the file uploaded
                if(err){
                    res.status(500).send({
                        'Condition': 'Unknown error',
                        'Code': '500 Internal Server Error'
                    });
                    return;
                }
                else{
                    if(req.file === undefined){
                        // Check if file was not empty
                        res.status(500).send({
                            'Condition': 'Unknown error',
                            'Code': '500 Internal Server Error'
                        });
                        return;
                    }
                    else{
                        // If there is no error in uploading the file
                        // Try to update the user
                        new Promise((resolve) => {
                            resolve(
                                dataAccess.assignment.putUserId(req.file.filename, req.body.username, req.body.password, user_id)
                                .catch(
                                    function(err){
                                        console.log(err);
                                        if(err.code === 'USERNAME_TAKEN'){
                                            // If the user alr exists and there is this error
                                            res.status(422).send({
                                                'Condition': 'The new username provided already exists.',
                                                'Code': '422 Unprocessable Entity'
                                            });
                                        }
                                        else{
                                            // Any other error
                                            res.status(500).send({
                                                'Condition': 'Unknown error',
                                                'Code': '500 Internal Server Error'
                                            });
                                        }
                                        throw 'PUTUSERSID_DB_ERR';
                                    }
                                )
                            );
                        })
                        .then(
                            function(){
                                // If the update is successful
                                res.status(204).send();
                            }
                        )
                        .catch(
                            function(err){
                                console.log('Final catch err: ' + err);
                            }
                        );
                    }
                }
            });
        });
        // Q5 GET /users/:user_id/listings
        app.get('/users/:user_id/listings', function(req, res){
            new Promise((resolve) => {
                resolve(
                    dataAccess.assignment.getUsersIdListings(req.params.user_id)
                    .catch(
                        function(err){
                            // If there were any errors getting the listings
                            console.log(err);
                            res.status(500).send({
                                'Condition': 'Unknown error',
                                'Code': '500 Internal Server Error'
                            });
                            throw 'GETUSERSIDLISTINGS_DB_ERR';
                        }
                    )
                );
            })
            .then(
                function(data){
                    // If the MySQL query was successful
                    res.status(200).send(data);
                }
            )
            .catch(
                function(err){
                    // Final catch for all errors
                    console.log('Final catch err: ' + err);
                }
            );
        });
        // Q6 GET /listings
        app.get('/listings', function(req, res){
            new Promise((resolve) => {
                resolve(
                    dataAccess.assignment.getListings()
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(500).send({
                                'Condition': 'Unknown error',
                                'Code': '500 Internal Server Error'
                            });
                            throw 'GETLISTINGS_DB_ERR';
                        }
                    )
                );
            })
            .then(
                function(data){
                    // If the MySQL query was successful
                    res.status(200).send(data);
                }
            )
            .catch(
                function(err){
                    // Final catch for all errors
                    console.log('Final catch err: ' + err);
                }
            );
        });
        // Q7 GET /listings/:listing_id
        app.get('/listings/:listing_id', function(req, res){
            new Promise((resolve) => {
                resolve(
                    dataAccess.assignment.getListingId(req.params.listing_id)
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(500).send({
                                'Condition': 'Unknown error',
                                'Code': '500 Internal Server Error'
                            });
                            throw 'GETLISTINGID_DB_ERR';
                        }
                    )
                );
            })
            .then(
                function(data){
                    // If the MySQL query was successful
                    res.status(200).send(data);
                }
            )
            .catch(
                function(err){
                    // Final catch for all errors
                    console.log('Final catch err: ' + err);
                }
            );
        });
        // Q8 POST /listings
        app.post('/listings', function(req, res){
            if(utils.validation.checkEmpty(req.body)){
                // If any of the fields are empty
                res.status(500).send({
                    'Condition': 'Unknown error',
                    'Code': '500 Internal Server Error'
                });
                return;
            }
            else{
                new Promise((resolve) => {
                    resolve(
                        dataAccess.assignment.postListings(req.body.title, req.body.description, req.body.price, req.body.listing_user_id)
                        .catch(
                            function(err){
                                console.log(err);
                                res.status(500).send({
                                    'Condition': 'Unknown error',
                                    'Code': '500 Internal Server Error'
                                });
                                throw 'POSTLISTINGID_DB_ERR';
                            }
                        )
                    );
                })
                .then(
                    function(listing_id){
                        // If the listing was successfully created 
                        res.status(201).send({
                            'listingID': listing_id
                        });
                    }
                )
                .catch(
                    function(err){
                        // Final catch for all errors
                        console.log('Final catch err: ' + err);
                    }
                );
            }
        });
        // Q9 DELETE /listings/:id
        app.delete('/listings/:id', function(req, res){
            const listing_id = req.params.id;
            new Promise((resolve) => {
                resolve(
                    dataAccess.assignment.deleteListings(listing_id)
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(500).send({
                                'Condition': 'Unknown error',
                                'Code': '500 Internal Server Error'
                            });
                            throw 'DELETELISTINGID_DB_ERR';
                        }
                    )
                );
            })
            .then(
                function(){
                    // If deleting the post was successful
                    res.status(204).send();
                }
            )
            .catch(
                function(err){
                    // Final catch for all errors
                    console.log('Final catch err: ' + err);
                }
            );
        });
        // Q10 PUT /listings/:id
        app.put('/listings/:id', function(req, res){
            const listing_id = req.params.id;
            if(utils.validation.checkEmpty(req.body)){
                res.status(500).send({
                    'Condition': 'Unknown error',
                    'Code': '500 Internal Server Error'
                });
                return;
            }
            else{
                new Promise((resolve) => {
                    resolve(
                        dataAccess.assignment.putListings(listing_id, req.body.title, req.body.description, req.body.price, req.body.listing_user_id)
                        .catch(
                            function(err){
                                console.log(err);
                                res.status(500).send({
                                    'Condition': 'Unknown error',
                                    'Code': '500 Internal Server Error'
                                });
                                throw 'PUTLISTINGID_DB_ERR';
                            }
                        )
                    );
                })
                .then(
                    function(){
                        // If the update was successful
                        res.status(204).send();
                    }
                )
                .catch(
                    function(err){
                        // Final catch for all errors
                        console.log('Final catch err: ' + err);
                    }
                );
            }
        });
        // Q11 GET /listings/:id/offers
        app.get('/listings/:id/offers', function(req, res){
            const listing_id = req.params.id;
            new Promise((resolve) => {
                resolve(
                    dataAccess.assignment.getListingsIdOffers(listing_id)
                    .catch(
                        function(err){
                           console.log(err);
                            res.status(500).send({
                                'Condition': 'Unknown error',
                                'Code': '500 Internal Server Error'
                            });
                            throw 'GETLISTINGSIDOFFERS_DB_ERR';
                        }
                    )
                );
            })
            .then(
                function(offers){
                    // If there are no errors getting the offers
                    res.status(200).send(offers);
                }
            )
            .catch(
                function(err){
                    // Final catch for all errors
                    console.log('Final catch err: ' + err);
                }
            );
        });
        // Q12 POST /listing/:id/offers
        app.post('/listings/:id/offers', function(req, res){
            const listing_id = req.params.id;
            if(utils.validation.checkEmpty(req.body)){
                res.status(500).send({
                    'Condition': 'Unknown error',
                    'Code': '500 Internal Server Error'
                });
                return;
            }
            else{
                new Promise((resolve) => {
                    resolve(
                        dataAccess.assignment.postListingsIdOffers(listing_id, req.body.offer_user_id, req.body.offer_price)
                        .catch(
                            function(err){
                            console.log(err);
                                res.status(500).send({
                                    'Condition': 'Unknown error',
                                    'Code': '500 Internal Server Error'
                                });
                                throw 'POSTLISTINGSIDOFFERS_DB_ERR';
                            }
                        )
                    );
                })
                .then(
                    function(offer_id){
                        // If there are no errors in making an offer
                        res.status(201).send({
                            'offer_id': offer_id
                        });
                    }
                )
                .catch(
                    function(err){
                        // Final catch for all errors
                        console.log('Final catch err: ' + err);
                    }
                );
            }
        });
    }
};

module.exports = assignmentAPIController;
