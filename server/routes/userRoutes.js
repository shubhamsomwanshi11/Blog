const { Router } = require("express");

const router = Router();

const { registerUser, loginUser, getUser, changeAvatar, updateDetails, getAuthors } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleWare')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/:id', getUser)
router.get('/', getAuthors)
router.post('/change-avatar', authMiddleware, changeAvatar)
router.patch('/edit-user', authMiddleware, updateDetails)

module.exports = router