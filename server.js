require("dotenv").config(); // for loading environment variables from .env file
const express = require("express"); // used express library for creating server
const mongoose = require("mongoose"); // using mongoose library for the MongoDB connection
const cors = require("cors");  
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "frontend")));
app.use("/public", express.static(path.join(__dirname, "public")));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/crumblab")
    .then(() => console.log(" MongoDB connected to 'crumblab' database"))
    .catch(err => console.error("MongoDB connection error:", err));

// Product Schema 
const productSchema = new mongoose.Schema({
    id: Number,
    name: String,
    price: Number,
    category: {
        type: String,
        enum: ['Cake', 'Cupcakes', 'Donuts'], 
        default: 'Cake'
    },
    description: String
});
const Product = mongoose.model("Product", productSchema);

// Contact Form Schema
const contactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Contact = mongoose.model("Contact", contactSchema);

// Cart Schema
const cartSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        },
        price: Number, 
        name: String 
    }],
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 
    }
});

const Cart = mongoose.model("Cart", cartSchema);

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "Home.html"));
});

app.get("/product.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "products.html"));
});
app.get("/cart_add.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "cart_add.html"));
});

app.get("/add.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "add.html"));
});

app.get("/update.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "update.html"));
});

app.get("/delete.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "delete.html"));
});

// Contact Form Route
app.post("/contact", async (req, res) => {
    try {
        console.log("Received contact form data:", req.body);
        
        const { firstName, lastName, email, message } = req.body;

        // Validate data
        if (!firstName || !lastName || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        
        const newContact = new Contact({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            message: message.trim()
        });

        // Save to database
        const savedContact = await newContact.save();
        console.log("Contact saved to database with ID:", savedContact._id);

        res.status(200).json({
            success: true,
            message: "Contact form submitted successfully!",
            data: {
                id: savedContact._id,
                firstName: savedContact.firstName,
                lastName: savedContact.lastName,
                email: savedContact.email,
                createdAt: savedContact.createdAt
            }
        });

    } catch (error) {
        console.error("Error saving contact form:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
});

// Get all contacts
app.get("/contacts", async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching contacts"
        });
    }
});

// Get contact by ID
app.get("/contacts/:id", async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }
        res.json({
            success: true,
            data: contact
        });
    } catch (error) {
        console.error("Error fetching contact:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching contact"
        });
    }
});

// to get all products
app.get("/products", (req, res) => {
    Product.find({})
        .sort({ id: 1 })
        .then(products => res.json(products))
        .catch(err => res.status(500).json({ error: err.message }));
});

// to get a product by specific id
app.get("/products/:id", (req, res) => {
    Product.findOne({ id: req.params.id })
        .then(product => {
            if (!product) return res.json({ message: "Product not found" });
            res.json(product);
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// to add a product
app.post("/products", (req, res) => {
    const newProduct = new Product({
        id: Number(req.body.id),
        name: req.body.name,
        price: Number(req.body.price),
        category: req.body.category,
        description: req.body.description || ""
    });

    newProduct.save()
        .then(() => res.send("Product added successfully"))
        .catch(err => res.status(500).json({ error: err.message }));
});

// to update a product
app.post("/products/update", (req, res) => {
    const updateData = {};

    if (req.body.name) {
        updateData.name = req.body.name;
    }
    if (req.body.price) {
        updateData.price = Number(req.body.price);
    }
    if (req.body.category) {
        updateData.category = req.body.category;
    }
    if (req.body.description) {
        updateData.description = req.body.description;
    }

    Product.findOneAndUpdate(
        { id: Number(req.body.id) },
        { $set: updateData },
        { new: true }
    )
        .then(doc => {
            if (!doc) return res.send("Product not found");
            res.json(doc);
        })
        .catch(err => res.send("Error updating product"));
});

// to delete a product
app.post("/products/delete", (req, res) => {
    Product.findOneAndDelete({ id: req.body.id })
        .then(doc => {
            if (!doc) return res.json({ message: "Product not found" });
            res.json(doc);
        })
        .catch(err => res.send("Error deleting product"));
});

// Cart Route
app.get("/cart/:sessionId", async (req, res) => {
    try {
        const cart = await Cart.findOne({ sessionId: req.params.sessionId });
        if (!cart) return res.json({ items: [] }); // Empty cart
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/cart/add", async (req, res) => {
    try {
        const { sessionId, productId, name, price, quantity } = req.body;

        let cart = await Cart.findOne({ sessionId });

        if (!cart) {
            // create new cart
            cart = new Cart({
                sessionId,
                items: []
            });
        }

        // check if product already exists
        const existingItem = cart.items.find(
            item => item.productId.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity || 1;
        } else {
            cart.items.push({
                productId,
                name,
                price,
                quantity: quantity || 1
            });
        }

        await cart.save();

        console.log("Cart updated in DB:", cart);

        res.json({ message: "Item added to cart successfully!" });
    } catch (err) {
        console.log("Cart error:", err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3003; 

// creating server
app.listen(PORT, () => {
    console.log("Server running: http://localhost:3003");
});

module.exports = app;