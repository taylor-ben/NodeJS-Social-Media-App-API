import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import passport from 'passport';

import { isEmpty } from './../../validation/is-empty';
import { Profile, Experience, MongooseProfile } from './../../models/Profile';
import { User } from '../../models/User';
import { validateProfileInput } from '../../validation/profile';
import { validateExperienceInput } from '../../validation/experience';

const router = Router();

// @route   GET api/profile/test
// @action  tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({msg: 'Profile Works'}));

// @route   GET api/profile
// @action  Get this user profile
// @access  Private
router.get('/', passport.authenticate('jwt', {session: false}), (req: Request, res: Response) => {
  const errors: Profile = {};

  Profile.findOne({user: req.user.id})
    .populate('user', ['name', 'avatar'])
    .then((profile: MongooseProfile) => {
      if (profile) {
        res.json(profile);
      } else {
        errors.noProfile = 'Profile not found';
        res.status(404).json(errors);
      }
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/handle/:handle
// @action  Get profile by handle
// @access  Public
router.get('/handle/:handle', (req: Request, res: Response) => {
  const errors: Profile = {};

  Profile.findOne({handle: req.params.handle})
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (profile) {
        res.json(profile);
      } else {
        errors.noProfile = 'Profile not found';
        res.status(404).json(errors);
      }
    }).catch(err => res.status(404).json({noProfile: 'Profile not found'}))
});

// @route   GET api/profile/all
// @action  Get all profiles
// @access  Public
router.get('/all', (req: Request, res: Response) => {
  const errors: Profile = {};

  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then((profiles: MongooseProfile[]) => {
      if (profiles) {
        res.json(profiles);
      } else {
        errors.noProfile = 'There are no profiles';
        res.status(404).json(errors);
      }
    }).catch(err => res.status(404).json({noProfile: 'There are no profiles'}))
});

// @route   GET api/profile/user/:user_id
// @action  Get profile by user id
// @access  Public
router.get('/user/:user_id', (req: Request, res: Response) => {
  const errors: Profile = {};

  Profile.findOne({user: req.params.user_id})
    .populate('user', ['name', 'avatar'])
    .then((profile: MongooseProfile) => {
      if (profile) {
        res.json(profile);
      } else {
        errors.noProfile = 'Profile not found';
        res.status(404).json(errors);
      }
    }).catch(err => res.status(404).json({noProfile: 'Profile not found'}))
});

// @route   POST api/profile
// @action  Create profile
// @access  Private
router.post('/', passport.authenticate('jwt', {session: false}), (req: Request, res: Response) => {

  const { errors, isValid } = validateProfileInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // get fields
  const profileFields: Profile = {
    user: req.user.id,
    handle: req.body.handle,
    status: req.body.status,
    countriesVisited: req.body.countriesVisited.split(' ').join('').split(','),
    social: {}
  };

  if (req.body.currentCountry) profileFields.currentCountry = req.body.currentCountry;
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
    .then((profile: MongooseProfile) => {
      if (profile) {
        console.log('profile:', profile);
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id }, 
          { $set: profileFields }, 
          { new: true }
        )
          .then(updatedProfile => {
            console.log('updatedProfile:', updatedProfile);
            res.json(updatedProfile)
          });
      } else {
        // Create

        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle })
          .then((profile: MongooseProfile) => {
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

// @route   POST api/profile/experience
// @action  Add experience to profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', {session: false}), (req: Request, res: Response) => {

  const { errors, isValid } = validateExperienceInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Profile.findOne({user: req.user.id})
    .then((profile: MongooseProfile) => {
      const newExperience: Experience = {
        title: req.body.title,
        description: req.body.description,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        countriesVisited: req.body.countriesVisited.split(' ').join('').split(','),
      };
  
      profile.experience.unshift(newExperience);
      profile.save().then((profile: MongooseProfile) => res.json(profile))
    })
});

export default router;