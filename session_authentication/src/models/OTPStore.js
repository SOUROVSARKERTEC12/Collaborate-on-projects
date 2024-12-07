import { DataTypes } from 'sequelize';
import sequelize from '../config/database.config.js';

const OTPStore = sequelize.define('OTPStore', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'The ID of the user associated with the OTP.',
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'The generated OTP code.',
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'The timestamp at which the OTP expires.',
    },
    used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Whether the OTP has been used.',
    },
});

export default OTPStore;
