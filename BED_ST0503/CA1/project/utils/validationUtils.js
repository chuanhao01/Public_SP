// This utils file mainly contains:
// Utility functions for validation

const validationUtils = {
    checkEmpty(body){
        let values = Object.values(body);
        for(let value of values){
            if(value === ''){
                return true;
            }
        }
        return false;
    }
};

module.exports = validationUtils;