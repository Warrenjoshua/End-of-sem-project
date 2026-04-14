const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/database');

// Import models to ensure they are registered
require('./models/User');
require('./models/StudyGroup');
require('./models/StudySession');
require('./models/Discussion');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authroutes'));
app.use('/api/groups', require('./routes/grouproutes'));
app.use('/api/sessions', require('./routes/sessionroutes'));
app.use('/api/admin', require('./routes/adminroutes'));

// Connect to MySQL and start server
const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();