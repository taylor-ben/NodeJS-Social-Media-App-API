import Validator from 'validator';
import { Input } from '../models/Form';
import { isEmpty } from './is-empty';
export function validateRegisterInput(input: Input) {
  
  const errors: Input = {};

  input.name = isEmpty(input.name) ? '' : input.name;
  input.email = isEmpty(input.email) ? '' : input.email;
  input.password = isEmpty(input.password) ? '' : input.password;
  input.password2 = isEmpty(input.password2) ? '' : input.password2;

  if (!Validator.isLength(input.name, {min:2, max:30}) ) errors.name = 'Name must be between 2 and 30 characters';
  if (!Validator.isEmail(input.email)) errors.email = 'Email is invalid';
  if (!Validator.isLength(input.password, {min:6, max:30})) errors.password = 'Password must be between 6 and 30 characters';
  if (!Validator.equals(input.password, input.password2)) errors.password2 = 'Passwords should match'; 

  if (Validator.isEmpty(input.name)) errors.name = 'Name field is required';
  if (Validator.isEmpty(input.email)) errors.email = 'Email field is required';
  if (Validator.isEmpty(input.password)) errors.password = 'Password field is required';
  if (Validator.isEmpty(input.password2)) errors.password2 = 'Confirm password field is required';
  
  return {
    errors,
    isValid: isEmpty(errors)
  }
}