import { RequestHandler } from "express";
import { AuthService, AuthenticatedRequest } from "../utils/auth";
import {
  AuthRequest,
  AuthResponse,
  VerificationRequest,
  VerificationResponse,
} from "@shared/api";

export const signUpEmail: RequestHandler = async (req, res) => {
  try {
    const { email, password, firstName, lastName }: AuthRequest = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "Email, password, first name, and last name are required",
      } as AuthResponse);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      } as AuthResponse);
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      } as AuthResponse);
    }

    const user = await AuthService.createUser({
      email,
      password,
      firstName,
      lastName,
    });

    const token = AuthService.generateToken({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user,
      token,
    } as AuthResponse);
  } catch (error: any) {
    console.error("Sign up error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create account",
    } as AuthResponse);
  }
};

export const signInEmail: RequestHandler = async (req, res) => {
  try {
    const { email, password }: AuthRequest = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      } as AuthResponse);
    }

    const dbUser = await AuthService.getUserByEmail(email);
    if (!dbUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      } as AuthResponse);
    }

    const isPasswordValid = await AuthService.comparePassword(
      password,
      dbUser.password_hash,
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      } as AuthResponse);
    }

    const user = {
      id: dbUser.id,
      email: dbUser.email,
      phone: dbUser.phone,
      firstName: dbUser.first_name,
      lastName: dbUser.last_name,
      createdAt: dbUser.created_at,
      updatedAt: dbUser.updated_at,
    };

    const token = AuthService.generateToken({
      id: user.id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    res.json({
      success: true,
      message: "Signed in successfully",
      user,
      token,
    } as AuthResponse);
  } catch (error: any) {
    console.error("Sign in error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as AuthResponse);
  }
};

export const sendVerificationCode: RequestHandler = async (req, res) => {
  try {
    const { phone, firstName, lastName }: VerificationRequest = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      } as VerificationResponse);
    }

    // Validate phone format
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format",
      } as VerificationResponse);
    }

    const code = AuthService.generateVerificationCode();
    await AuthService.storeVerificationCode(phone, code);

    const smsMessage = `Your ValuAI verification code is: ${code}. This code expires in 10 minutes.`;
    const smsSent = await AuthService.sendSMS(phone, smsMessage);

    if (!smsSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send verification code. Please try again.",
      } as VerificationResponse);
    }

    res.json({
      success: true,
      message: "Verification code sent successfully",
      codeSent: true,
    } as VerificationResponse);
  } catch (error: any) {
    console.error("Send verification code error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send verification code",
    } as VerificationResponse);
  }
};

export const signUpPhone: RequestHandler = async (req, res) => {
  try {
    const {
      phone,
      verificationCode,
      password,
      firstName,
      lastName,
    }: AuthRequest = req.body;

    if (!phone || !verificationCode || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      } as AuthResponse);
    }

    // Verify the code
    const isCodeValid = await AuthService.verifyCode(phone, verificationCode);
    if (!isCodeValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      } as AuthResponse);
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      } as AuthResponse);
    }

    const user = await AuthService.createUser({
      phone,
      password,
      firstName,
      lastName,
    });

    // Mark phone as verified
    await AuthService.markPhoneAsVerified(phone);

    const token = AuthService.generateToken({
      id: user.id,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user,
      token,
    } as AuthResponse);
  } catch (error: any) {
    console.error("Phone sign up error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create account",
    } as AuthResponse);
  }
};

export const signInPhone: RequestHandler = async (req, res) => {
  try {
    const { phone, verificationCode }: AuthRequest = req.body;

    if (!phone || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Phone number and verification code are required",
      } as AuthResponse);
    }

    // Verify the code
    const isCodeValid = await AuthService.verifyCode(phone, verificationCode);
    if (!isCodeValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      } as AuthResponse);
    }

    const dbUser = await AuthService.getUserByPhone(phone);
    if (!dbUser) {
      return res.status(401).json({
        success: false,
        message: "No account found with this phone number",
      } as AuthResponse);
    }

    const user = {
      id: dbUser.id,
      email: dbUser.email,
      phone: dbUser.phone,
      firstName: dbUser.first_name,
      lastName: dbUser.last_name,
      createdAt: dbUser.created_at,
      updatedAt: dbUser.updated_at,
    };

    const token = AuthService.generateToken({
      id: user.id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    res.json({
      success: true,
      message: "Signed in successfully",
      user,
      token,
    } as AuthResponse);
  } catch (error: any) {
    console.error("Phone sign in error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as AuthResponse);
  }
};

export const getProfile: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      } as AuthResponse);
    }

    const user = await AuthService.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      } as AuthResponse);
    }

    const userProfile = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      firstName: user.first_name,
      lastName: user.last_name,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };

    res.json({
      success: true,
      message: "Profile retrieved successfully",
      user: userProfile,
    } as AuthResponse);
  } catch (error: any) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as AuthResponse);
  }
};
