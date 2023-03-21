const express = require('express');
const feedController = require('../controllers/feed');
const feedValidator = require('../validators/feed-validator');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/posts', isAuth, feedController.getPosts);

router.post('/post', isAuth,  feedValidator.createPost, feedController.createPost)

router.get('/posts/:postId', isAuth, feedController.getPost);

router.put('/posts/:postId', isAuth, feedValidator.createPost, feedController.updatePost);

router.delete('/posts/:postId', isAuth, feedController.deletePost);

module.exports = router;