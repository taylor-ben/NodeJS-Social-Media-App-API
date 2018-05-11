import { isEmpty } from './../../validation/is-empty';
import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import passport from 'passport';

import { Profile } from './../../models/Profile';
import { User } from '../../models/User';

const router = Router();

interface ProfileErrors {
  noProfile?: string;
  handle?: string;
  status?: string;
  skills?: string;
}

// @route   GET api/profile/test
// @action  tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({msg: 'Profile Works'}));

// @route   GET api/profile
// @action  Get current users profile
// @access  Private
router.get('/', passport.authenticate('jwt', {session: false}), (req: Request, res: Response) => {
  const errors: ProfileErrors = {};

  Profile.findOne({user: req.user.id})
    .then(profile => {
      if (!profile) {
        errors.noProfile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   POST api/profile
// @action  Create profile
// @access  Private
router.get('/', passport.authenticate('jwt', {session: false}), (req: Request, res: Response) => {
  const errors: ProfileErrors = {};

  if (!req.body.handle) errors.handle = 'Handle field is required';
  if (!req.body.status) errors.status = 'Status field is required';
  if (!req.body.skills) errors.skills = 'Skills field is required';
  if (!isEmpty(errors)) return res.status(400).json(errors);

  // get fields
  const profileFields: Profile = {
    user: req.user.id,
    handle: req.body.handle,
    status: req.body.status,
    skills: req.body.skills
  };

  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

});


export default router;