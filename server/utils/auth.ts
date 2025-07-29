import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { Request, Response, NextFunction } from "express";
import { getDatabase } from "../database/init";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    phone?: string;
    firstName: string;
    lastName: string;
  };
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(payload: any): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  static generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async sendSMS(phone: string, message: string): Promise<boolean> {
    // Simulate SMS sending - in production, integrate with Twilio, AWS SNS, etc.
    console.log(`SMS to ${phone}: ${message}`);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate 95% success rate
    return Math.random() > 0.05;
  }

  static async createUser(data: {
    email?: string;
    phone?: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const db = getDatabase();
    const userId = uuidv4();
    const passwordHash = await this.hashPassword(data.password);

    try {
      await db.run(
        `
        INSERT INTO users (id, email, phone, password_hash, first_name, last_name)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
        [
          userId,
          data.email || null,
          data.phone || null,
          passwordHash,
          data.firstName,
          data.lastName,
        ],
      );

      return {
        id: userId,
        email: data.email,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      if (error.message.includes("UNIQUE constraint failed")) {
        if (error.message.includes("email")) {
          throw new Error("Email already exists");
        }
        if (error.message.includes("phone")) {
          throw new Error("Phone number already exists");
        }
      }
      throw error;
    }
  }

  static async getUserByEmail(email: string) {
    const db = getDatabase();
    return db.get(
      `
      SELECT id, email, phone, password_hash, first_name, last_name, 
             email_verified, phone_verified, created_at, updated_at
      FROM users WHERE email = ?
    `,
      [email],
    );
  }

  static async getUserByPhone(phone: string) {
    const db = getDatabase();
    return db.get(
      `
      SELECT id, email, phone, password_hash, first_name, last_name, 
             email_verified, phone_verified, created_at, updated_at
      FROM users WHERE phone = ?
    `,
      [phone],
    );
  }

  static async getUserById(id: string) {
    const db = getDatabase();
    return db.get(
      `
      SELECT id, email, phone, first_name, last_name, 
             email_verified, phone_verified, created_at, updated_at
      FROM users WHERE id = ?
    `,
      [id],
    );
  }

  static async storeVerificationCode(
    phone: string,
    code: string,
    userId?: string,
  ): Promise<string> {
    const db = getDatabase();
    const codeId = uuidv4();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db.run(
      `
      INSERT INTO verification_codes (id, user_id, phone, code, expires_at)
      VALUES (?, ?, ?, ?, ?)
    `,
      [codeId, userId || null, phone, code, expiresAt.toISOString()],
    );

    return codeId;
  }

  static async verifyCode(phone: string, code: string): Promise<boolean> {
    const db = getDatabase();

    const result = await db.get(
      `
      SELECT id FROM verification_codes 
      WHERE phone = ? AND code = ? AND expires_at > datetime('now') AND used = 0
    `,
      [phone, code],
    );

    if (result) {
      // Mark code as used
      await db.run(
        `
        UPDATE verification_codes SET used = 1 WHERE id = ?
      `,
        [result.id],
      );
      return true;
    }

    return false;
  }

  static async markPhoneAsVerified(phone: string): Promise<void> {
    const db = getDatabase();
    await db.run(
      `
      UPDATE users SET phone_verified = 1, updated_at = CURRENT_TIMESTAMP 
      WHERE phone = ?
    `,
      [phone],
    );
  }
}

// Middleware to authenticate JWT tokens
export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access token required" });
  }

  try {
    const decoded = AuthService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
  }
}

// Optional middleware - doesn't fail if no token
export function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    try {
      const decoded = AuthService.verifyToken(token);
      req.user = decoded;
    } catch (error) {
      // Ignore invalid tokens in optional auth
    }
  }

  next();
}
