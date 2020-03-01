// This db file contains:
// Actions required on a listing, such as CRUD

// Importing other libs I need to use
const uuid = require('uuid/v4');

const listingsDB = {
    init(pool){
        this.pool = pool;
    },
    createANewListing(title, description, price, listing_user_id){
        return new Promise((resolve, reject) => {
            const listing_id = uuid();
            // Here availability and delted defaults to 0
            // Mapping of values can be seen in the markdown
            this.pool.query(`
            INSERT INTO LISTINGS
            (listing_id, title, description, price, listing_user_id, availability, deleted)
            VALUES
            (?, ?, ?, ?, ?, ?, ?)
            `, [listing_id, title, description, price, listing_user_id, 0, 0], function(err, data){
                if(err){
                    reject(err);
                }
                else{
                    resolve(data);
                }
            });
        });
    },
    getListingById(listing_id){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            SELECT u.username AS listing_user_username,
            l.listing_id,
            l.title,
            l.description,
            l.price,
            l.listing_user_id,
            l.created_timestamp,
            l.availability,
            l.last_modified_timestamp,
            (SELECT COUNT(*) FROM LIKES li
                WHERE (li.deleted = 0) AND (li.listing_id = ?)) num_likes
            FROM (LISTINGS l LEFT JOIN USERS u ON l.listing_user_id = u.user_id)
            WHERE (((l.listing_id = ?)) AND (l.deleted = 0));
            `, [listing_id, listing_id], function(err, data){
                if(err){
                    reject(err);
                }
                else{
                    resolve(data);
                }
            });
        });
    },
    getUserListings(listing_user_id){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            SELECT 
                l.listing_id,
                l.title,
                l.description,
                l.price,
                l.listing_user_id,
                l.created_timestamp,
                l.availability,
                l.last_modified_timestamp,
            COUNT(li.like_id) AS num_likes
            FROM (LISTINGS l LEFT JOIN
                (SELECT * FROM LIKES
                    WHERE deleted = 0) li ON li.listing_id = l.listing_id)
            WHERE ((l.listing_user_id = ?) AND (l.deleted = 0))
            GROUP BY l.listing_id;
            `, [listing_user_id], function(err, data){
                if(err){
                    reject(err);
                }
                else{
                    resolve(data);
                }
            });
        });
    },
    editUserListing(listing_id, title, description, price){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            UPDATE LISTINGS
            SET title = ?, description = ?, price = ?
            WHERE listing_id = ?
            `, [title, description, price, listing_id], function(err, data){
                if(err){
                    reject(err);
                }
                else{
                    resolve(data);
                }
            });
        });
    },
    getOtherListing(listing_user_id){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            SELECT 
                u.username AS listing_user_username,
                l.listing_id,
                l.title,
                l.description,
                l.price,
                l.listing_user_id,
                l.created_timestamp,
                l.availability,
                l.last_modified_timestamp,
            COUNT(li.like_id) AS num_likes
            FROM ((LISTINGS l LEFT JOIN USERS u ON l.listing_user_id = u.user_id) LEFT JOIN
                (SELECT * FROM LIKES
                    WHERE deleted = 0) li ON li.listing_id = l.listing_id)
            WHERE ((NOT(l.listing_user_id = ?)) AND (l.deleted = 0))
            GROUP BY l.listing_id;
            `, [listing_user_id], function(err, data){
                if(err){
                    reject(err);
                }
                else{
                    resolve(data);
                }
            });
        });
    },
    checkIfUserListing(listing_id, listing_user_id){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            SELECT * FROM LISTINGS
            WHERE ((listing_id = ?) AND (listing_user_id = ?) AND (deleted = 0)) 
            `, [listing_id, listing_user_id], function(err, data){
                if(err){
                    reject(err);
                }
                else if(data.length === 0){
                    // If the user does not own the listing
                    resolve(false);
                }
                else{
                    // If the user does own the listing
                    resolve(true);
                }
            });
        });
    },
    deleteAListing(listing_id){
        return new Promise((resolve, reject) => {
            // Deletes the likes linked to the listing_id
            this.pool.query(`
            UPDATE LIKES
            SET deleted = 1
            WHERE ((listing_id = ?) AND deleted = 0)
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
    // Dealing with listing images here
    // Adding a picture to a listing
    addPictureToListing(listing_id, listing_picture_file_name){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            INSERT INTO LISTING_PICTURES
            (listing_id, listing_picture_file_name, deleted)
            VALUES
            (?, ?, ?)
            `, [listing_id, listing_picture_file_name, 0], function(err, data){
                if(err){
                    reject(err);
                }
                else{
                    resolve(data);
                }
            });
        });
    },
    getListingPicturesById(listing_id){
        return new Promise((resolve, reject) => {
            this.pool.query(`
            SELECT * FROM LISTING_PICTURES
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
    }
};

module.exports = listingsDB;