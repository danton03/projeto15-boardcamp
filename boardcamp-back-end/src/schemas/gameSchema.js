import joi from 'joi';

const gameSchema = joi.object({
  name: joi.string().trim().min(1).required(),
  image: joi.string().pattern(/http(s|):\/\/.*\.(png|jpg|jpeg)$/),
  stockTotal: joi.number().min(1).required(),
  categoryId: joi.number().required(),
  pricePerDay: joi.number().min(1).required()
});

export {gameSchema};