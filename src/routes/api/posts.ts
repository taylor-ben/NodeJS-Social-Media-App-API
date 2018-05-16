import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import passport from 'passport';

import { Post, MongoosePost, _Comment } from './../../models/Post';
import { validatePostInput } from '../../validation/posts';

const router = Router();

// @route   GET api/posts/test
// @action  tests posts route
// @access  Public
router.get('/test', (req: Request, res: Response) => res.json({msg: 'Posts Works'}));

// @route   POST api/posts
// @action  Create a post
// @access  Private
router.post('/', passport.authenticate('jwt', {session: false}), (req: Request, res: Response) => {

  const { errors, isValid } = validatePostInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newPost: _Comment = {
    owner: req.user.id,
    name: req.user.name,
    avatar: req.user.avatar,
    text: req.body.text
  }
  const mongoosePost = new Post(newPost);

  mongoosePost.save()
    .then((post: MongoosePost) => res.json(post))
    .catch(err => res.status(404).json(err))
});

// @route   GET api/posts/
// @action  get posts
// @access  Public
router.get('/', (req: Request, res: Response) => {
  Post.find()
    .sort({date: -1})
    .then((posts: MongoosePost[]) => res.json(posts))
    .catch(err => res.status(404).json({noPosts: 'ERROR: not found'}));
});

// @route   GET api/posts/:post_id
// @action  get post by id
// @access  Public
router.get('/:post_id', (req: Request, res: Response) => {
  Post.findById(req.params.post_id)
    .then((post: MongoosePost) => res.json(post))
    .catch(err => res.status(404).json({noPost: 'No post found with that ID'}));
});

// @route   DELETE api/posts/:post_id
// @action  delete post by id
// @access  Private
router.delete('/:post_id', passport.authenticate('jwt', {session: false}), (req: Request, res: Response) => {

  Post.findById(req.params.post_id)
    .then((post: MongoosePost) => {
      const postOwnerID = post.owner;
      const deleteRequestUserID = req.user.id;
      if (postOwnerID == deleteRequestUserID) {
        // delete post
        post.remove().then(() => res.json({success: true, msg: 'Post deleted'}))
      } else {
        res.status(401).json({notOwner: 'User is not the owner of this post'})
      }
    })
    .catch(err => res.status(404).json({noPost: 'No post found with that ID'}));
});

// @route   POST api/posts/like/:post_id
// @action  Like a post
// @access  Private
router.post('/like/:post_id', passport.authenticate('jwt', {session: false}), (req: Request, res: Response) => {

  Post.findById(req.params.post_id)
    .then((post: MongoosePost) => {

      const likeIndex = post.likes.findIndex(like => like.user == req.user.id);
      
      const likeNotFound = likeIndex == -1;
      if (likeNotFound) {
        post.likes.unshift({user: req.user.id});
        post.save().then(() => res.json({success: true}));
      } else {
        return res.status(400).json({alreadyLike: 'User already like this post'})
      }
    })
    .catch(err => res.status(404).json({noPost: 'No post found with that ID'}));
});
// @route   DELETE api/posts/like/:post_id
// @action  Remove like
// @access  Private
router.delete('/like/:post_id', passport.authenticate('jwt', {session: false}), (req: Request, res: Response) => {

  Post.findById(req.params.post_id)
    .then((post: MongoosePost) => {

      const likeIndex = post.likes.findIndex(like => like.user == req.user.id);
      
      const likeNotFound = likeIndex == -1;
      if (likeNotFound) {
        return res.status(404).json({noLike: 'No like by this user'})
      } else {
        post.likes.splice(likeIndex, 1);
        post.save().then(() => res.json({success: true}));
      }
    })
    .catch(err => res.status(404).json({noPost: 'No post found with that ID'}));
});

// @route   POST api/posts/comment/:post_id
// @action  Comment on a post
// @access  Private
router.post('/comment/:post_id', passport.authenticate('jwt', {session: false}), (req: Request, res: Response) => {
  
  const { errors, isValid } = validatePostInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Post.findById(req.params.post_id)
    .then((post: MongoosePost) => {

      const newComment: _Comment = {
        owner: req.user.id,
        name: req.user.name,
        avatar: req.user.avatar,
        text: req.body.text
      }
      post.comments.push(newComment);
      post.save().then(() => res.json({success: true}))
        .catch(err => res.json(err));
    })
    .catch(err => res.status(404).json({noPost: 'No post found with that ID'}));
});

// @route   DELETE api/posts/comment/:post_id/:comment_id
// @action  Delete a comment
// @access  Private
router.delete('/comment/:post_id/:comment_id', passport.authenticate('jwt', {session: false}), (req: Request, res: Response) => {

  Post.findById(req.params.post_id)
    .then((post: MongoosePost) => {

      const commentIndex = post.comments.findIndex((comment: MongoosePost) => comment.id == req.params.comment_id);

      if (commentIndex == -1) {
        return res.status(404).json({noComment: 'No comment found with that ID'});
      }

      const commentToDelete = post.comments[commentIndex];
      if (commentToDelete.owner == req.user.id) {
        post.comments.splice(commentIndex);
        post.save().then(() => res.json({success: true}))
          .catch(err => res.json(err));
      } else {
        res.status(401).json({notOwner: 'User is not the owner of this comment'})
      }
    })
    .catch(err => res.status(404).json({noPost: 'No post found with that ID'}));
});


export default router;