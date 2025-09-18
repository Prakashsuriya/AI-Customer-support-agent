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
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
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
