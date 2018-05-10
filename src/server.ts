import express from 'express';
import mongoose from "mongoose";
import bodyParser from 'body-parser'
import passport from 'passport';

import users from './routes/api/users';
import profile from './routes/api/profile';
import posts from './routes/api/posts';

import { mongoURI as db } from './config/keys';
import { passportConfig } from './config/passport';

const app = express();

// bodyParser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//  connect to MongoDB
mongoose.connect(db)
  .then(() => console.info('db connected'))
  .catch(err => console.error);

// Passport middleware
app.use(passport.initialize());
// Passport config
passportConfig(passport);

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Server running on port: ' + port));

