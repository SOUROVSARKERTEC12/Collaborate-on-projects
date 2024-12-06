import sequelize from '../config/database.config.js';
import User from './User.js';
import Session from './session.js';

// Define associations
User.hasMany(Session, { foreignKey: 'userId' });
Session.belongsTo(User, { foreignKey: 'userId' });

const db = { sequelize, User, Session };

(async () => {
    await sequelize.sync({ force: false });
    console.log('Database synced');
})();

export default db;
