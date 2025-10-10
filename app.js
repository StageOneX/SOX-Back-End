require('dotenv').config();
const express = require('express');
const sequelize = require('./util/db'); // Using 'sequelize' consistently

// --- ROUTER IMPORTS ---
const userRouters = require('./routes/user_router');
const eventRouters = require('./routes/event_router'); // 1. Added event router

// --- MODEL IMPORTS ---
require('./models/user');
require('./models/attendee');
require('./models/admin');
require('./models/event'); // 2. CRITICAL FIX: Added the event model import

const app = express();

// --- MIDDLEWARE ---
app.use(express.json());

// --- ROUTES ---
app.use('/users', userRouters);
app.use('/events', eventRouters); // 3. Added the event routes

// --- TEST ROUTE ---
app.get('/', async (req, res) => {
    try {
        // Use 'sequelize' here to be consistent
        const result = await sequelize.query('SELECT NOW()');
        res.json({ time: result[0][0] });
    } catch (err) {
        console.error(err);
        res.status(500).send("DB Error");
    }
});

const PORT = process.env.PORT || 3000;

// ✅ Sync all models and then start the server
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ All models synced to the database');
    // 4. Server is started only ONCE, here, after the DB sync is successful
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to sync models to DB:', err);
  });