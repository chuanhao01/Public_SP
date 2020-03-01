// This middleware contains:
// The function to check if the path the user is going to is possible

const whitelisted_paths = [
    '/',
    '/login',
    '/account/create',
    '/api/account',
    '/api/login',
    '/api/refresh_token',
    '/error/403',
];

function authPath(req, res, next){
    if(whitelisted_paths.includes(req.originalUrl)){
        // If the path they are going to is ok 
        next();
    }
    else{
        if(req.user === undefined || req.user === null){
            // If they are going to other paths and they are not logged in
            res.status(403);
            res.redirect('/error/403');
        }
        else{
            next();
        }
    }
}

module.exports = authPath;

