import sequelize from '../config/database.config.js';



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


