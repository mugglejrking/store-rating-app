const { Store, Rating, User } = require('../models');
const { Sequelize } = require('sequelize');

const getDashboard = async (req, res) => {
  try {
    const store = await Store.findOne({ where: { owner_id: req.user.id } });
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    const averageRating = await Rating.findOne({
      where: { store_id: store.id },
      attributes: [[Sequelize.fn('AVG', Sequelize.col('rating_value')), 'averageRating']],
      raw: true,
    });
    res.json({ store, averageRating: averageRating?.averageRating || 0 });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getRatings = async (req, res) => {
  try {
    const store = await Store.findOne({ where: { owner_id: req.user.id } });
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    const ratings = await Rating.findAll({
      where: { store_id: store.id },
      include: { model: User, as: 'User' },
    });
    res.json(ratings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getDashboard,
  getRatings,
};
