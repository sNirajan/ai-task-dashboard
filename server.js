require('dotenv').config();
const express=require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();


// Middleware

app.use(express.json());    // Parse JSON requests
app.use(cors()); // Enable CORS
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging
app.use('/api/auth', authRoutes); // API URLs

// Test route
app.get('/', (req, res) =>{
    res.send('API is running...');
});

app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Welcome to the protected route!', user: req.user });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));