// This is the main file that contains all the middleware needed by the server
// Examples are authenticating and creating a user

// Importing the other middlewares
const userAuth = require('./userAuth');
const pathAuth = require('./pathAuth');
const addResUser = require('./addResUser');

const middlewares = {
    init(app){
        app.use(userAuth);
        app.use(pathAuth);
        app.use(addResUser);
    }
};

module.exports = middlewares;