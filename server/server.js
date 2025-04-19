// ✅ Imports
import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt'; // 🔐 For hashing passwords
import User from './Schema/User.js'; // 🧠 User model (from Schema)
import { nanoid } from 'nanoid'; // 🆔 For generating unique usernames
import jwt from 'jsonwebtoken'; // 🔐 For access token
import cors from 'cors';

const server = express();
const PORT = 5000;

// ✅ Regex Validation
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

// ✅ Middleware
server.use(express.json());
server.use(cors({
    origin: 'http://localhost:5173', // 🟡 Frontend origin
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true
}));

// ✅ MongoDB Connection
mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.log("❌ MongoDB connection error:", err));

// ✅ Utility: Format data for frontend
const formatDatatoSend = (user) => {
    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_KEY); // 🔐 JWT created
    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    };
};

// ✅ Utility: Create unique username from email
const generateUsername = async (email) => {
    let username = email.split("@")[0];
    const isTaken = await User.exists({ "personal_info.username": username });
    if (isTaken) username += nanoid().substring(0, 5); // 🧠 add random string
    return username;
};

////////////////////////////////////////////////////
// ✅ SIGNUP Route (Validation + Hashing + Save)
////////////////////////////////////////////////////

server.post('/signup', (req, res) => {
    const { fullname, email, password } = req.body;

    // ✅ Validation
    if (fullname.length < 3) {
        return res.status(403).json({ error: "Fullname must be at least 3 letters long" });
    }
    if (!email.length || !emailRegex.test(email)) {
        return res.status(403).json({ error: "Enter a valid email" });
    }
    if (!passwordRegex.test(password)) {
        return res.status(403).json({
            error: "Password must be 6-20 characters, with at least 1 uppercase, 1 lowercase, and 1 number"
        });
    }

    // ✅ Hash password using bcrypt
    bcrypt.hash(password, 10, async (err, hashed_password) => {
        if (err) return res.status(500).json({ error: "Hashing failed" });

        const username = await generateUsername(email); // 🔁 Generate username

        // ✅ Save user to DB
        const user = new User({
            personal_info: {
                fullname,
                email,
                password: hashed_password, 
                username
            }
        });

        user.save()
            .then(u => res.status(200).json(formatDatatoSend(u)))
            .catch(err => {
                if (err.code === 11000) {
                    return res.status(500).json({ error: "Email or Username already exists" });
                }
                return res.status(500).json({ error: err.message });
            });
    });
});

////////////////////////////////////////////////////
// ✅ SIGNIN Route (Login)
////////////////////////////////////////////////////

server.post('/signin', (req, res) => {
    const { email, password } = req.body;

    // 🧠 Find user from DB by email
    User.findOne({ "personal_info.email": email })
        .then(user => {
            if (!user) {
                return res.status(403).json({ error: "Email not found" });
            }

            // ✅ Compare entered password with hashed password
            bcrypt.compare(password, user.personal_info.password, (err, result) => {
                if (err) {
                    return res.status(403).json({ error: "Error while login. Try again. " + err });
                }
                if (!result) {
                    return res.status(403).json({ error: "Incorrect password" });
                }

                // ✅ If password matches, return token + user info
                return res.status(200).json(formatDatatoSend(user));
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ error: err.message });
        });
});

// ✅ Start the server
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
