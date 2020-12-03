const router = require('express').Router();
const { getCars, getCarById, addToGarage, removeFromGarage } = require('../controllers/car.controller');
const {
    param_Car_Id
} = require('../../services/apiValidations');
const { authUser, authRole } = require('../../middlewares/auth.middleware');

router.get(
    '/getCars',
    authUser,
    // authRole([3]),
    getCars
);

router.get(
    '/getCar/:carId',
    authUser,
    // authRole([3]),
    [ 
        param_Car_Id()
    ],
    getCarById
);

router.post(
    '/addToGarage/:carId',
    authUser,
    authRole([3]),
    [ 
        param_Car_Id()
    ],
    addToGarage
);

router.delete(
    '/removeFromGarage/:carId',
    authUser,
    authRole([3]),
    [ 
        param_Car_Id()
    ],
    removeFromGarage
);

module.exports = router;