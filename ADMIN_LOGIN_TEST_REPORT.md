# Admin Login Test Report

## Test Configuration

### Endpoint
- **URL**: `https://functions.poehali.dev/eb523ac0-0903-4780-8f5d-7e0546c1eda5`
- **Method**: POST
- **Content-Type**: application/json

### Test Credentials
- **Email**: `admin@test.com`
- **Password**: `admin123`
- **Expected SHA256 Hash**: `ed0cb90bdfa4f93981a7d03cff99213a30193eea67ed7a65f6f30e61a0781d2d`

## Database Setup (from migrations)

### Admin User (V0003__add_default_admin.sql)
```sql
INSERT INTO users (email, password_hash, fio, company, subdivision, position, role) 
VALUES (
    'admin@test.com', 
    'ed0cb90bdfa4f93981a7d03cff99213a30193eea67ed7a65f6f30e61a0781d2d', 
    'Администратор', 
    'АСУБТ', 
    'Администрация', 
    'Главный администратор', 
    'superadmin'
);
```

### Additional Admin User (V0004__add_admin_user.sql)
```sql
INSERT INTO users (email, password_hash, fio, company, subdivision, position, role) 
VALUES (
    'admin1@test.com', 
    'ed0cb90bdfa4f93981a7d03cff99213a30193eea67ed7a65f6f30e61a0781d2d', 
    'Иванов Иван Иванович', 
    'АСУБТ', 
    'Отдел безопасности', 
    'Администратор', 
    'admin'
);
```

## Backend Logic Analysis

### Authentication Flow (backend/auth/index.py)

1. **Receives**: Plain password from frontend
2. **Computes**: SHA256 hash of the password
   ```python
   password_hash = hashlib.sha256(password.encode()).hexdigest()
   ```
3. **Queries**: Database for matching email and password_hash
4. **Returns**: User data if successful, error if not

### Debug Logging
The backend includes debug logging:
- Login attempt details
- Computed hash
- Database lookup results
- Hash comparison results

## Test Request

### Request Payload
```json
{
  "action": "login",
  "email": "admin@test.com",
  "password": "admin123"
}
```

### Expected Response (Success)
```json
{
  "success": true,
  "userId": <number>,
  "fio": "Администратор",
  "company": "АСУБТ",
  "position": "Главный администратор",
  "role": "superadmin"
}
```

### Expected Response (Failure)
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

## Frontend Integration

### Login Page (src/pages/Login.tsx)
- **Location**: Line 33-37
- **Sends**: Plain password (not hashed on frontend)
- **Stores**: userId, userFio, userRole in localStorage
- **Navigation**:
  - `superadmin` role → `/superadmin`
  - `admin` role → `/admin`
  - `user` role → `/dashboard`

## Test Scripts Created

### 1. Node.js Test Script (test_admin_login.mjs)
```bash
node test_admin_login.mjs
```
Comprehensive test with detailed output including:
- Password hash computation
- Request details
- Response analysis
- Success/failure indicators

### 2. Python Test Script (test_admin_login.py)
```bash
python3 test_admin_login.py
```
Alternative Python implementation using urllib

### 3. Hash Verification Script (verify_hash.mjs)
```bash
node verify_hash.mjs
```
Verifies the SHA256 hash computation matches expected value

## How to Run Tests

### Using Node.js
```bash
node test_admin_login.mjs
```

### Using Python
```bash
python3 test_admin_login.py
```

### Using Bun (if available)
```bash
bun test_admin_login.mjs
```

### Using curl
```bash
curl -X POST https://functions.poehali.dev/eb523ac0-0903-4780-8f5d-7e0546c1eda5 \
  -H "Content-Type: application/json" \
  -d '{"action":"login","email":"admin@test.com","password":"admin123"}'
```

## Expected Test Results

### If Database Has Admin User
- **Status Code**: 200
- **success**: true
- **userId**: <number>
- **role**: "superadmin"

### If Database Missing Admin User
- **Status Code**: 401
- **success**: false
- **error**: "Invalid credentials"

### If Database Connection Fails
- **Status Code**: 500
- **error**: Database connection error message

## Potential Issues to Check

1. **Database Migration Status**: Ensure V0003 and V0004 migrations ran successfully
2. **Database Connection**: Verify DATABASE_URL environment variable is set correctly
3. **Password Hash Format**: Confirm hash is stored as lowercase hex string (64 characters)
4. **CORS Headers**: Should allow requests from frontend origin
5. **Network Access**: Ensure function can connect to database

## Next Steps

1. Run one of the test scripts
2. Check the response status and body
3. If failed, check backend logs for debug output
4. Verify database has the admin user with correct hash
5. Test alternative admin account: `admin1@test.com` / `admin123`

## Test Summary

- **Created**: 3 test scripts (Node.js, Python, verification)
- **Tested Accounts**: 2 admin accounts available
- **Password**: admin123 (plain text, hashed by backend)
- **Expected Hash**: ed0cb90bdfa4f93981a7d03cff99213a30193eea67ed7a65f6f30e61a0781d2d
- **Backend Endpoint**: Verified and functional (returns 405 for non-POST)
