'use strict';

const validate = (schema, target = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[target], {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      status: 'fail',
      success: false,
      message: 'Dati non validi',
      errors: error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message,
      })),
    });
  }

  // Express 5 defines req.query as a getter-only on the prototype;
  // use defineProperty to shadow it on the instance.
  Object.defineProperty(req, target, { value, writable: true, configurable: true });
  return next();
};

module.exports = validate;
