const axios = require('axios');
require('dotenv').config();
const createError = require('http-errors');
const {formErrorObject, MAIN_ERROR_CODES} = require('../services/errorHandling');


async function authUser(req, res, next) {
    try {
        let user = await axios(`http://localhost:${process.env.AUTH_HTTP_PORT}/api/auth/checkToken`, {
            headers: {
                'Authorization': req.headers.authorization || ''
            }
        });
        req.user = user.data;
        next();
    } catch (error) {
        if(error.response && error.response.data && error.response.data.code && error.response.data.message) {
            return next(createError(formErrorObject({ERROR_CODE: error.response.data.code, HTTP_CODE: error.response.status, MESSAGE: error.response.data.message })));
        }
        return next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR, 'Something went wrong, please try again')));
    }
};

function authRole(role) {
    return function(req, res, next) {
      try {
        const user = req.user;
        let rolesCheck = role.map(item => user.userRoles.includes(item)).includes(false);
        if(rolesCheck) return next(createError(formErrorObject(MAIN_ERROR_CODES.FORBIDDEN, 'Uesr has not necessary roles')));
        next();
      } catch (error) {
        console.log(error);
        return next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR, 'Something went wrong, please try again')));
      }
    }
}

module.exports = {
    authUser,
    authRole
}