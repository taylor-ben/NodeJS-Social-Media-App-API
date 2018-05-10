import { User } from './../models/User';
import { secretOrKey } from './keys';
import mongoose from 'mongoose';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { PassportStatic } from 'passport';


const User = mongoose.model('users')
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey
};

export function passportConfig(passport: PassportStatic) {
  passport.use(
    new JwtStrategy(options, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => done(null, user || false))
        .catch(err => console.error(err));
    })
  )
}
