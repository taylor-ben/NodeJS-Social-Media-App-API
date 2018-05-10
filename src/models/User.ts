import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  }
});
export const User = mongoose.model('users', UserSchema);
export interface User {
  name: string;
  email: string;
  hashedPassword?: string;
  avatar?: string;
  date: Date;
  id?: string;
}