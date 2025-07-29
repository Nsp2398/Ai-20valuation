# ValuAI API Documentation

## Overview

The ValuAI backend is a comprehensive REST API built with Express.js, TypeScript, and SQLite. It provides authentication, business valuation calculations, and report generation services.

## Base URL
```
http://localhost:8080/api
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### 1. Health Check

#### GET /ping
Check if the API is running.

**Response:**
```json
{
  "message": "ValuAI API is running!"
}
```

---

### 2. Authentication Endpoints

#### POST /auth/signup/email
Register a new user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt-token-here"
}
```

#### POST /auth/signin/email
Sign in with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Signed in successfully",
  "user": { /* user object */ },
  "token": "jwt-token-here"
}
```

#### POST /auth/send-verification
Send SMS verification code to phone number.

**Request Body:**
```json
{
  "phone": "+1234567890",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification code sent successfully",
  "codeSent": true
}
```

#### POST /auth/signup/phone
Register with phone number and verification code.

**Request Body:**
```json
{
  "phone": "+1234567890",
  "verificationCode": "123456",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### POST /auth/signin/phone
Sign in with phone number and verification code.

**Request Body:**
```json
{
  "phone": "+1234567890",
  "verificationCode": "123456"
}
```

#### GET /auth/profile
Get current user profile (requires authentication).

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "phone": "+1234567890",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 3. Valuation Endpoints

#### POST /valuations
Create a new business valuation (requires authentication).

**Request Body:**
```json
{
  "companyName": "TechStart Inc",
  "industry": "technology",
  "stage": "early-revenue",
  "description": "AI-powered analytics platform for small businesses",
  "revenue": 150000,
  "expenses": 100000,
  "teamSize": 5,
  "marketSize": "$10B",
  "fundingGoal": 2000000,
  "businessModel": "subscription",
  "projectedRevenue": 1500000,
  "burnRate": 50000,
  "runway": 12,
  "previousFunding": "seed",
  "geographicMarket": "north-america",
  "competition": "Established players with 5+ competitors",
  "useOfFunds": "Product development and marketing"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Valuation calculated successfully",
  "result": {
    "id": "valuation-uuid",
    "userId": "user-uuid",
    "companyName": "TechStart Inc",
    "estimatedValuation": {
      "min": 2250000,
      "max": 3750000,
      "primary": 3000000
    },
    "methods": [
      {
        "name": "Scorecard Method",
        "value": 2800000,
        "confidence": 0.8,
        "weight": 0.96
      },
      {
        "name": "VC Method",
        "value": 3200000,
        "confidence": 0.85,
        "weight": 1.02
      }
    ],
    "primaryMethod": "VC Method",
    "confidence": 0.82,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "recommendedMethods": [
    {
      "name": "Scorecard Method",
      "confidence": 0.8,
      "applicableStages": ["pre-revenue", "early-revenue"],
      "description": "Comparative analysis with similar funded companies"
    }
  ]
}
```

#### GET /valuations/methods?stage=early-revenue
Get recommended valuation methods for a business stage.

**Query Parameters:**
- `stage`: Business stage (idea, pre-revenue, early-revenue, growth)

**Response:**
```json
{
  "success": true,
  "message": "Valuation methods retrieved successfully",
  "recommendedMethods": [
    {
      "name": "Scorecard Method",
      "confidence": 0.8,
      "applicableStages": ["pre-revenue", "early-revenue"],
      "description": "Comparative analysis with similar funded companies"
    }
  ]
}
```

#### GET /valuations
Get all valuations for the authenticated user.

**Response:**
```json
{
  "success": true,
  "message": "Valuations retrieved successfully",
  "result": { /* latest valuation object */ }
}
```

#### GET /valuations/:id
Get a specific valuation by ID (requires authentication and ownership).

**Response:**
```json
{
  "success": true,
  "message": "Valuation retrieved successfully",
  "result": { /* valuation object */ }
}
```

#### DELETE /valuations/:id
Delete a valuation (requires authentication and ownership).

**Response:**
```json
{
  "success": true,
  "message": "Valuation deleted successfully"
}
```

---

### 4. Dashboard Endpoint

#### GET /dashboard
Get dashboard data for the authenticated user.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "recentValuations": [ /* array of 5 most recent valuations */ ],
    "totalValuations": 15,
    "averageValuation": 2500000,
    "portfolioGrowth": 25.5
  },
  "message": "Dashboard data retrieved successfully"
}
```

---

### 5. Report Endpoints

#### POST /reports/generate
Generate a valuation report (requires authentication).

**Request Body:**
```json
{
  "valuationId": "valuation-uuid",
  "format": "pdf"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Report generated successfully",
  "downloadUrl": "/api/reports/download/report-uuid",
  "reportId": "report-uuid"
}
```

#### GET /reports/download/:reportId
Download a generated report (requires authentication and ownership).

**Response:** File download with appropriate headers.

#### GET /reports
Get all reports for the authenticated user.

**Response:**
```json
{
  "success": true,
  "message": "Reports retrieved successfully",
  "reports": [
    {
      "id": "report-uuid",
      "valuationId": "valuation-uuid",
      "companyName": "TechStart Inc",
      "format": "pdf",
      "downloadCount": 3,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "downloadUrl": "/api/reports/download/report-uuid"
    }
  ]
}
```

#### DELETE /reports/:reportId
Delete a report (requires authentication and ownership).

**Response:**
```json
{
  "success": true,
  "message": "Report deleted successfully"
}
```

---

## Valuation Methods

The API supports 6 internationally recognized valuation methodologies:

### 1. Berkus Method
- **Applicable to:** Idea stage, Pre-revenue
- **Description:** Pre-revenue valuation based on five key success factors
- **Max Valuation:** $2.5M

### 2. Scorecard Method
- **Applicable to:** Pre-revenue, Early revenue
- **Description:** Comparative analysis with similar funded companies
- **Factors:** Industry, team, market, revenue traction

### 3. Risk Factor Summation Method
- **Applicable to:** All stages
- **Description:** Adjusts pre-money valuation based on 12 risk factors
- **Adjustment:** ±$250K per risk factor

### 4. VC Method
- **Applicable to:** Early revenue, Growth
- **Description:** Backward calculation from expected exit value
- **Formula:** Terminal Value / Expected Return - Investment

### 5. DCF Analysis
- **Applicable to:** Early revenue, Growth
- **Description:** Discounted cash flow for revenue-generating businesses
- **Requires:** Revenue history for projections

### 6. Comparable Analysis
- **Applicable to:** All stages
- **Description:** Market-based valuation using industry multiples
- **Factors:** Industry multiples, market penetration

---

## Industry Multipliers

The API uses the following revenue multiples by industry:

- **Technology:** 8x
- **SaaS:** 10x
- **Healthcare:** 6x
- **FinTech:** 9x
- **Biotech:** 15x
- **E-commerce:** 4x
- **Other:** 5x

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": "Specific field error"
  }
}
```

