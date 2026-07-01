const { Rating, User, Store } = require('../models');

const createRating = async (req, res) => {
  try {
    const rating = await Rating.create(req.body);
    res.status(201).json(rating);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getRatings = async (req, res) => {
  try {
    const ratings = await Rating.findAll({ include: [User, Store] });
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRatingById = async (req, res) => {
  try {
    const rating = await Rating.findByPk(req.params.id, { include: [User, Store] });
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    res.json(rating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRating = async (req, res) => {
  try {
    const rating = await Rating.findByPk(req.params.id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    await rating.update(req.body);
    res.json(rating);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteRating = async (req, res) => {
  try {
    const rating = await Rating.findByPk(req.params.id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    await rating.destroy();
    res.json({ message: 'Rating deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRating,
  getRatings,
  getRatingById,
  updateRating,
  deleteRating,
};
