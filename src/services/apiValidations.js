const { query, param, check } = require('express-validator');
const isNumber = require('../helpers/isNumber');

const isRequiredParameter = (isRequired, paramName) => {
    return isRequired ? check(paramName).exists().withMessage('Is required').bail() : check(paramName).optional();
}

module.exports = {
    param_Car_Id: () => {
      return param('carId').exists().withMessage('Is required').bail()
        .isInt().withMessage('Should be an integer value').bail();
    },
    body_Category_Id: (isRequired) => {
      return isRequiredParameter(isRequired, 'categoryId').notEmpty().withMessage('Should not be empty').bail()
        .custom(value => isNumber(value) ? true : false).withMessage('Should be an integer value').bail();
    },
}