// This is the main file that contains all the api controllers so that it can be easily impoerted

// Importing other API controllers
const accountAPIController = require('./accountAPIController');
const assignmentAPIController = require('./assignmentAPIController');
const listingAPIController = require('./listingAPIController');
const offerAPIController = require('./offerAPIController');
const userAPIController = require('./userAPIController');
const likeAPIController = require('./likeAPIController');

const APIControllers = {
    init(app){
        accountAPIController.init(app);
        assignmentAPIController.init(app);
        listingAPIController.init(app);
        offerAPIController.init(app);
        userAPIController.init(app);
        likeAPIController.init(app);
    }
};

module.exports = APIControllers;
