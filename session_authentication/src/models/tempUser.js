import { DataTypes } from 'sequelize';
import sequelize from '../config/database.config.js';

const TempUser = sequelize.define('TempUser', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    firstVisit: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
});

export default TempUser;
