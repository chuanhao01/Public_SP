// This file contains controllers pertaining to:
// Anything that has to do with listings such as the CRUD of listings

// Importing other libs
const path = require('path');
const multer = require('multer');
const upload = multer({
    // Setting the destination where the avatar icons are stored
    dest: 'uploads/listingPictures/',
    limits: {
        // 1MB limit for file upload
        fileSize: 1000000,
    },
    // Custom file filter function, only accepting file with image extensions
    // Throws a custom error if there is one
    fileFilter(req, file, cb){
        var ext = path.extname(file.originalname);
        if(ext !== '.jpg') {
            let err = new Error('File extension of uploaded file is wrong');
            err.code = 'FILE_EXT';
            return cb(err);
        }
        return cb(null, true);
    }
}).single('listing_picture');

// Importing dataAccess object to interface with the DB
const dataAccess = require('../../db/index');
const utils = require('../../utils/index');

const listingAPIController = {
    init(app){
        const listing_picture_file_base_path = '/uploads/listingPictures/';
        // Affecting just listing, path /api/listing
        // Getting all the listing for a particular user
        app.get('/api/listing', function(req, res){
            new Promise((resolve) => {
                resolve(
                    dataAccess.listing.getUserListings(req.user.user_id)
                    .catch(
                        function(err){
                            // If there was any MySQL errors
                            console.log(err);
                            res.status(500).send({
                                'Error': 'MySQL error',
                                'error_code': 'MySQL_ERR'
                            });
                            throw 'MYSQL_ERR';
                        }
                    )
                );
            })
            .then(
                function(listings){
                    // Here there could be no listings, this will be dealt with on the front end
                    res.status(200).send({
                        'listings': listings
                    });
                }
            )
            .catch(
                function(err){
                    console.log('Final catch err: ' + err);
                }
            );
        });
        // Adding a listing
        app.post('/api/listing', function(req, res){
            if(utils.validation.checkEmpty(req.body)){
                // Checks if any of the fields are empty
                res.status(500).send({
                    'Error': 'Some fields are empty'
                });
            }
            else{
                new Promise((resolve) => {
                    resolve(
                        // Tries to create a new listing based on request
                        dataAccess.listing.createANewListing(req.body.title, req.body.description, req.body.price, req.user.user_id)
                        .catch(
                            function(err){
                                // If there is any MySQL errors
                                console.log(err);
                                res.status(500).send({
                                    'Error': 'MySQL error',
                                    'error_code': 'MySQL_ERR'
                                });
                                throw 'MySQL_ERR';
                            }
                        )
                    );
                })
                .then(
                    function(){
                        // If the listing is created 
                        res.status(201).send({
                            'Result': 'Listing successfully created'
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
        // Afftecting the listing by its id, /api/listing/:listing_id
        // Getting a listing by listing_id
        app.get('/api/listing/:listing_id', function(req, res){
            new Promise((resolve) => {
                resolve(
                    dataAccess.listing.getListingById(req.params.listing_id)
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(500).send({
                                'Error': 'MySQL_ERR',
                                'error_code': 'MySQL_ERR'
                            });
                            throw 'MySQL_ERR';
                        }
                    )
                );
            })
            .then(
                function(listing){
                    return new Promise((resolve, reject) => {
                        if(listing.length === 0){
                            // If listing is not found
                            const err = new Error('Listing not found');
                            err.code = 'LISTING_NOT_FOUND';
                            reject(err);
                        }
                        else{
                            resolve(listing[0]);
                        }
                    })
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(404).send({
                                'Error': 'Listing not found',
                                'error_code': 'MySQL_ERR'
                            });
                            throw err.code;
                        }
                    );
                }
            )
            .then(
                function(listing){
                    // If the listing is found
                    res.status(200).send({
                        'listing': listing
                    });
                }
            )
            .catch(
                function(err){
                    console.log('Final catch err: ' + err);
                }
            );
        });
        // Edit a listing
        app.put('/api/listing/:listing_id', function(req, res){
            if(utils.validation.checkEmpty(req.body)){
                // Checks if any of the fields are empty
                res.status(500).send({
                    'Error': 'Some fields are empty'
                });
            }
            else{
                new Promise((resolve) => {
                    resolve(
                        dataAccess.listing.checkIfUserListing(req.params.listing_id, req.user.user_id)
                        .catch(
                            function(err){
                                // If there are any MySQL errors
                                console.log(err);
                                res.status(500).send({
                                    'Error': 'MySQL Error',
                                    'error_code': 'MySQL_ERR'
                                });
                                throw 'MySQL_ERR';
                            }
                        )
                    );
                })
                .then(
                    function(user_listing_own){
                        // Here we check if the user sending the request own the listing
                        return new Promise((resolve, reject) =>{
                            if(user_listing_own){
                                // If he does own his own listing
                                // Then continue
                                resolve(true);
                            }
                            else{
                                // If they dont own the listing
                                const err = new Error('Listing does not belong to user');
                                err.code = 'USER_UNAUTH_LISTING';
                                reject(err);
                            }
                        })
                        .catch(
                            function(err){
                                console.log(err);
                                res.status(401).send({
                                    'Error': 'You cannot edit this listing',
                                    'error_code': 'USER_UNAUTH_LISTING'
                                });
                                throw err.code;
                            }
                        );
                    }
                )
                .then(
                    function(){
                        // If you can edit the listing
                        return dataAccess.listing.editUserListing(req.params.listing_id, req.body.title, req.body.description, req.body.price)
                        .catch(
                            function(err){
                                console.log(err);
                                res.status(500).send({
                                    'Error': 'MySQL Error',
                                    'error_code': 'MySQL_ERR'
                                });
                                throw 'MySQL_ERR';
                            }
                        );
                    }
                )
                .then(
                    function(){
                        // if update is successful
                        res.status(200).send({
                            'Result': 'Update successful'
                        });
                    }
                )
                .catch(
                    function(err){
                        console.log('Final catch err: ' + err);
                    }
                );
            }

        });
        // Deleting a listing
        app.delete('/api/listing/:listing_id', function(req, res){
            new Promise((resolve) => {
                resolve(
                    dataAccess.listing.checkIfUserListing(req.params.listing_id, req.user.user_id)
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(500).send({
                                'Error': 'MySQL Error',
                                'error_code': 'MySQL_ERR'
                            });
                            throw 'MySQL_ERR';
                        }
                    )
                );
            })
            .then(
                function(user_listing_own){
                    return new Promise((resolve, reject) =>{
                        if(user_listing_own){
                            // If the user does own the listing
                            resolve(true);
                        }
                        else{
                            const err = new Error('Listing does not belong to user');
                            err.code = 'USER_UNAUTH_LISTING';
                            reject(err);
                        }
                    })
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(401).send({
                                'Error': 'You cannot edit this listing',
                                'error_code': 'USER_UNAUTH_LISTING'
                            });
                            throw err.code;
                        }
                    );
                }
            )
            .then(
                function(){
                    return dataAccess.listing.deleteAListing(req.params.listing_id)
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(500).send({
                                'Error': 'MySQL Error',
                                'error_code': 'MySQL_ERR'
                            });
                            throw 'MySQL_ERR';
                        }
                    );
                }
            )
            .then(
                function(){
                    // If the listing was successfully deleted
                    res.status(200).send({
                        'Result': 'Listing was successfully deleted'
                    });
                }
            )
            .catch(
                function(err){
                    console.log('Final catch err: ' + err);
                }
            );
        });
        // Affecting the pictures tagged to a listing, /api/listing/pictures
        // Get the pictures for a listing by id, this is a query to db, thats why it is pictures
        app.get('/api/listing/pictures/:listing_id', function(req, res){
            return new Promise((resolve) => {
                resolve(
                    dataAccess.listing.getListingPicturesById(req.params.listing_id)
                    .catch(
                        function(err){
                            // If there was any MySQL errors
                            console.log(err);
                            res.status(500).send({
                                'Error': 'MySQL error',
                                'error_code': 'MySQL_ERR'
                            });
                            throw 'MYSQL_ERR';
                        }
                    )
                );
            })
            .then(
                function(listing_pictures){
                    // If getting the listing pictures were successful
                    res.status(200).send({
                        listing_pictures: listing_pictures
                    });
                }
            )
            .catch(
                function(err){
                    console.log('Final catch err: ' + err);
                }
            );
        });
        // Adding a picture to the listing
        app.post('/api/listing/pictures/:listing_id', function(req, res){
            upload(req, res, function(err){
                // Cataching errors in the file uploaded
                if(err){
                    // File extension is not an img
                    if(err.code === 'FILE_EXT'){
                        res.status(422).send({
                            'Error': 'Wrong file extension',
                            'error_code': err.code
                        });
                        return;
                    }
                    // File uploaded is too large
                    else if(err.code === 'LIMIT_FILE_SIZE'){
                        res.status(413).send({
                            'Error': 'File sent is too large',
                            'error_code': err.code
                        });
                        return;
                    }
                    else{
                        res.status(500).send({
                            'Error': 'Multer error',
                            'error_code': err.code
                        });
                        return;
                    }
                }
                else{
                    if(req.file === undefined){
                        // Check if file was not empty
                        res.status(500).send({
                            'Error': 'File is empty'
                        });
                        return;
                    }
                    else{
                        // If there is no error in uploading the file
                        // Try to add the picture
                        new Promise((resolve) => {
                            resolve(
                                dataAccess.listing.checkIfUserListing(req.params.listing_id, req.user.user_id)
                                .catch(
                                    function(err){
                                        // If there was any MySQL errors
                                        console.log(err);
                                        res.status(500).send({
                                            'Error': 'MySQL error',
                                            'error_code': 'MySQL_ERR'
                                        });
                                        throw 'MYSQL_ERR';
                                    }
                                )
                            );
                        })
                        .then(
                            function(user_listing_own){
                                return new Promise((resolve, reject) => {
                                    if(user_listing_own){
                                        resolve(true);
                                    }
                                    else{
                                        // If they dont own the listing
                                        const err = new Error('Listing does not belong to user');
                                        err.code = 'USER_UNAUTH_LISTING';
                                        reject(err);
                                    }
                                })
                                .catch(
                                    function(err){
                                        console.log(err);
                                        res.status(401).send({
                                            'Error': 'You cannot add a picture to this listing',
                                            'error_code': 'USER_UNAUTH_LISTING'
                                        });
                                        throw err.code;
                                    }
                                );
                            }
                        )
                        .then(
                            function(){
                                // Check if the listing exists
                                return dataAccess.listing.getListingById(req.params.listing_id)
                                .catch(
                                    function(err){
                                        console.log(err);
                                        res.status(500).send({
                                            'Error': 'MySQL error',
                                            'error_code': 'MySQL_ERR'
                                        });
                                        throw 'MySQL_ERR';
                                    }
                                );
                            }
                        )
                        .then(
                            function(listing){
                                return new Promise((resolve, reject) => {
                                    if(listing.length === 1){
                                        // Listing exists
                                        resolve(true);
                                    }
                                    else{
                                        const err = new Error('Listing does not exists');
                                        err.code = 'LISTING_EXISTS';
                                        reject(err);
                                    }
                                })
                                .catch(
                                    function(err){
                                        console.log(err);
                                        res.status(404).send({
                                            'Error': 'Listing does not exists',
                                            'error_code': err.code  
                                        });
                                        throw err.code;
                                    }
                                );
                            }
                        )
                        .then(
                            function(){
                                // If the user owns the listing
                                return dataAccess.listing.addPictureToListing(req.params.listing_id, req.file.filename)
                                .catch(
                                    function(err){
                                        // If there was any MySQL errors
                                        console.log(err);
                                        res.status(500).send({
                                            'Error': 'MySQL error',
                                            'error_code': 'MySQL_ERR'
                                        });
                                        throw 'MYSQL_ERR';
                                    }
                                );
                            }
                        )
                        .then(
                            function(){
                                // If creating a user is successful
                                res.status(201).send({
                                    'Result': 'Picture successfully added'
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
                }
            });
        });
        // Affecting the picture file directly, /api/listing/picture 
        app.get('/api/listing/picture/:listing_picture_file_name', function(req, res){
            res.sendFile(process.cwd() + listing_picture_file_base_path + req.params.listing_picture_file_name, function(err){
                if(err){
                    console.log(err);
                    res.status(500).send({
                        'Error': 'Error retriving avatar',
                        'error_code': 'GET_AVATAR_ERROR' 
                    });
                }
            });
        });
        // Others
        // Getting all other listing
        app.get('/api/other/listing', function(req, res){
            new Promise((resolve) => {
                resolve(
                    dataAccess.listing.getOtherListing(req.user.user_id)
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(500).send({
                                'Error': 'MySQL Error',
                                'error_code': 'MySQL_ERR'
                            });
                            throw 'MySQL_ERR';
                        }
                    )
                );
            })
            .then(
                function(listings){
                    // If getting the listings were successful
                    res.status(200).send({
                        'listings': listings 
                    });
                }
            )
            .catch(
                function(err){
                    console.log('Final catch err: ' + err);
                }
            );
        });
    }
};

module.exports = listingAPIController;