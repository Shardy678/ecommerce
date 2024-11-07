const express = require('express')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
mongoose.connect('mongodb://127.0.0.1:27017/test');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'user'] }
  });

const User = mongoose.model('User', userSchema);
const Cat = mongoose.model('Cat', { name: String });

const kitty = new Cat({ name: 'Zildjian' });
kitty.save().then(() => console.log('meow'));
const app = express()
const port = 3000
const JWT_SECRET = 'mysecret'

app.use(express.json());

const verifyToken = (req,res,next) => {
    const token = req.headers['authorization']?.split(' ')[1]

    if (!token) {
        return res.status(403).send('Token is required')
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid token')
        }
        req.user = decoded
        next()
    })
}

const authorize = (role) => (req, res, next) => {
    try {
      const userRole = req.user.role
      if (userRole !== role) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
  };  
  
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }
    const newUser = new User({ username, password, role });
    await newUser.save();
    const token = jwt.sign({ username, role }, JWT_SECRET);
    res.json({ token });
})

app.post('/login', async (req, res) => {
    const { username, password, role } = req.body;
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ username, role }, JWT_SECRET);
    res.json({ token });
})

app.post('/admin-only', verifyToken, authorize('admin'), (req,res) => {
    res.json({ message: 'This is an admin-only route' });
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
