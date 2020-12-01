const MAIN_ERROR_CODES = {
    BAD_REQUEST_BODY: {
      ERROR_CODE: 100,
      HTTP_CODE: 400,
      MESSAGE: 'Request body parameter error',
    },
    VALIDATION_BODY: {
      ERROR_CODE: 101,
      HTTP_CODE: 400,
      MESSAGE: 'Request body parameter value is invalid',
    },
    UNAUTHORIZED: {
      ERROR_CODE: 110,
      HTTP_CODE: 401,
      MESSAGE: 'Token error',
    },
  
    ELEMENT_NOT_FOUND: {
      ERROR_CODE: 151,
      HTTP_CODE: 400,
      MESSAGE: 'Element not found'
    },
    ELEMENT_IN_USE: {
      ERROR_CODE: 152,
      HTTP_CODE: 400,
      MESSAGE: 'Element in use'
    },
    ELEMENT_EXISTS: {
      ERROR_CODE: 153,
      HTTP_CODE: 400,
      MESSAGE: 'Element already exists'
    },
    IS_ENDED: {
      ERROR_CODE: 154,
      HTTP_CODE: 400,
      MESSAGE: 'Course is ended/ video is watched'
    },
    UNAVAILABLE: {
      ERROR_CODE: 155,
      HTTP_CODE: 400,
      MESSAGE: 'ELement is unavailable'
    },
    ELEMENT_NOT_SET: {
      ERROR_CODE: 156,
      HTTP_CODE: 400,
      MESSAGE: 'Element not set'
    },
    ELEMENT_ALREADY_DONE: {
      ERROR_CODE: 157,
      HTTP_CODE: 400,
      MESSAGE: 'Element already done something'
    },
  
  
    CREDENTIAL_ERROR: {
      ERROR_CODE: 200,
      HTTP_CODE: 400,
      MESSAGE: 'Credential error'
    },
    FILE_ERROR: {
      ERROR_CODE: 210,
      HTTP_CODE: 400,
      MESSAGE: 'File is not valid',
    },
    NOTIFICATION_ERROR: {
      ERROR_CODE: 220,
      HTTP_CODE: 400,
      MESSAGE: 'Notification error',
    },
    SUBSCRIPTION_ERROR: {
      ERROR_CODE: 230,
      HTTP_CODE: 400,
      MESSAGE: 'Not subscribed or subscription expired'
    },
    DATABASE_ERROR: {
      ERROR_CODE: 240,
      HTTP_CODE: 400,
      MESSAGE: 'Database logic error'
    },
    REQUEST_ERROR: {
      ERROR_CODE: 250,
      HTTP_CODE: 400,
      MESSAGE: 'Wrong JSON format'
    },
    TOKEN_ERROR: {
      ERROR_CODE: 260,
      HTTP_CODE: 401,
      MESSAGE: 'Token error',
    },
    SESSION_ERROR: {
      ERROR_CODE: 270,
      HTTP_CODE: 401,
      MESSAGE: 'Session error',
    },
  
    FORBIDDEN: {
      ERROR_CODE: 403,
      HTTP_CODE: 403,
      MESSAGE: 'FORBIDDEN',
    },
    NOT_FOUND: {
      ERROR_CODE: 404,
      HTTP_CODE: 404,
      MESSAGE: 'Page not found',
    },
    SYSTEM_ERROR: {
      ERROR_CODE: 500,
      HTTP_CODE: 500,
      MESSAGE: 'Server error',
    },
    UNHANDLED_ERROR: {
      ERROR_CODE: 999,
      HTTP_CODE: 501,
      MESSAGE: 'UNHANDLED ERROR',
    },
  };
  
  function formErrorObject(errorObj, message, details) {
    return { errorObj, message, details };
  }
  
  function errorHandling(error, req, res, next) {
    if (error instanceof SyntaxError) {
      res.status(400);
      res.json({
        code: '250',
        message: error.message,
        details: {
          stack: error.stack
        }
      });
    } else if (!error.errorObj || !error.errorObj.ERROR_CODE || !error.errorObj.HTTP_CODE) {
      console.log(error);
      res.status(500);
      res.json({
        code: '888',
        message: 'Undefined error',
      });
    } else {
      res.status(error.errorObj.HTTP_CODE);
      if (error.details && (Array.isArray(error.details) || (typeof error.details === 'object' && error.details !== null))) {
        res.json({
          code: error.errorObj.ERROR_CODE,
          message: error.message || error.errorObj.MESSAGE,
          details: error.details || [],
        });
      } else {
        res.json({
          code: error.errorObj.ERROR_CODE,
          message: error.message || error.errorObj.MESSAGE,
        });
      }
    }
  }
  
  module.exports = {
    errorHandling,
    formErrorObject,
    MAIN_ERROR_CODES,
  };