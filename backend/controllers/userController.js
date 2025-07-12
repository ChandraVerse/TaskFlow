import User from '../models/userModel.js'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const TOKEN_EXPIRES = '24h';

const createToken = (userId) => jwt.sign({ id:userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });

// Register User
export async function registerUser(req, res) {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    if (password.length < 8) {
        return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password: hashed });
        const token = createToken(user._id);

            res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// Login User
export async function loginUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const token = createToken(user._id);
        res.status(200).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// Get User Profile
export async function getUserProfile(req, res) {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId).select("name email");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// Update User Profile
export async function updateUserProfile(req, res) {
    const userId = req.user.id;
    const { name, email, password } = req.body;

    if (!name || !email) {
        return res.status(400).json({ success: false, message: "Name and email are required" });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.name = name;
        user.email = email;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();
        res.status(200).json({ success: true, message: "Profile updated successfully", user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// Update User Password
export async function updateUserPassword(req, res) {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: "Current password and new password are required" });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ success: false, message: "New password must be at least 8 characters long" });
    }

    try {
        const user = await User.findById(userId).select("password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Current password is incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating user password:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}