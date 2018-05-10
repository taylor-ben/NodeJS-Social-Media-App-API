import { Router, Request, Response } from "express";
import { default as bcrypt } from "bcryptjs";
import gravatar from "gravatar";
import { default as jwt } from "jsonwebtoken";
import passport from 'passport';

import { User } from "../../models/User";
import { secretOrKey } from './../../config/keys';
import { validateRegisterInput } from '../../validation/register';
import { validateLoginInput } from "../../validation/login";


const router = Router();

// @route   GET api/users/test
// @action  tests users route
// @access  Public
router.get("/test", (req: Request, res: Response) =>
  res.json({ msg: "Users Works" })
);

// @route   GET api/users/register
// @action  Register user
// @access  Public
router.post("/register", (req: Request, res: Response) => {

  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // size
        r: "pg", // for children
        d: "mm" // default
      });

      const user = {
        name: req.body.name,
        email: req.body.email,
        hashedPassword: "",
        avatar
      };

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash: string) => {
          if (err) throw err;
          user.hashedPassword = hash;
          generateUser(user);
        });
      });

      function generateUser(user: object) {
        const newUser = new User(user);
        newUser
          .save()
          .then(() => res.json(newUser))
          .catch(err => console.error(err));
      }
    }
  });
});

// @route   GET api/users/login
// @action  Login User, returning JWT Token
// @access  Private
router.post("/login", (req: Request, res: Response) => {

  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;
  User.findOne({email}, (err, user: User) => {
    if (!user) {
      errors.email = 'User not found'
      return res.status(404).json(errors);
    } else {
      bcrypt.compare(password, user.hashedPassword).then(isMatch => {
        if (isMatch) {
          const { id, name, avatar } = user;
          const payload = {id, name, avatar};
          jwt.sign(
            payload, 
            secretOrKey, 
            {expiresIn: "2 days"}, 
            (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
              })
            }
          );
        } else {
          errors.password = "Password incorrect"
          return res.status(404).json(errors);
        }
      });
    }
  });
});

// @desc return current user
router.get('/current', passport.authenticate('jwt', {session: false}), (req: Request, res: Response) => {
  req.user.hashedPassword = undefined;
  res.json(req.user);
})


export default router;
