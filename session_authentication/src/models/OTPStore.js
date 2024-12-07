import {DataTypes} from 'sequelize';
import sequelize from '../config/database.config.js';
import User from "./User.js";

const OTPStore = sequelize.define('OTPStore', {
    id: {
        type: DataTypes.STRING(100),
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'The ID of the user associated with the OTP.',
      /*  references: {
            model: User,
            key: 'id',
        },*/
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'The generated OTP code.',
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'The timestamp at which the OTP expires.',
    },
    used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Whether the OTP has been used.',
    },
});

/*User.hasMany(OTPStore, {foreignKey: 'userId', as: 'otp', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
OTPStore.belongsTo(User, {foreignKey: 'userId', as: 'user', onDelete: 'SET NULL', onUpdate: 'CASCADE'});*/

export default OTPStore;
