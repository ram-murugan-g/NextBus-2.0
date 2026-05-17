import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { db, saveDB } from "../config/db.js";

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET || "nextbus_secret", {
    expiresIn: "7d",
  });

export const signup = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !phone || !password)
      return res.status(400).json({ message: "All fields are required" });

    await db.read();
    const existing = db.data.users.find(
      (u) => u.email === email.toLowerCase() || u.phone === phone,
    );
    if (existing)
      return res
        .status(400)
        .json({ message: "Email or phone already registered" });

    const password_hash = await bcrypt.hash(password, 12);
    const user = {
      id: uuidv4(),
      name,
      email: email.toLowerCase(),
      phone,
      password_hash,
      role: ["user", "driver", "admin"].includes(role) ? role : "user",
      created_at: new Date().toISOString(),
    };
    db.data.users.push(user);
    await saveDB();

    const token = generateToken(user.id);
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    console.log("Login attempt:", req.body);
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    await db.read();
    const bypass = process.env.DEV_AUTH_BYPASS === "true";
    let user = db.data.users.find((u) => u.email === email.toLowerCase());
    console.log("User found:", user);

    // Development bypass: if enabled, accept any credentials temporarily.
    if (!user && bypass) {
      console.warn(
        "DEV_AUTH_BYPASS active: creating temporary user for",
        email,
      );
      const role = email.toLowerCase().includes("driver") ? "driver" : "user";
      user = {
        id: uuidv4(),
        name: email.split("@")[0],
        email: email.toLowerCase(),
        phone: "",
        password_hash: "",
        role,
        created_at: new Date().toISOString(),
      };
    }

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (!bypass) {
      const valid = await bcrypt.compare(password, user.password_hash);
      console.log("Password valid:", valid);
      if (!valid)
        return res.status(401).json({ message: "Invalid credentials" });
    } else {
      console.log("Skipping password check due to DEV_AUTH_BYPASS");
    }

    const token = generateToken(user.id);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    role: req.user.role,
  });
};
