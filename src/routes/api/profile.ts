import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import passport from 'passport';

import { Profile } from './../../models/Profile';
import { User } from '../../models/User';

const router = Router();

interface ProfileErrors {
  noProfile?: string
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
    .then((profile: Profile) => {
      if (!profile) {
        errors.noProfile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

Profile
User

export default router;