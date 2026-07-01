const sequelize = require('../config/database');
const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

User.hasMany(Store, { foreignKey: 'owner_id', as: 'Stores' });
Store.belongsTo(User, { foreignKey: 'owner_id', as: 'User' });

User.hasMany(Rating, { foreignKey: 'user_id', as: 'Ratings' });
Rating.belongsTo(User, { foreignKey: 'user_id', as: 'User' });

Store.hasMany(Rating, { foreignKey: 'store_id', as: 'Ratings' });
Rating.belongsTo(Store, { foreignKey: 'store_id', as: 'Store' });

module.exports = {
  sequelize,
  User,
  Store,
  Rating,
};
