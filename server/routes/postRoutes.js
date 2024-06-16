const { Router } = require("express");
const router = Router();
const { createPost, getPost, getPosts, getCatPosts, getUsersPosts, updatePost, deletePost } = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleWare')

router.post('/create', authMiddleware, createPost);
router.get('/:id', getPost);
router.get('/', getPosts);
router.get('/categories/:category', getCatPosts);
router.get('/users/:id', getUsersPosts);
router.patch('/update/:id', authMiddleware, updatePost);
router.delete('/delete/:id', authMiddleware, deletePost);

module.exports = router;