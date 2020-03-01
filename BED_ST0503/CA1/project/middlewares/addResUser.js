// This middleware contains:
// The function to add user to res.locals if there is a user and is on the correct path

// Importing db
const dataAccess = require('../db/index');

function addResUser(req, res, next){
    if(req.user === undefined || req.user === null){
        // If there is no user pass
        next();
    }
    else{
        dataAccess.user.getUserByUserId(req.user.user_id)
            .then(
                function(user){
                    req.user = user;
                    res.locals.user = user;
                    next();
                }
            )
            .catch(
                function(err){
                    console.log(err);
                    next();
                }
            );
    }
}

module.exports = addResUser;