import sequelize from '../config/database.config.js';
import User from './User.js';
import Session from './Session.js';
import TempUser from './TempUser.js';
import OTPStore from './OTPStore.js';

// Define associations
// User and Session
User.hasMany(Session, { foreignKey: 'userId', as: 'session' ,onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Session.belongsTo(User, { foreignKey: 'userId', as: 'user' , onDelete: 'SET NULL', onUpdate: 'CASCADE' });

// OTPStore and User
User.hasMany(OTPStore, { foreignKey: 'userId', as: 'otp', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
OTPStore.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

// Include all models in the database object
const db = { sequelize, User, Session, TempUser, OTPStore };

// Sync database
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // Synchronize models
        await sequelize.sync({ force: false }); // Use `alter` to avoid dropping tables
        console.log('Database synced successfully.');
    } catch (error) {
        console.error('Failed to sync database:', error);
    }
})();

export default db;
