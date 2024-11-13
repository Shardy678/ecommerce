const express = require("express");
const stripe = require("stripe")(
  "sk_test_51QJuYEJj5OvhYSRkWyLYNnFEgCYqf60MzZgxBWyVk2TrCNsodSb9r0Q9wuq1Ac97GsPcRo2E7XvhkwjuGmIH57y100swAUZtXn"
);
const mongoose = require("mongoose");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const cors = require("cors");
mongoose.connect("mongodb://127.0.0.1:27017/test");

const Cat = mongoose.model("Cat", { name: String });

const kitty = new Cat({ name: "Zildjian" });
kitty.save().then(() => console.log("meow"));
const app = express();
const port = 3000;
const JWT_SECRET = "mysecret";

const MY_DOMAIN = `http://localhost:${port}`;

app.use(express.json());
app.use(cors());

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).send("Token is required");
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send("Invalid token");
    }
    req.user = decoded;
    next();
  });
};

const authorize = (role) => (req, res, next) => {
  try {
    const userRole = req.user.role;
    if (userRole !== role) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

app.get("/", (req, res) => {
  res.redirect("/create-checkout-session");
});

app.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }
  const newUser = new User({ username, password, role });
  await newUser.save();
  const token = jwt.sign({ username, role }, JWT_SECRET);
  res.json({ token });
});

app.post("/login", async (req, res) => {
  const { username, password, role } = req.body;
  const user = await User.findOne({ username });
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ username, role }, JWT_SECRET);
  res.json({ token });
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { priceId } = req.body;
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${MY_DOMAIN}/success`,
      cancel_url: `${MY_DOMAIN}?canceled=true`,
    });
    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

app.post("/admin-only", verifyToken, authorize("admin"), (req, res) => {
  res.json({ message: "This is an admin-only route" });
});

app.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/success", (req, res) => {
  res.send("successfull!!!!");
});

app.get("/products", async (req, res) => {
  try {
    const products = await stripe.products.list({});
    res.json(products);
  } catch (error) {
    console.error(error);
  }
});

app.get("/products/search/:name", async (req, res) => {
  try {
    const productName = req.params.name;
    const products = await stripe.products.search({
      query: `name:'${productName}'`,
    });
    res.json(products);
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
