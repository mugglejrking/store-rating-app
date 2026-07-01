const express = require('express');
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { validateUser } = require('../middleware/validation');

const router = express.Router();

router.post('/', validateUser, createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', validateUser, updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
