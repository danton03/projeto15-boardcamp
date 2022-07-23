import joi from 'joi';

const categorySchema = joi.object({
  name: joi.string().trim().min(1).required(),
});

export {categorySchema};