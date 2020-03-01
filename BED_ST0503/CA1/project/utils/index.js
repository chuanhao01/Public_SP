// This folder mainly contains the util function used such as using jwt to generate token

// Importing the other utils
const jwtUtils = require('./jwtUtils');
const validtionUtils = require('./validationUtils');

const utils = {
    'jwt': jwtUtils,
    'validation': validtionUtils
};

module.exports = utils;