// This file contains controllers pertaining to:
// Anything that has to do with likesg such as the CRUD of likes

// Importing dataAccess object to interface with the DB
const dataAccess = require('../../db/index');

const likeAPIController = {
    init(app){
        // Affects likes directly by listing_id, /api/like/:listing_id
        // Get information of likes on a listing
        app.get('/api/like/:listing_id', function(req, res){
             new Promise((resolve) => {
                resolve(
                    dataAccess.listing.checkIfUserListing(req.params.listing_id, req.user.user_id)
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
                function(user_listing_own){
                    return new Promise((resolve, reject) => {
                        if(user_listing_own){
                            // If the user does own the listing
                            resolve(true);
                        }
                        else{
                            const err = new Error('You don\'t have permission to view this.');
                            err.code = 'USER_NO_PERMISSION';
                            reject(err);
                        }
                    })
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(401).send({
                                'Error': 'You don\'t have permission to view this.',
                                'error_code': err.code
                            });
                            throw err.code;
                        }
                    );
                }
            )
            .then(
                function(){
                    return dataAccess.like.getLikesOfListing(req.params.listing_id)
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
                function(likes){
                    res.status(200).send({
                        likes: likes
                    });
                }
            )
            .catch(
                function(err){
                    // Final catch for all errors
                    console.log('Final catch err: ' + err);
                }
            );           
        });
        // Add a like to a listing
        app.post('/api/like/:listing_id', function(req, res){
            new Promise((resolve) => {
                resolve(
                    dataAccess.listing.checkIfUserListing(req.params.listing_id, req.user.user_id)
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
                function(user_listing_own){
                    return new Promise((resolve, reject) => {
                        if(user_listing_own){
                            const err = new Error('User liking his own post');
                            err.code = 'USER_LIKING_OWN_LISTING';
                            reject(err);
                        }
                        else{
                            resolve(true);
                        }
                    })
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(401).send({
                                'Error': 'User liking own post',
                                'error_code': err.code
                            });
                            throw err.code;
                        }
                    );
                }
            )
            .then(
                function(){
                    return dataAccess.like.checkLike(req.params.listing_id, req.user.user_id)
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
                    );
                }
            )
            .then(
                function(user_like_before){
                    return new Promise((resolve, reject) => {
                        if(!user_like_before){
                            // If the user has not liked the listing before
                            resolve(true);
                        }
                        else{
                            // If the user has liked the listing before
                            const err = new Error('User has liked the post before');
                            err.code = 'USER_LIKED_BEFORE';
                            reject(err);
                        }
                    })
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(401).send({
                                'Error': 'User has liked the post before',
                                'error_code': err.code
                            });
                            throw err.code;
                        }
                    );
                }
            )
            .then(
                function(){
                    // If the user has not liked the post before
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
                    // If the user has not liked the post before and the listing exists
                    return dataAccess.like.likeAListing(req.params.listing_id, req.user.user_id)
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
                function(){
                    // If the like was successful
                    res.status(200).send({
                        'Result': 'Like was successful'
                    });
                }
            )
            .catch(
                function(err){
                    // Final catch for all errors
                    console.log('Final catch err: ' + err);
                }
            );
        });
        // Endpoint for unliking a listing
        app.delete('/api/like/:listing_id', function(req, res){
            new Promise((resolve) => {
                resolve(
                    dataAccess.like.checkLike(req.params.listing_id, req.user.user_id)
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
                function(user_like_before){
                    return new Promise((resolve, reject) => {
                        if(user_like_before){
                            // If the user has not liked the listing before
                            resolve(true);
                        }
                        else{
                            // If the user has liked the listing before
                            const err = new Error('User has not liked the post before');
                            err.code = 'USER_NOT_LIKED_BEFORE';
                            reject(err);
                        }
                    })
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(401).send({
                                'Error': 'User not has liked the post before',
                                'error_code': err.code
                            });
                            throw err.code;
                        }
                    );
                }
            )
            .then(
                function(){
                    // If the user has liked the post before
                    return dataAccess.like.unlikeAListing(req.params.listing_id, req.user.user_id)
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
                function(){
                    // If the like was successful
                    res.status(200).send({
                        'Result': 'Unlike was successful'
                    });
                }
            )
            .catch(
                function(err){
                    // Final catch for all errors
                    console.log('Final catch err: ' + err);
                }
            );
        });
        // Check endpoint
        // Endpoint to check if the listing has been liked the user, returns the boolean
        app.get('/api/like/check/:listing_id', function(req, res){
            new Promise((resolve) => {
                resolve(
                    dataAccess.like.checkLike(req.params.listing_id, req.user.user_id)
                    .catch(
                        function(err){
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
                function(user_like_before){
                    res.status(200).send({
                        like_before: user_like_before
                    });
                }
            )
            .catch(
                function(err){
                    // Final catch for all errors
                    console.log('Final catch err: ' + err);
                }
            );
        });
    }
};

module.exports = likeAPIController;