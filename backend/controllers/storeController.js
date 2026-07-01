const { Store, User, Rating } = require('../models');
const { Sequelize } = require('sequelize');

const createStore = async (req, res) => {
  try {
    const store = await Store.create(req.body);
    res.status(201).json(store);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getStores = async (req, res) => {
  try {
    const stores = await Store.findAll({ include: { model: User, as: 'User' } });
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStoresForUser = async (req, res) => {
  try {
    const { search } = req.query;
    const where = {};
    if (search) {
      where[Sequelize.Op.or] = [
        { name: { [Sequelize.Op.like]: `%${search}%` } },
        { address: { [Sequelize.Op.like]: `%${search}%` } },
      ];
    }
    
    // First get all stores with their average ratings
    const stores = await Store.findAll({
      where,
      include: [{ model: User, as: 'User' }],
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT AVG(rating_value)
              FROM "Ratings"
              WHERE "Ratings"."store_id" = "Store"."id"
            )`),
            'averageRating'
          ],
        ],
      },
    });
    
    // Then get the user's ratings for all stores
    const userRatings = await Rating.findAll({
      where: { user_id: req.user.id },
    });
    
    // Create a map of user's ratings by store id
    const userRatingMap = {};
    userRatings.forEach(rating => {
      userRatingMap[rating.store_id] = rating.rating_value;
    });
    
    // Add user's rating to each store
    const storesWithUserRatings = stores.map(store => {
      const storeData = store.toJSON();
      return {
        ...storeData,
        userRating: userRatingMap[storeData.id] || null,
      };
    });
    
    res.json(storesWithUserRatings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating_value } = req.body;
    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    const [rating, created] = await Rating.findOrCreate({
      where: { user_id: req.user.id, store_id: id },
      defaults: { rating_value },
    });
    if (!created) {
      rating.rating_value = rating_value;
      await rating.save();
    }
    res.json(rating);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getStoreById = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id, { include: { model: User, as: 'User' } });
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    await store.update(req.body);
    res.json(store);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    await store.destroy();
    res.json({ message: 'Store deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStore,
  getStores,
  getStoresForUser,
  rateStore,
  getStoreById,
  updateStore,
  deleteStore,
};
