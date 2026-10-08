import { celebrate, Joi } from 'celebrate';

export const registerUserSchema = celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

export const loginUserSchema = celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});
