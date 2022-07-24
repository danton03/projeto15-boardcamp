import joi from 'joi';
import joiExtension from "@joi/date";

const Joi = joi.extend(joiExtension);

const customerSchema = joi.object({
  name: joi.string().trim().min(1).required(),
  phone: joi.string().pattern(/[0-9]{10,11}/).required(),
  cpf: joi.string().pattern(/[0-9]{11}/).required(),
  birthday: Joi.date().format('YYYY-MM-DD').max('now').required()
});

export { customerSchema };