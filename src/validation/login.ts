import Validator from 'validator';
import { Input } from '../models/Form';
import { isEmpty } from './is-empty';
export function validateLoginInput(input: Input) {
  
  const errors: Input = {};

  input.email = isEmpty(input.email) ? '' : input.email;
  input.password = isEmpty(input.password) ? '' : input.password;

  if (!Validator.isEmail(input.email)) errors.email = 'Email is invalid';

  if (Validator.isEmpty(input.email)) errors.email = 'Email field is required';
  if (Validator.isEmpty(input.password)) errors.password = 'Password field is required';
  
  return {
    errors,
    isValid: isEmpty(errors)
  }
}