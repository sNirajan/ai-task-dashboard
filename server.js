require('dotenv').config();
const express=require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');

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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));