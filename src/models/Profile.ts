import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  }
});
export const Profile = mongoose.model('profile', ProfileSchema);
export interface Profile {}