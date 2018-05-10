import validator from 'validator';
import { Input } from '../models/Form';
import { isEmpty } from './is-empty';
export function validateLoginInput(input: Input) {
  
  const errors: Input = {};

  input.email = isEmpty(input.email) ? '' : input.email;
  input.password = isEmpty(input.password) ? '' : input.password;

  if (!validator.isEmail(input.email)) errors.email = 'Email is invalid';

  if (validator.isEmpty(input.email)) errors.email = 'Email field is required';
  if (validator.isEmpty(input.password)) errors.password = 'Password field is required';
  
  return {
    errors,
    isValid: isEmpty(errors)
  }
}