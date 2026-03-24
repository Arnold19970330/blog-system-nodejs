const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../midlewares/auth');

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

//post bekuldese utvonal
router.post('/', auth.protect, postController.createPost);
router.patch('/:id', auth.protect, postController.updatePost);
router.delete('/:id', auth.protect, postController.deletePost);

module.exports = router;