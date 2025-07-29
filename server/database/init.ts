import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

const dbPath = path.join(process.cwd(), 'valuai.db');

// Create promisified database interface
export class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(dbPath);
  }

  run(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }

  get(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  all(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

export async function initializeDatabase() {
  const db = new Database();

  try {
    // Users table
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        phone TEXT UNIQUE,
        password_hash TEXT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email_verified BOOLEAN DEFAULT 0,
        phone_verified BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Verification codes table
    await db.run(`
      CREATE TABLE IF NOT EXISTS verification_codes (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        phone TEXT,
        code TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        used BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Valuations table
    await db.run(`
      CREATE TABLE IF NOT EXISTS valuations (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        company_name TEXT NOT NULL,
        industry TEXT NOT NULL,
        stage TEXT NOT NULL,
        description TEXT,
        revenue REAL,
        expenses REAL,
        team_size INTEGER,
        market_size TEXT,
        funding_goal REAL,
        business_model TEXT,
        projected_revenue REAL,
        burn_rate REAL,
        runway INTEGER,
        previous_funding TEXT,
        geographic_market TEXT,
        competition TEXT,
        use_of_funds TEXT,
        estimated_valuation_min REAL,
        estimated_valuation_max REAL,
        estimated_valuation_primary REAL,
        primary_method TEXT,
        confidence REAL,
        methods_data TEXT, -- JSON string of methods array
        report_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Sessions table (for JWT token blacklisting if needed)
    await db.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token_hash TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Reports table
    await db.run(`
      CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY,
        valuation_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        format TEXT NOT NULL,
        file_path TEXT,
        download_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (valuation_id) REFERENCES valuations (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

// Singleton database instance
let dbInstance: Database | null = null;

export function getDatabase(): Database {
  if (!dbInstance) {
    dbInstance = new Database();
  }
  return dbInstance;
}
