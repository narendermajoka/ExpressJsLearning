const { validationResult } = require('express-validator');
const Post = require('../models/post');
const user = require('../models/user');
const User = require('../models/user');

const fileUtility = require('../utils/file-utility');

exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalPosts;
    Post.find().countDocuments()
        .then(count => {
            totalPosts = count;
            return Post.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        })
        .then(posts => {
            res.status(200).json({
                message: '',
                totalPosts: totalPosts,
                posts: posts
            });
        })
        .catch(err => next(err));
};

exports.createPost = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('data validation failed!');
        error.statusCode = 422;
        throw error;
    }

    if (!req.file) {
        const error = new Error('No Image Provided');
        error.statusCode = 422;
        throw error;
    }

    const imageUrl = req.file.path;
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imageUrl: imageUrl,
        creator: req.userId
    });

    post.save()
        .then(post => {
            return User.findById(req.userId);
        })
        .then(user => {
            user.posts.push(post);
            return user.save();
        })
        .then(result => {
            return res.status(201).json({
                message: 'Post created successfully!'
            })
        })
        .catch(err => next(err));
};

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Post not found.');
                error.statusCode = 404;
                throw error; //this error will go to catch block below
            }
            return res.json({ message: 'Post Fetched', post: post });
        })
        .catch(err => {
            const error = new Error('Unable to fetch post from db');
            error.statusCode = 404;
            next(error);
        });
};

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    return Post.findById(postId)
        .then(post => {
            if (!post) {
                const err = new Error('Post not found to update');
                err.statusCode = 404;
                throw err;
            }
            if(post.creator.toString() !== req.userId.toString()){
                const err = new Error('Not Authorized to update post');
                err.statusCode = 403;
                throw err;
            }
            if (req.file) {
                post.imageUrl = req.file.path;
            }
            post.title = req.body.title;
            post.content = req.body.content;
            return post.save()
                .then(post => {
                    res.status(200).json({ 'message': 'Post Updated Successfully', post: post });
                })
                .catch(err => next(err));
        })
        .catch(err => next(err));
};

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    return Post.findById(postId)
        .then(post => {
            if (!post) {
                const err = new Error('Post not found to delete');
                err.statusCode = 404;
                throw err;
            }
            if(post.creator.toString() !== req.userId.toString()){
                const err = new Error('Not Authorized to update post');
                err.statusCode = 403;
                throw err;
            }
            fileUtility.deleteFile(post.imageUrl);
            return post.deleteOne({ _id: postId });
        })
        .then(() => {
            return User.findById(req.userId);
        })
        .then(user=>{
            user.posts.pull(postId);
            return user.save();
        })
        .then(result=>{
            return res.status(200).json({ 'message': 'Post deleted successfully' });
        })
        .catch(err => next(err));
};