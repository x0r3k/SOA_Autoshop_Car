const createError = require('http-errors');
const { cars, garage, sequelize, Sequelize } = require('../../sequelize/models');
const { validationResult } = require('express-validator');
const { formErrorObject, MAIN_ERROR_CODES } = require('../../services/errorHandling');
const Op = Sequelize.Op;

module.exports = {
  getCars: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(createError(formErrorObject(MAIN_ERROR_CODES.VALIDATION_BODY, 'Invalid request params', errors.errors)));
      }

      const carsList = await cars.findAll();
      return res.status(200).json({
        carsList
      });
    } catch (error) {
      console.log(error);
      return next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR, 'Something went wrong, please try again')));
    }
  },

  getCarById: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(createError(formErrorObject(MAIN_ERROR_CODES.VALIDATION_BODY, 'Invalid request params', errors.errors)));
      }
      const { carId } = req.params;

      const car = await cars.findByPk(carId);
      if (!car) return next(createError(formErrorObject(MAIN_ERROR_CODES.ELEMENT_NOT_FOUND, 'Car not found')));
      return res.status(200).json({ car });
    } catch (error) {
      console.log(error);
      return next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR, 'Something went wrong, please try again')));
    }
  },

  getCarByParams: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(createError(formErrorObject(MAIN_ERROR_CODES.VALIDATION_BODY, 'Invalid request params', errors.errors)));
      }
      const { year, brand, model, engineType, engineCapacity } = req.query;
      const user = req.user;

      const whereParams = {};
      if(year) whereParams.year = year;
      if(brand) whereParams.brand = brand;
      if(model) whereParams.model = model;
      if(engineType) whereParams.engine_type = engineType;
      if(engineCapacity) whereParams.engine_capacity = engineCapacity;

      const garageCars = await cars.findAll({
        attributes: ['id'],
        include: {
          model: garage,
          attributes: [],
          where: {
            fkUserId: user.userId
          }
        }
      });

      const carIds = garageCars.map(item => item.id);

      const foundedCars = await cars.findAll({
        where: {
          ...whereParams,
          id: {
            [Op.notIn]: carIds
          }
        },
      });

      if (!foundedCars) return next(createError(formErrorObject(MAIN_ERROR_CODES.ELEMENT_NOT_FOUND, 'Cars not found')));
      const searchParams = {
        year: [],
        brand: [],
        model: [],
        engineType: [],
        engineCapacity: [],
      };
      foundedCars.forEach(item => {
        searchParams.year.push(item.year);
        searchParams.brand.push(item.brand);
        searchParams.model.push(item.model);
        searchParams.engineType.push(item.engine_type);
        searchParams.engineCapacity.push(item.engine_capacity);
      });
      Object.keys(searchParams).forEach(item => {
        searchParams[item] = [...new Set(searchParams[item])];
      });
      
      return res.status(200).json({ foundedCars, searchParams });
    } catch (error) {
      console.log(error);
      return next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR, 'Something went wrong, please try again')));
    }
  },

  addToGarage: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(createError(formErrorObject(MAIN_ERROR_CODES.VALIDATION_BODY, 'Invalid request params', errors.errors)));
      }
      const { carId } = req.params; 
      const user = req.user;

      const foundedCar = await cars.findByPk(carId);
      if(!foundedCar) return next(createError(formErrorObject(MAIN_ERROR_CODES.ELEMENT_NOT_FOUND, 'Car not found')));
      const garageCheck = await garage.findOne({
        where: {
          fkCarId: carId,
          fkUserId: user.userId
        }
      });

      if(garageCheck) return next(createError(formErrorObject(MAIN_ERROR_CODES.ELEMENT_ALREADY_DONE, 'User already has this car in garage')));

      await garage.create({
        fkCarId: carId,
        fkUserId: user.userId
      });

      return res.status(204).end();
    } catch (error) {
      console.log(error);
      return next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR, 'Something went wrong, please try again')));
    }
  },

  removeFromGarage: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(createError(formErrorObject(MAIN_ERROR_CODES.VALIDATION_BODY, 'Invalid request params', errors.errors)));
      }

      const { carId } = req.params; 
      const user = req.user;

      const foundedCar = await cars.findByPk(carId);
      if(!foundedCar) return next(createError(formErrorObject(MAIN_ERROR_CODES.ELEMENT_NOT_FOUND, 'Car not found')));

      const garageCheck = await garage.findOne({
        where: {
          fkCarId: carId,
          fkUserId: user.userId
        }
      });

      if(!garageCheck) return next(createError(formErrorObject(MAIN_ERROR_CODES.ELEMENT_NOT_FOUND, 'Car in garage not found')));
      garageCheck.destroy();
      return res.status(204).end();
    } catch (error) {
      console.log(error);
      return next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR, 'Something went wrong, please try again')));
    }
  },

  getGarageCars: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(createError(formErrorObject(MAIN_ERROR_CODES.VALIDATION_BODY, 'Invalid request params', errors.errors)));
      }
      const user = req.user;
      const garageCars = await cars.findAll({
        include: {
          model: garage,
          attributes: [], 
          where: {
            fkUserId: user.userId
          }
        }
      });

      return res.status(200).json({ garageCars });
    } catch (error) {
      console.log(error);
      return next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR, 'Something went wrong, please try again')));
    }
  },

}