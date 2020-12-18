const router = require('express').Router();
const { getCars, getCarById, addToGarage, removeFromGarage, getGarageCars, getCarByParams } = require('../controllers/car.controller');
const {
    param_Car_Id,
    query_Car_Year,
    query_Car_Brand,
    query_Car_Model,
    query_Car_EngineType,
    query_Car_EngineCapacity,
} = require('../../services/apiValidations');
const { authUser, authRole } = require('../../middlewares/auth.middleware');

router.get(
    '/getCars',
    authUser,
    authRole([3]),
    getCars
);

router.get(
    '/getCar/:carId',
    authUser,
    authRole([3]),
    [ 
        param_Car_Id()
    ],
    getCarById
);

router.get(
    '/getCarByParams',
    // authUser,
    // authRole([3]),
    [ 
        query_Car_Year(),
        query_Car_Brand(),
        query_Car_Model(),
        query_Car_EngineType(),
        query_Car_EngineCapacity(),
    ],
    getCarByParams
);

router.post(
    '/addToGarage/:carId',
    authUser,
    // authRole([3]),
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

router.get(
    '/getGarageCars',
    authUser,
    authRole([3]),
    getGarageCars
);

module.exports = router;