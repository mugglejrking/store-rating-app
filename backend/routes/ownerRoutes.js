const express = require('express');
const { getDashboard, getRatings } = require('../controllers/ownerController');
const { auth, roleCheck } = require('../middleware/auth');

const router = express.Router();

router.use(auth, roleCheck('store_owner'));

router.get('/dashboard', getDashboard);
router.get('/ratings', getRatings);

module.exports = router;