### HTTP Status Codes
- **200:** Success
- **201:** Created
- **400:** Bad Request
- **401:** Unauthorized
- **403:** Forbidden
- **404:** Not Found
- **500:** Internal Server Error

---

## Database Schema

### Users Table
- `id` (TEXT PRIMARY KEY)
- `email` (TEXT UNIQUE)
- `phone` (TEXT UNIQUE)
- `password_hash` (TEXT)
- `first_name` (TEXT)
- `last_name` (TEXT)
- `email_verified` (BOOLEAN)
- `phone_verified` (BOOLEAN)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

### Valuations Table
- `id` (TEXT PRIMARY KEY)
- `user_id` (TEXT FOREIGN KEY)
- `company_name` (TEXT)
- `industry` (TEXT)
- `stage` (TEXT)
- Financial and business metrics columns
- Valuation results columns
- `created_at` (DATETIME)

### Verification Codes Table
- `id` (TEXT PRIMARY KEY)
- `user_id` (TEXT FOREIGN KEY)
- `phone` (TEXT)
- `code` (TEXT)
- `expires_at` (DATETIME)
- `used` (BOOLEAN)

### Reports Table
- `id` (TEXT PRIMARY KEY)
- `valuation_id` (TEXT FOREIGN KEY)
- `user_id` (TEXT FOREIGN KEY)
- `format` (TEXT)
- `file_path` (TEXT)
- `download_count` (INTEGER)
- `created_at` (DATETIME)

---

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
JWT_SECRET=your-super-secret-jwt-key
PORT=8080
NODE_ENV=development
DATABASE_URL=./valuai.db
```

---

## Development

To run the server in development mode:

```bash
npm run dev
```

The API will be available at `http://localhost:8080/api`

---

## Security Features

- **JWT Authentication:** Secure token-based authentication
- **Password Hashing:** Bcrypt with 12 salt rounds
- **Input Validation:** Comprehensive request validation
- **SQL Injection Protection:** Parameterized queries
- **CORS Support:** Configurable cross-origin requests
- **Rate Limiting:** Ready for rate limiting middleware

---

## Integration Notes

1. **SMS Service:** Currently simulated - integrate with Twilio/AWS SNS for production
2. **Email Service:** Ready for SMTP integration
3. **File Storage:** Local filesystem - consider cloud storage for production
4. **Report Generation:** Simplified implementation - integrate with advanced PDF libraries
5. **Market Data:** Mock data - integrate with financial APIs for real market data

This backend provides a solid foundation for the ValuAI business valuation platform with room for production enhancements.
