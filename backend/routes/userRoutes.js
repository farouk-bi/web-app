const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { getUsers } = require('../controllers/userController');
const { getUserById } = require('../controllers/userController');

router.get('/', protect, adminOnly, getUsers);
router.get('/:id', protect, getUserById);
//router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;