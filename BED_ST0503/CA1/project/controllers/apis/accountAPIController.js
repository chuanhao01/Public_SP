// This file contains controllers pertaining to:
// APIs endpoint for accounts, such as login or creating an account

/*
Documentation for how a promise here should be modeled
app.METHOD(path, function(req, res){
    // Below is the main wrapper promise that contains the other promises
    new Promise((resolve) => {
        // Resolve the first given promise
        resolve(
            first_promise()
            .catch(
                function(err){
                    handle specific err here and throw
                }
            );
        )
    })
    .then(
        function(*params){
            continue here
        }
    )
    .catch(
        function(err){
            final catch for all errors
        }
    );
});
*/

// Importing other libs
const path = require('path');
const multer = require('multer');
const upload = multer({
    // Setting the destination where the avatar icons are stored
    dest: 'uploads/avatarIcons/',
    limits: {
        // 1MB limit for file upload
        fileSize: 1000000,
    },
    // Custom file filter function, only accepting file with image extensions
    // Throws a custom error if there is one
    fileFilter(req, file, cb){
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            let err = new Error('File extension of uploaded file is wrong');
            err.code = 'FILE_EXT';
            return cb(err);
        }
        return cb(null, true);
    }
}).single('avatar_icon');

// Importing dataAccess object to interface with the DB
const dataAccess = require('../../db/index');
const utils = require('../../utils/index');

