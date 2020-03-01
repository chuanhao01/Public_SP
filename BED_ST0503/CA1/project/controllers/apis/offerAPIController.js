// This file contains controllers pertaining to:
// Anything that has to do with offers such as the CRUD of listings

// Importing dataAccess object to interface with the DB
const dataAccess = require('../../db/index');
const utils = require('../../utils/index');

const offerAPIController = {
    init(app){
        // Affecting offer by listing_id, /api/offer/:listing_id
        // Get the offers for a listing
        app.get('/api/offer/:listing_id', function(req, res){
            new Promise((resolve) => {
                resolve(
                    dataAccess.offer.getOffersForAListing(req.params.listing_id)
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
                function(offers){
                    // if the query for the offers was successful
                    res.status(200).send({
                        'offers': offers
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
        // Adding an offer for a listing 
        app.post('/api/offer/:listing_id', function(req, res){
            if(utils.validation.checkEmpty(req.body)){
                res.status(500).send({
                    'Error': 'Some fields are empty'
                });
                return;
            }
            else{
                new Promise((resolve) => {
                    resolve(
                        dataAccess.listing.checkIfUserListing(req.params.listing_id, req.user.user_id)
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
                    function(user_listing_own){
                        return new Promise((resolve, reject) =>{
                            if(user_listing_own){
                                // If the user owns the listing
                                const err = new Error('Its the user listing he is trying to offer on');
                                err.code = 'CANNOT_OFFER_OWN_LISTING';
                                reject(err);
                            }
                            else{
                                // If he is not the owner, let him add the offer
                                resolve(true);
                            }
                        })
                        .catch(
                            function(err){
                                console.log(err);
                                res.status(401).send({
                                    'Error': 'You cannot add this offer',
                                    'error_code': err.code
                                });
                                throw err.code;
                            }
                        );
                    }
                )
                .then(
                    function(){
                        // If he is able to add an offer, check if he has already made an offer
                        return dataAccess.offer.checkUserPlacedOffer(req.params.listing_id, req.user.user_id)
                        .catch(
                            function(err){
                                console.log(err);
                                res.status(500).send({
                                    'Error': 'MySQL_ERR',
                                    'error_code': 'MySQL_ERR'
                                });
                                throw 'MySQL_ERR';
                            }
                        );
                    }
                )
                .then(
                    function(user_offer_placed){
                        return new Promise((resolve, reject) => {
                            if(user_offer_placed){
                                // If the user has already placed an offer, send an error
                                const err = new Error('Already has an offer');
                                err.code = 'OFFER_PLACED_ALR';
                                reject(err);
                            }
                            else{
                                // If he has not placed an offer before, create the offer
                                resolve(true);
                            }
                        })
                        .catch(
                            function(err){
                                console.log(err);
                                res.status(401).send({
                                    'Error': err,
                                    'error_code': err.code
                                });
                                throw err.code;
                            }
                        );
                    }
                )
                .then(
                    function(){
                        return dataAccess.offer.addAnOffer(req.params.listing_id, req.user.user_id, req.body.offer_price)
                        .catch(
                            function(err){
                                console.log(err);
                                res.status(500).send({
                                    'Error': 'MySQL_ERR',
                                    'error_code': 'MySQL_ERR'
                                });
                                throw 'MySQL_ERR';
                            }
                        );
                    }
                )
                .then(
                    function(){
                        // If adding the offer was successful
                        res.status(200).send({
                            'Result': 'Offer was successfully added'
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
        // Delete a user's offer on a listing
        app.delete('/api/offer/:listing_id', function(req, res){
            new Promise((resolve) => {
                resolve(
                    dataAccess.offer.deleteUserOffer(req.params.listing_id, req.user.user_id)
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
                function(){
                    // if the offer was successfully deleted
                    res.status(200).send({
                        'Result': 'Offer was successfully deleted'
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
        // For checking the offer on the listing, /api/offer/check/:listing_id
        // Checks if the user has placed an offer on the listing, returns the boolean value 
        app.get('/api/offer/check/:listing_id', function(req, res){
            new Promise((resolve) => {
                resolve(
                    dataAccess.offer.checkUserPlacedOffer(req.params.listing_id, req.user.user_id)
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
                // Send the result if the offer has been placed by the user
                function(user_offer_placed){
                    res.status(200).send({
                        'offer_placed': user_offer_placed
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
        // /api/offer/user/:listing_id
        // Gets the offer the user has on the listing
        app.get('/api/offer/user/:listing_id', function(req, res){
            new Promise((resolve) => {
                resolve(
                    dataAccess.offer.getUserOffer(req.params.listing_id, req.user.user_id)
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
                // Send the result if the offer has been placed by the user
                function(offer){
                    return new Promise((resolve, reject) =>{
                        if(offer.length === 0){
                            const err = new Error('Offer not found');
                            err.code = 'OFFER_NOT_FOUND';
                            reject(err);
                        }
                        else{
                            // If getting the offer was successful
                            resolve(offer[0]);
                        }
                    })
                    .catch(
                        function(err){
                            console.log(err);
                            res.status(404).send({
                                'Error': 'Offer not found',
                                'error_code': err.code
                            });
                            throw err.code;
                        }
                    );
                }
            )
            .then(
                function(offer){
                    res.status(200).send({
                        'offer': offer
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

module.exports = offerAPIController;