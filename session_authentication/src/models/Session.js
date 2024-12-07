import { DataTypes } from 'sequelize';
import sequelize from '../config/database.config.js';
import User from "./User.js";

const Session = sequelize.define('Session', {
    id: {
        type: DataTypes.STRING(100),
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

User.hasMany(Session, { foreignKey: 'userId', as: 'session' ,onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Session.belongsTo(User, { foreignKey: 'userId', as: 'user' , onDelete: 'SET NULL', onUpdate: 'CASCADE' });

export default Session;
