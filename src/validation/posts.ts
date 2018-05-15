import Validator from 'validator';
import { PostForm } from '../models/Form';
import { isEmpty } from './is-empty';
export function validatePostInput(input: PostForm) {
  
  const errors: PostForm = {};

  input.text = isEmpty(input.text) ? '' : input.text;

  if (!Validator.isLength(input.text, {min:10, max: 300})) errors.text = 'Post must be between 10 and 300 characters';
  if (Validator.isEmpty(input.text)) errors.text = 'Text field is required';
  
  return {
    errors,
    isValid: isEmpty(errors)
  }
}