// This utils file mainly contains:
// Utility functions such as generating token

// Loading other libs
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const jwtUtils = {
    generateAccessToken(user){
    // Generate the tokens here
    return new Promise((resolve, reject) => {
        const payload = {
            'Result': 'This is an access token',
            'user_id': user.user_id,
        };
        jwt.sign(payload, JWT_SECRET, {
            algorithm: 'HS256',
            expiresIn: 30 * 60, // token expires in 30 minutes
        }, function(err, token){
            if(err){
                // If there is a jwt error
                reject(err);
            }
            else{
                // If the generation is successful
                resolve([user.refresh_token, token]);
            }
        });
    });
    }
};

module.exports = jwtUtils;