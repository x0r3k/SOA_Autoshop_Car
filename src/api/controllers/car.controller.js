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

  addToGarage: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(createError(formErrorObject(MAIN_ERROR_CODES.VALIDATION_BODY, 'Invalid request params', errors.errors)));
      }
      const {
        categoryId
      } = req.params;
      const category = await categories.findByPk(categoryId);
      if (!category) return next(createError(formErrorObject(MAIN_ERROR_CODES.ELEMENT_NOT_FOUND, 'Category not found')));
      let categoriesArray = [category.id];
      const getSubcategories = async (arr) => {
        await Promise.all(arr.map(async (item) => {
          let foundedCatogories = await categories.findAll({
            where: {
              fkCategoryId: item
            }
          });
          if (!foundedCatogories) return;
          let param = foundedCatogories.map(item => item.id);
          categoriesArray = [...categoriesArray, ...param];
          getSubcategories(param);
        }));
      }
      await getSubcategories(categoriesArray);

      const productList = await products.findAll({
        where: {
          fkCategoryId: {
            [Op.in]: categoriesArray
          }
        }
      })
      return res.status(200).json({
        productList
      });
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

      const carsList = await cars.findAll();
      return res.status(200).json({
        carsList
      });
    } catch (error) {
      console.log(error);
      return next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR, 'Something went wrong, please try again')));
    }
  },
}