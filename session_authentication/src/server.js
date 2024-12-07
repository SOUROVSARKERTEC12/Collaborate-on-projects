import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import sequelize from './config/database.config.js';

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;
// Start server
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();


// Routes
app.use('/api', routes);