const accountAPIController = {
    init(app){
        // When using axios to send a request, the data is stored in req.body
        // Dealing with account, /api/account
        // Endpoint to create an account
        app.post('/api/account', function(req, res){
            upload(req, res, function(err){
                if(utils.validation.checkEmpty(req.body)){
                    // If the field is empty
                    res.status(500).send({
                        'Error': 'Some fields are empty'
                    });
                    return;
                }
                else{
                    // Cataching errors in the file uploaded
                    if(err){
                        // File extension is not an img
                        if(err.code === 'FILE_EXT'){
                            res.status(422).send({
                                'Error': 'Wrong file extension',
                                'error_code': err.code
                            });
                            return;
                        }
                        // File uploaded is too large
                        else if(err.code === 'LIMIT_FILE_SIZE'){
                            res.status(413).send({
                                'Error': 'File sent is too large',
                                'error_code': err.code
                            });
                            return;
                        }
                        else{
                            res.status(500).send({
                                'Error': 'Multer error',
                                'error_code': err.code
                            });
                            return;
                        }
                    }
                    else{
                        if(req.file === undefined){
                            // Check if file was not empty
                            res.status(500).send({
                                'Error': 'File is empty'
                            });
                            return;
                        }
                        else{
                            // If there is no error in uploading the file
                            // Trying to Creating the new user now
                            new Promise((resolve) => {
                                resolve(
                                    dataAccess.user.getUserByUsername(req.body.username)
                                    .catch(
                                        function(err){
                                            console.log(err);
                                            res.status(500).send({
                                                'Error': 'MySQL_ERR',
                                                'error_code': err.code
                                            });
                                        }
                                    )
                                );
                            })
                            .then(
                                function(user){
                                    // Check if the username is taken
                                    return new Promise((resolve, reject) => {
                                        if(user.length === 0){
                                            // No one else has the username
                                            resolve(true);
                                        }
                                        else{
                                            const err = new Error('Username already taken');
                                            err.code = 'USERNAME_TAKEN';
                                            reject(err);
                                        }
                                    })
                                    .catch(
                                        function(err){
                                            // If the username is already taken
                                            console.log(err);
                                            res.status(403).send({
                                                'Error': 'Username already taken',
                                                'error_code': err.code
                                            });
                                            throw err.code;
                                        }
                                    );
                                }
                            )
                            .then(
                                // If the username is not taken
                                function(){
                                    return dataAccess.user.createANewUser(req.file.filename, req.body.username, req.body.password)
                                    .catch(
                                        function(err){
                                            // If there are any erros deal with it here and raise it to the final catch
                                            console.log(err);
                                            res.status(500).send({
                                                'Error': 'Error creating a user',
                                                'error_code': err.code
                                            });
                                            throw 'CREATE_USER_ERR';
                                        }
                                    );
                                }
                            )
                            .then(
                                function(){
                                    // If creating a user is successful
                                    res.status(201).send({'Result': 'User successfully created'});
                                }
                            )
                            .catch(
                                function(err){
                                    // Final catch for all errors
                                    console.log('Final catch err: ' + err);
                                }
                            );
                        }
                    }
                }
            });
        });
        // Endpoint for logging in
        app.post('/api/login', function(req, res){
            new Promise((resolve) => {
                resolve(
                    dataAccess.user.getUserByUsername(req.body.username)
                    .catch(
                        function(err){
                            // Gettting user by username errors
                            console.log(err);
                            res.status(500).send({
                                'Error': 'MySQL_ERR',
                                'error_code': err.code
                            });
                            throw 'GET_USER_ERR';
                        }
                    )
                );
            })
            .then(
                function(user){
                    // Checking if the user exists
                    return new Promise((resolve, reject) => {
                        if(user.length === 0){
                            // user does not exists
                            const err = new Error('User does not exists');
                            err.code = 'USER_DOES_NOT_EXISTS';
                            reject(err);
                        }
                        else{
                            // If the user exists, continue
                            resolve(user[0]);
                        }
                    })
                    .catch(
                        function(err){
                            // As the user does not exists
                            console.log(err);
                            res.status(401).send({
                                'Error': 'User does not exists',
                                'error_code': err.code
                            });
                            throw err.code;
                        }
                    );
                }
            )
            .then(
                function(user){
                    // Checking if the credentials are correct
                    return dataAccess.user.checkPassword(req.body.password, user.password)
                        .catch(
                            // Error from checking bcrypt
                            function(err){
                                console.log(err);
                                res.status(500).send({
                                    'Error': 'Bcrypt error',
                                    'error_code': err.code
                                });
                                throw 'Bcrypt error';
                            }
                        )
                        .then(
                            function(same){
                                return new Promise((resolve, reject) => {
                                    if(same){
                                        // Login successful move on
                                        resolve(user);
                                    }
                                    else{
                                        // Login failed move to catch it
                                        const err = new Error('Login failed');
                                        err.code = 'LOGIN_FAILED';
                                        reject(err);
                                    }
                                })
                                    .catch(
                                        // Login failed
                                        function(err){
                                            console.log(err);
                                            res.status(401).send({
                                                'Error': 'Login failed',
                                                'error_code': err.code
                                            });
                                            throw 'Login failed';
                                        }
                                    );
                            }
                        );
                }
            )
            .then(
                // Login is successful
                function(user){
                    // Generate the access token
                    return utils.jwt.generateAccessToken(user)
                        .catch(
                            function(err){
                                console.log(err);
                                res.status(500).send({
                                    'Error': 'JWT error',
                                    'error_code': err.code
                                });
                                throw 'JWT_ERROR';
                            }
                        );
                }
            )
            .then(
                // If generation of tokens is successful
                function([refresh_token, access_token]){
                    res.status(200).send({
                        'refresh_token': refresh_token,
                        'access_token': access_token
                    });
                }
            )
            .catch(
                // Final catch all thrown errors and logging them
                function(err){
                    console.log('Final catch err: ' + err);
                }
            );
        });
        // Endpoint to get a new access token based on refresh_token 
        app.get('/api/refresh_token', function(req, res){
            if(req.cookies.refresh_token){
                // If refresh token exists
                new Promise((resolve) => {
                    resolve(
                        dataAccess.user.getUserByRefreshToken(req.cookies.refresh_token)
                        .catch(
                            // Errors in getting the user from MySQL
                            function(err){
                                console.log(err);
                                if(err.code === 'INVALID_TOKEN'){
                                    // Refresh token given is invalid or cannot be found
                                    res.status(401).send({
                                        'Error': 'Invalid refresh token',
                                        'error_code': err.code
                                    });
                                }
                                else{
                                    res.status(500).send({
                                        'Error': 'MySQL error',
                                        'error_code': err.code
                                    });
                                }
                                throw 'REFRESH_TOKEN_ERR';
                            }
                        )
                    );
                })
                .then(
                    function(user){
                        // If successful in getting the user
                        return utils.jwt.generateAccessToken(user)
                            .catch(
                                function(err){
                                    console.log(err);
                                    res.status(500).send({
                                        'Error': 'JWT error',
                                        'error_code': err.code
                                    });
                                    throw 'JWT_ERROR';
                                }
                            );
                    }
                )
                .then(
                    // If generation of the access token is successful 
                    function([refresh_token, access_token]){
                        res.status(200).send({
                            'access_token': access_token,
                        });
                    }
                )
                .catch(
                    // Final catch for all other errors
                    function(err){
                        console.log('Final catch err: ' + err);
                    }
                );
            }
            else{
                // If the refresh token does not exists
                res.status(400).send({
                    'Error': 'Refresh token missing',
                    'error_code': 'NO_TOKEN',
                });
            }
        });
    }
};

module.exports = accountAPIController;