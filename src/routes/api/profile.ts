import { isEmpty } from './../../validation/is-empty';
import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import passport from 'passport';

import { Profile, ProfileErrors } from './../../models/Profile';
import { User } from '../../models/User';

const router = Router();

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

  // get fields
  const profileFields: Profile = {
    user: req.user.id,
    handle: req.body.handle,
    status: req.body.status,
    skills: req.body.skills.split(' ').join().split(','),
    social: {}
  };

  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

  // social
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.iq }, 
          { $set: profileFields }, 
          { new: true }
        )
          .then(profile => res.json(profile));
      } else {
        // Create

        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle })
          .then(profile => {
            if (profile) {
              errors.handle = 'That handle already exists';
              res.status(400).json(errors);
            }

            // Save profile
            new Profile(profileFields).save().then(profile => res.json(profile));
          })
      }
    })
});


export default router;