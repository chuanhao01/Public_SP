// This db file contains:
// Actions required on an offering, such as CRUD

// Importing other libs I need to use
const uuid = require('uuid/v4');

const offersDB = {
    init(pool){
        this.pool = pool;
    },
    addAnOffer(listing_id, offer_user_id, offer_price){
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
                    resolve(data);
                }
            });
        });
    },
    getOffersForAListing(listing_id){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            SELECT u.username AS offer_user_username, o.offer_id, o.listing_id, o.offer_user_id, o.offer_price, o.status, o.created_timestamp, o.last_modified_timestamp FROM
            OFFERS o LEFT JOIN USERS u ON o.offer_user_id = u.user_id
            WHERE ((o.listing_id = ?) AND (o.deleted = 0))
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
    // Check if the user has placed an offer on the listing and return the boolean
    checkUserPlacedOffer(listing_id, offer_user_id){
        return new Promise((resolve, reject) =>{
            this.pool.query(`
            SELECT * from OFFERS 
            WHERE ((listing_id = ?) AND (offer_user_id = ?) AND (deleted = 0)) 
            `, [listing_id, offer_user_id], function(err, data){
                if(err){
                    reject(err);
                }
                else if(data.length === 0){
                    // if he has never placed the offer before
                    resolve(false);
                }
                else{
                    // he has placed an offer before
                    resolve(true);
                }
            });
        });
    },
    // Gets the current user offer
    getUserOffer(listing_id, offer_user_id){
        return new Promise((resolve, reject) =>{
            this.pool.query(`
            SELECT * from OFFERS
            WHERE ((listing_id = ?) AND (offer_user_id = ?) AND (deleted = 0)) 
            `, [listing_id, offer_user_id], function(err, data){
                if(err){
                    reject(err);
                }
                else{
                    resolve(data);
                }
            });
        });
    },
    // Delete the offer made by a user
    deleteUserOffer(listing_id, offer_user_id){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            UPDATE OFFERS
            SET deleted = 1
            WHERE ((listing_id = ?) AND (offer_user_id = ?))  
            `, [listing_id, offer_user_id], function(err, data){
                if(err){
                    reject(err);
                }
                else{
                    resolve(data);
                }
            });
        });
    }
};

module.exports = offersDB;