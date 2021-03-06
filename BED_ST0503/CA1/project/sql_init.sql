CREATE DATABASE IF NOT EXISTS `BED_CA1_Assignment`;

USE BED_CA1_Assignment;

DROP TABLE IF EXISTS USERS, LISTINGS, OFFERS, LIKES, COMMENTS, FAVOURITES, LISTING_PICTURES;

CREATE TABLE IF NOT EXISTS USERS (
	user_id VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar_icon_file_name VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(800) NOT NULL,
    created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INT(1) NOT NULL,
    PRIMARY KEY(user_id)
);

CREATE TABLE IF NOT EXISTS LISTINGS (
	listing_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    listing_user_id VARCHAR(255) NOT NULL,
    created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    availability INT(1),
    last_modified_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted INT(1),
    PRIMARY KEY(listing_id),
    FOREIGN KEY(listing_user_id)
    REFERENCES USERS(user_id)
);

CREATE TABLE IF NOT EXISTS OFFERS (
	offer_id VARCHAR(255) NOT NULL,
    listing_id VARCHAR(255) NOT NULL,
    offer_user_id VARCHAR(255) NOT NULL,
    offer_price DECIMAL(12, 2) NOT NULL,
    created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status INT(1) NOT NULL,
    last_modified_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted INT(1) NOT NULL,
    PRIMARY KEY(offer_id),
    FOREIGN KEY(listing_id)
		REFERENCES LISTINGS(listing_id),
	FOREIGN KEY(offer_user_id)
		REFERENCES USERS(user_id)
);

CREATE TABLE IF NOT EXISTS LIKES (
	like_id VARCHAR(255) NOT NULL,
	listing_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted INT(1) NOT NULL,
    PRIMARY KEY(like_id),
    FOREIGN KEY(listing_id)
		REFERENCES LISTINGS(listing_id),
	FOREIGN KEY(user_id)
		REFERENCES USERS(user_id)
);

CREATE TABLE IF NOT EXISTS FAVOURITES (
	listing_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INT(1) NOT NULL,
    PRIMARY KEY(listing_id, user_id),
    FOREIGN KEY(listing_id)
		REFERENCES LISTINGS(listing_id),
	FOREIGN KEY(user_id)
		REFERENCES USERS(user_id)
);

CREATE TABLE IF NOT EXISTS COMMENTS (
	listing_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    comment VARCHAR(500) NOT NULL,
    created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted INT(1) NOT NULL,
    PRIMARY KEY(listing_id, user_id),
    FOREIGN KEY(listing_id)
		REFERENCES LISTINGS(listing_id),
	FOREIGN KEY(user_id)
		REFERENCES USERS(user_id)
);

CREATE TABLE IF NOT EXISTS LISTING_PICTURES(
	listing_id VARCHAR(255) NOT NULL,
    listing_picture_file_name VARCHAR(255) NOT NULL,
    created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted INT(1) NOT NULL,
    PRIMARY KEY(listing_id, listing_picture_file_name),
    FOREIGN KEY(listing_id)
		REFERENCES LISTINGS(listing_id)
);
