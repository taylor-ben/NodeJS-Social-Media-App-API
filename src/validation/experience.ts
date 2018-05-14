import { Experience, ExperienceInput } from './../models/Profile';
import Validator from 'validator';
import { Input } from '../models/Form';
import { isEmpty } from './is-empty';
export function validateExperienceInput(input: ExperienceInput) {
  
  const errors: ExperienceInput = {};

  input.title = isEmpty(input.title) ? '' : input.title;
  input.from = isEmpty(input.from) ? '' : input.from;
  input.countriesVisited = isEmpty(input.countriesVisited) ? '' : input.countriesVisited;

  if (Validator.isEmpty(input.title)) errors.title = 'Title field is required';
  if (Validator.isEmpty(input.from)) errors.from = 'From date field is required';
  if (Validator.isEmpty(input.countriesVisited)) errors.countriesVisited = 'Countries visited field is required';
  
  return {
    errors,
    isValid: isEmpty(errors)
  }
}