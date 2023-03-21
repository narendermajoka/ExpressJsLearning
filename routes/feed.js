const express = require('express');
const feedController = require('../controllers/feed');
const feedValidator = require('../validators/feed-validator');

const router = express.Router();

router.get('/posts',feedController.getPosts);

router.post('/post', feedValidator.createPost, feedController.createPost)

router.get('/posts/:postId',feedController.getPost);

router.put('/posts/:postId', feedValidator.createPost, feedController.updatePost);

router.delete('/posts/:postId', feedController.deletePost);

module.exports = router;