const express = require('express');
const { addUser, addStore, getDashboard, getUsers, getStores } = require('../controllers/adminController');
const { auth, roleCheck } = require('../middleware/auth');
const { validateUser, validateStore } = require('../middleware/validation');

const router = express.Router();

router.use(auth, roleCheck('admin'));

router.post('/users', validateUser, addUser);
router.post('/stores', validateStore, addStore);
router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.get('/stores', getStores);

module.exports = router;
