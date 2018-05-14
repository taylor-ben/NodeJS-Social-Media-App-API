import Validator from 'validator';
import { Input } from '../models/Form';
import { isEmpty } from './is-empty';
import { Profile } from '../models/Profile';
export function validateProfileInput(input: Profile) {
  
  input.handle = isEmpty(input.handle) ? '' : input.handle;
  input.status = isEmpty(input.status) ? '' : input.status;
  
  const errors: Profile = {};

  if (!Validator.isLength(input.handle, {min:2, max:40}) ) errors.handle = 'Handle must be between 2 and 40 characters';

  if (!isEmpty(input.website)) {
    if (!Validator.isURL(input.website)) errors.website = 'Not a valid URL';
  }
  if (!isEmpty(input.social)) {
    if (!isEmpty(input.social.youtube)) {
      if (!Validator.isURL(input.social.youtube)) errors.social.youtube = 'Not a valid URL';
    }
    if (!isEmpty(input.social.twitter)) {
      if (!Validator.isURL(input.social.twitter)) errors.social.twitter = 'Not a valid URL';
    }
    if (!isEmpty(input.social.facebook)) {
      if (!Validator.isURL(input.social.facebook)) errors.social.facebook = 'Not a valid URL';
    }
    if (!isEmpty(input.social.linkedin)) {
      if (!Validator.isURL(input.social.linkedin)) errors.social.linkedin = 'Not a valid URL';
    }
    if (!isEmpty(input.social.instagram)) {
      if (!Validator.isURL(input.social.instagram)) errors.social.instagram = 'Not a valid URL';
  }
  }

  if (Validator.isEmpty(input.handle)) errors.handle = 'Profile handle field is required';
  if (Validator.isEmpty(input.status)) errors.status = 'Status field is required';
  
  return {
    errors,
    isValid: isEmpty(errors)
  }
}