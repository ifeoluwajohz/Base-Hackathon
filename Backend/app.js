require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// CORS Configuration
app.use(cors({
    origin: '*',
    credentials: true
}));


// MongoDB Connection
const DbUrRI = process.env.DB_URI;
mongoose.connect(DbUrRI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err.message));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Error Handling Middleware
app.use((err, req, res, next) => {
    res.status(500).json({ err: err.message });
});

// Routes
const authRoutes = require('./routes/authRoutes');
const userProduct = require('./routes/authProductRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

app.use('/', authRoutes);
app.use('/user', authRoutes);
app.use('/user', userProduct);
app.use('/admin', adminRoutes);

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
