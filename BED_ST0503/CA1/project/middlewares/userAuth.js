// This middleware contains:
// The function to call to create the req.user if possible

// Importing other libraries
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function userAuth(req, res, next){
    if(req.cookies.access_token){
        jwt.verify(req.cookies.access_token, JWT_SECRET, {
            algorithms: 'HS256',
        }, function(err, payload){
            if(err){
                // If there is an error, set req.user to null
                console.log(err);
                req.user = null;
                next();
            }
            else{
                // If the token is verified
                req.user = {
                    'user_id': payload.user_id
                };
                next();
            }
        });
    }
    else{
        // If there is no access token
        console.log('There is no access token error');
        req.user = null;
        next();
    }
}

module.exports = userAuth;