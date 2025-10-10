// Validations/packValidator.js
import { body, validationResult } from 'express-validator';

/**
 * packRulesMw(mode)
 * One self-contained middleware:
 * - builds rules (create = required, update = optional)
 * - runs them
 * - returns 422 if errors exist
 */
export const packRulesMw = (mode = 'create') => {
  const isCreate = mode === 'create';
  const reqOrOpt = (chain) => (isCreate ? chain : chain.optional());

  // Build the rules array
  const rules = [
    reqOrOpt(body('guidesPlacesId').isArray({ min: 1 }).withMessage('guidesPlacesId must be a non-empty array')),
    reqOrOpt(body('guidesPlacesId.*').isMongoId().withMessage('Each guidesPlacesId item must be a valid MongoId')),
    reqOrOpt(body('title').isString().withMessage('title must be a string').trim().notEmpty().withMessage('title cannot be empty')),
    reqOrOpt(body('description').isString().withMessage('description must be a string').trim().notEmpty().withMessage('description cannot be empty')),
    reqOrOpt(body('price').isFloat({ gt: 0 }).withMessage('price must be a number greater than 0')),
    reqOrOpt(
      body('startDate')
        .isISO8601().withMessage('startDate must be a valid ISO date')
        .custom((value) => {
          const start = new Date(value);
          const min = new Date();
          min.setDate(min.getDate() + 15);
          if (start < min) throw new Error('startDate must be at least 15 days in the future');
          return true;
        })
    ),
    reqOrOpt(
      body('endDate')
        .isISO8601().withMessage('endDate must be a valid ISO date')
        .custom((value, { req }) => {
          const end = new Date(value);
          if (!isCreate && !req.body.startDate) return true; // update: compare only if both provided
          const start = new Date(req.body.startDate);
          if (isNaN(start.getTime())) return true;
          if (end <= start) throw new Error('endDate must be after startDate');
          return true;
        })
    ),
    reqOrOpt(body('availability').isBoolean().withMessage('availability must be boolean')),
    reqOrOpt(body('startLocation').isString().withMessage('startLocation must be a string').trim().notEmpty().withMessage('startLocation cannot be empty')),
    reqOrOpt(body('endLocation').isString().withMessage('endLocation must be a string').trim().notEmpty().withMessage('endLocation cannot be empty')),
    reqOrOpt(body('maxClients').isInt({ min: 1 }).withMessage('maxClients must be an integer >= 1')),
  ];

  // Return a single middleware that runs the rules and handles errors
  return async (req, res, next) => {
    await Promise.all(rules.map((r) => r.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }
    next();
  };
};

/** Schema-level validators (for Mongoose) */
export const dateValidator = function (value) {
  try {
    const start = new Date(value);
    const min = new Date();
    min.setDate(min.getDate() + 15);
    return start >= min;
  } catch {
    return false;
  }
};

export const checkEndDate = function (endDate) {
  try {
    const end = new Date(endDate);
    const start = new Date(this.startDate);
    return end > start;
  } catch {
    return false;
  }
};
