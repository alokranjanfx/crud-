const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userdb', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Define User schema
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  address: {
    country: String,
    state: String,
    city: String,
  },
  qualification: {
    tenthPercentage: Number,
    twelfthPercentage: Number,
    graduationPercentage: Number,
  },
  department: String,
});

const User = mongoose.model('User', userSchema);

app.use(cors());
app.use(bodyParser.json());

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new user
app.post('/api/users', async (req, res) => {
  const userData = req.body;
  try {
    const newUser = new User(userData);
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a user by ID
app.put('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  const userData = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a user by ID
app.delete('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
