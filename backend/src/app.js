const express = require('express');
const cors = require('cors');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes'); 
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// app.js
app.get('/', (req, res) => {
  res.status(200).send('A szerver köszöni, jól van! 🚀');
});

app.set('json spaces', 2);

app.use('/posts', postRoutes);
app.use('/auth', userRoutes); // 👈 Ezt is add hozzá!
app.use('/categories', categoryRoutes);

module.exports = app;