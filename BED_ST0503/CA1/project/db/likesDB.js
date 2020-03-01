// This db file contains:
// Actions required on a likes, such as CRUD

// Importing other libs I need to use
const uuid = require('uuid/v4');

const likesDB = {
    init(pool){
        this.pool = pool;
    },
    // Function called to check if the user has liked the listing berfore
    checkLike(listing_id, user_id){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            SELECT * FROM LIKES
            WHERE ((listing_id = ?) AND (user_id = ?) AND (deleted = 0)) 
            `, [listing_id, user_id], function(err, data){
                if(err){
                    reject(err);
                }
                else if(data.length === 0){
                    // If the user has not liked the listing before
                    resolve(false);
                }
                else{
                    // If the user has already liked the listing before
                    resolve(true);
                }
            });
        });
    },
    // Function called to like a listing
    likeAListing(listing_id, user_id){
        return new Promise((resolve, reject) => {
            // Creating like_id
            const like_id = uuid();
            this.pool.query(`
            INSERT INTO LIKES
            (like_id, listing_id, user_id, deleted)
            VALUES
            (?, ?, ?, 0) 
            `, [like_id, listing_id, user_id], function(err, data){
                if(err){
                    reject(err);
                }
                else{
                    resolve(data);
                }
            });
        });
    },
    // Function called to unlike the listing
    unlikeAListing(listing_id, user_id){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            UPDATE LIKES
            SET deleted = 1
            WHERE ((listing_id = ?) AND (user_id = ?) AND (deleted = 0))
            `, [listing_id, user_id], function(err, data){
                if(err){
                    reject(err);
                }
                else{
                    resolve(data);
                }
            });
        });
    },
    // Get the information of all likes on a listing
    getLikesOfListing(listing_id){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            SELECT *
            FROM ((
            SELECT
            li.like_id,
            li.user_id AS like_user_id,
            l.listing_id,
            l.title,
            l.description,
            l.price,
            l.listing_user_id,
            u.username AS listing_user_username
            FROM (((SELECT * FROM LIKES WHERE deleted = 0) li LEFT JOIN (SELECT * FROM LISTINGS WHERE deleted = 0) l ON li.listing_id = l.listing_id) LEFT JOIN
                (SELECT * FROM USERS WHERE deleted = 0) u ON l.listing_user_id = u.user_id)
            ) a INNER JOIN(
            SELECT
            li.like_id,
            u.username AS like_user_username
            FROM (((SELECT * FROM LIKES WHERE deleted = 0) li LEFT JOIN (SELECT * FROM LISTINGS WHERE deleted = 0) l ON li.listing_id = l.listing_id) LEFT JOIN
                (SELECT * FROM USERS WHERE deleted = 0) u ON li.user_id = u.user_id)
            ) b ON a.like_id = b.like_id)
            WHERE a.listing_id = ?
            `, [listing_id], function(err, data){
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

module.exports = likesDB;