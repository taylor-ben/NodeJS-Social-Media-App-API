import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {type: Schema.Types.ObjectId,ref: 'users'},
  handle: {type: String, required: true, max: 40},
  currentCountry: {type: String,},
  website: {type: String,},
  location: {type: String,},
  status: {type: String, required: true},
  countriesVisited: {type: [String], required: true},
  bio: {type: String,},
  githubusername: {type: String,},
  experience: [
    {
      title: {type: String, required: true},
      description: {type: String},
      from: {type: Date, required: true},
      to: {type: Date},
      current: {type: Boolean, default: false},
      countriesVisited: {type: [String], required: true},
    }
  ],
  education: [
    {
      school: {type: String, required: true},
      degree: {type: String, required: true},
      fieldofstudy: {type: String, required: true},
      from: {type: Date, required: true},
      to: {type: Date},
      current: {type: Boolean,default: false},
      description: {type: String},
    }
  ],
  social: {
    youtube: {type: String},
    twitter: {type: String},
    facebook: {type: String},
    linkedin: {type: String},
    instagram: {type: String}
  },
  date: {type: Date, default: Date.now}
});
export const Profile = mongoose.model('profile', ProfileSchema);
export interface Profile {
  noProfile?: string;
  user?: string;
  handle?: string;
  status?: string;
  currentCountry?: string;
  website?: string;
  location?: string;
  bio?: string;
  githubusername?: string;
  countriesVisited?: string[] | string;
  experience?: Experience[];
  education?: Education[];
  social?: SocialLinks;
  date?: Date;
}
export interface ExperienceInput  {
  title?: string;
  description?: string;
  from?: string;
  to?: string;
  current?: boolean;
  countriesVisited?: string;
}
export interface Experience {
  title: string;
  description?: string;
  from: Date;
  to?: Date
  current?: boolean;
  countriesVisited: string[];
}
export interface Education {
  school: string;
  degree: string;
  fieldofstudy: string;
  from: Date;
  to?: Date;
  current?: boolean;
  description?: string;
}
export interface SocialLinks {
  youtube?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
}

export interface MongooseProfile extends Profile, mongoose.Document {
  
}

