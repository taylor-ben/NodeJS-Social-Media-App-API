import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  owner: {type: Schema.Types.ObjectId,ref: 'users'},
  text: {type: String, required: true},
  name: {type: String},
  avatar: {type: String},
  date: {type: Date, default: Date.now},
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  comments: [
    {
      owner: {type: Schema.Types.ObjectId,ref: 'users'},
      text: {type: String, required: true},
      name: {type: String},
      avatar: {type: String},
      date: {type: Date, default: Date.now}
    }
  ]


});
export const Post = mongoose.model('posts', PostSchema);
export interface Post extends _Comment {
  likes: UserRef[];
  comments: _Comment[];
}
export interface _Comment {
  owner: string;
  text: string;
  name?: string;
  avatar?: string;
  date?: Date;
}
interface UserRef {
  user: string
}

export interface MongoosePost extends Post, mongoose.Document {

}