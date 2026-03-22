const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

//post bekuldese utvonal
router.post('/', postController.createPost);
router.delete('/:id', postController.deletePost);

module.exports = router;