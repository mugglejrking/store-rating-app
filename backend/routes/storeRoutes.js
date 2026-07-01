const express = require('express');
const {
  createStore,
  getStores,
  getStoresForUser,
  rateStore,
  getStoreById,
  updateStore,
  deleteStore,
} = require('../controllers/storeController');
const { validateStore, validateRate } = require('../middleware/validation');
const { auth, roleCheck } = require('../middleware/auth');

const router = express.Router();

// Normal User endpoints
router.get('/', auth, roleCheck('normal_user'), getStoresForUser);
router.post('/:id/rate', auth, roleCheck('normal_user'), validateRate, rateStore);
router.put('/:id/rate', auth, roleCheck('normal_user'), validateRate, rateStore);

// Existing endpoints (for other uses)
router.post('/', validateStore, createStore);
router.get('/:id', getStoreById);
router.put('/:id', validateStore, updateStore);
router.delete('/:id', deleteStore);

module.exports = router;
