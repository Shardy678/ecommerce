const express = require('express')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
mongoose.connect('mongodb://127.0.0.1:27017/test');

const User = mongoose.model('User', { username: String, password: String });
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

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }
    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign({ username }, JWT_SECRET);
    res.json({ token });
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ username }, JWT_SECRET);
    res.json({ token });
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
