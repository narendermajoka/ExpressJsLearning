const { validationResult } = require('express-validator');
const post = require('../models/post');
const Post = require('../models/post');
const fileUtility = require('../utils/file-utility');

exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalPosts;
    Post.find().countDocuments()
        .then(count=>{
            totalPosts = count;
            return post.find()
                       .skip((currentPage - 1)*perPage)
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
        creator: { name: req.body.creator }
    });

    post.save()
        .then(result => {
            return res.status(201).json({
                message: 'Post created successfully!',
                post: { id: result._id }
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
            if (req.file) {
                post.imageUrl = req.file.path;
            }
            post.title = req.body.title;
            post.content = req.body.content;
            post.creator = { name: req.body.creator };
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

            fileUtility.deleteFile(post.imageUrl);
            return post.deleteOne({ _id: postId });
        })
        .then(() => {
            res.status(200).json({ 'message': 'Post deleted successfully' });
        })
        .catch(err => next(err))
        .catch(err => next(err));
};