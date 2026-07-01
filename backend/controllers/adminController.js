const { User, Store, Rating } = require('../models');
const { Sequelize } = require('sequelize');

const addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ name, email, password, address, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;
    const store = await Store.create({ name, email, address, owner_id });
    res.status(201).json(store);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const { sortBy = 'name', sortOrder = 'ASC', name, email, address, role } = req.query;
    const where = {};
    if (name) where.name = { [Sequelize.Op.like]: `%${name}%` };
    if (email) where.email = { [Sequelize.Op.like]: `%${email}%` };
    if (address) where.address = { [Sequelize.Op.like]: `%${address}%` };
    if (role) where.role = role;
    const users = await User.findAll({
      where,
      order: [[sortBy, sortOrder]],
      include: { model: Store, as: 'Stores', include: { model: Rating, as: 'Ratings' } }
    });
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getStores = async (req, res) => {
  try {
    const { sortBy = 'name', sortOrder = 'ASC', name, email, address } = req.query;
    const where = {};
    if (name) where.name = { [Sequelize.Op.like]: `%${name}%` };
    if (email) where.email = { [Sequelize.Op.like]: `%${email}%` };
    if (address) where.address = { [Sequelize.Op.like]: `%${address}%` };
    const stores = await Store.findAll({
      where,
      include: { model: User, as: 'User' },
      order: [[sortBy, sortOrder]],
    });
    res.json(stores);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addUser,
  addStore,
  getDashboard,
  getUsers,
  getStores,
};
