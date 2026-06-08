import crypto from "crypto";
import User from "../models/User.js";
import Progress from "../models/Progress.js";
import generateToken from "../utils/generateToken.js";
import {
  sendOTPEmail,
  sendPasswordResetEmail,
} from "../services/emailService.js";

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const emailLower = email.toLowerCase();
    const existingUser = await User.findOne({ email: emailLower });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ error: "Email already registered" });
      }
      // User exists but not verified — resend OTP
      const otp = generateOTP();
      existingUser.otpCode = otp;
      existingUser.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      existingUser.name = name;
      existingUser.password = password;
      await existingUser.save();

      try {
        await sendOTPEmail(existingUser.email, otp);
      } catch (e) {
        console.error("Email failed:", e.message);
      }

      return res.json({
        message: "OTP sent to your email",
        requiresVerification: true,
        userId: existingUser._id,
        email: existingUser.email,
      });
    }

    // Create new user
    const otp = generateOTP();
    const user = new User({
      name,
      email: emailLower,
      password,
      otpCode: otp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000),
    });

    await user.save();

    // Create progress record
    await new Progress({ userId: user._id }).save();

    // Send OTP email
    try {
      await sendOTPEmail(user.email, otp);
    } catch (e) {
      console.error("Email failed:", e.message);
    }

    res.status(201).json({
      message: "Verification code sent to your email",
      requiresVerification: true,
      userId: user._id,
      email: user.email,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

// POST /api/auth/verify-otp
export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "Email already verified" });
    }

    if (!user.otpCode || !user.otpExpires || user.otpExpires < new Date()) {
      return res
        .status(400)
        .json({ error: "OTP expired. Please request a new one." });
    }

    if (user.otpCode !== otp) {
      return res.status(400).json({ error: "Invalid code. Please try again." });
    }

    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      message: "Email verified successfully!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: true,
      },
      token,
    });
  } catch (error) {
    console.error("OTP error:", error);
    res.status(500).json({ error: "Verification failed" });
  }
};

// POST /api/auth/resend-otp
export const resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "Email already verified" });
    }

    const otp = generateOTP();
    user.otpCode = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    try {
      await sendOTPEmail(user.email, otp);
    } catch (e) {
      console.error("Email failed:", e.message);
    }

    res.json({ message: "New code sent to your email" });
  } catch (error) {
    res.status(500).json({ error: "Failed to resend code" });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        error: "Please verify your email first",
        requiresVerification: true,
        userId: user._id,
        email: user.email,
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res
        .status(404)
        .json({ error: "No account found with this email" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (e) {
      console.error("Email failed:", e.message);
      return res
        .status(500)
        .json({ error: "Failed to send email. Please try again." });
    }

    res.json({ message: "Password reset email sent! Check your inbox." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Failed to send reset email" });
  }
};

// POST /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired reset link. Please request a new one.",
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful! Redirecting to login..." });
  } catch (error) {
    res.status(500).json({ error: "Password reset failed" });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -otpCode -otpExpires -resetPasswordToken -resetPasswordExpires",
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to get user" });
  }
};
// PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }
    req.user.name = name.trim();
    await req.user.save();
    res.json({
      message: "Profile updated",
      user: { name: req.user.name, email: req.user.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// PUT /api/auth/change-password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Both passwords are required" });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "New password must be at least 6 characters" });
    }
    const isMatch = await req.user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }
    req.user.password = newPassword;
    await req.user.save();
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to change password" });
  }
};
