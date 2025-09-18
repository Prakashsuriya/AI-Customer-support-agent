const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB Connected Successfully!');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    console.error('Please make sure:');
    console.error('1. Your MongoDB Atlas cluster is running');
    console.error('2. Your IP is whitelisted in MongoDB Atlas');
    console.error('3. Your connection string is correct');
    console.error('4. You have internet connection');
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('AI Customer Support Agent API is running!');
});

// API base endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'AI Customer Support Agent API',
    endpoints: {
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login'
      },
      chat: {
        send: 'POST /api/chat/send',
        history: 'GET /api/chat/history'
      }
    }
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
