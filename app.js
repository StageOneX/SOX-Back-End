require('dotenv').config();
const express = require('express');
const db = require('./util/db');
const sequelize = require('./util/db'); 


const userRouters = require('./routes/user_router');

require('./models/user');
require('./models/attendee');

require('./models/admin');

const app = express();
app.use(express.json());
app.use('/users', userRouters);

app.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ time: result[0][0] });
    } catch (err) {
        console.error(err);
        res.status(500).send("DB Error");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});// ✅ Sync all models and start server
sequelize.sync({ alter: true }) // change to { force: true } if you want to drop tables and re-create
  .then(() => {
    console.log('✅ All models synced to the database');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to sync models to DB:', err);
  });

