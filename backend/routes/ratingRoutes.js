const express = require('express');
const {
  createRating,
  getRatings,
  getRatingById,
  updateRating,
  deleteRating,
} = require('../controllers/ratingController');
const { validateRating } = require('../middleware/validation');

const router = express.Router();

router.post('/', validateRating, createRating);
router.get('/', getRatings);
router.get('/:id', getRatingById);
router.put('/:id', validateRating, updateRating);
router.delete('/:id', deleteRating);

module.exports = router;
