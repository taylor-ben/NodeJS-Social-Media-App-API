import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {type: Schema.Types.ObjectId,ref: 'users'},
  text: {type: String, required: true},
  name: {type: String},
  avatar: {type: String},
  date: {type: Date, default: Date.now},
  likes: [
    {
      user: {type: Schema.Types.ObjectId,ref: 'users'}
    }
  ],
  comments: [
    {
      user: {type: Schema.Types.ObjectId,ref: 'users'},
      text: {type: String, required: true},
      name: {type: String},
      avatar: {type: String},
      date: {type: Date, default: Date.now}
    }
  ]


});
export const Post = mongoose.model('post', PostSchema);
export interface Post extends _Comment {
  likes: string[];
  comments: _Comment[];
}
export interface _Comment {
  user: string;
  text: string;
  name?: string;
  avatar?: string;
  date?: Date;
}

export interface MongoosePost extends Post, mongoose.Document {

}