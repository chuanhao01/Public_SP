// This file contains controllers pertaining to:
// Anything that the users does, mostly serving of user pages

/*
Note: 
Here req.user has all the information of the user
*/

const userController = {
    init(app){
        const parent_dir = 'pages/user/';
        const profile_parent_dir = parent_dir + 'profile/';
        const listing_parent_dir = parent_dir + 'listings/';
        // users home page
        app.get('/user/home', function(req, res){
            res.render(parent_dir + 'userHome', {
                'title': `Welcome ${req.user.username}`
            });
        });
        // Looking at their own profile
        app.get('/user/profile', function(req, res){
            res.render(profile_parent_dir + 'viewProfile', {
                'title': 'Looking at your own profile'
            });
        });
        // Edit their profile
        app.get('/user/profile/edit', function(req, res){
            res.render(profile_parent_dir + 'editProfile', {
                'title': 'Editing your profile'
            });
        });
        // Listings
        // Adding a listing
        app.get('/user/listing/add', function(req, res){
            res.render(listing_parent_dir + 'addListing', {
                'title': 'Add a listing'
            });
        });
        // View all of the user's listings
        app.get('/user/listing', function(req, res){
            res.render(listing_parent_dir + 'viewUserListings', {
                'title': 'Looking at your own listings'
            });
        });
        // View a specific listing
        app.get('/user/listing/:listing_id', function(req, res){
            res.render(listing_parent_dir + 'viewUserSingleListing', {
                'title': 'Looking at listing'
            });
        });
        // Adding a picture to the listing
        app.get('/user/listing/picture/add/:listing_id', function(req, res){
            res.render(listing_parent_dir + 'addPicture', {
                'title': 'Adding a picture to the listing'
            });
        });
        // Edit a specific listing
        app.get('/user/listing/edit/:listing_id', function(req, res){
            res.render(listing_parent_dir + 'editUserSingleListing', {
                'title': 'Editing a listing'
            });
        });
        // Others
        // Looking at other listing
        app.get('/listing', function(req, res){
            res.render(listing_parent_dir + 'viewOtherListings', {
                'title': 'Looking at other listings'
            });
        });
        // Looking at an individual listing
        app.get('/listing/:listing_id', function(req, res){
            res.render(listing_parent_dir + 'viewOtherSingleListing', {
                'title': 'Viewing a listing'
            });
        });
        // Add an offering
        app.get('/listing/offer/:listing_id', function(req, res){
            res.render(listing_parent_dir + 'addOffering', {
                'title': 'Adding an offer'
            });
        });
        // Edit an offering
        app.get('/listing/offer/edit/:listing_id', function(req, res){
            res.render(listing_parent_dir + 'editOffering', {
                'title': 'Editing an offer'
            });
        });
    }
};

module.exports = userController;