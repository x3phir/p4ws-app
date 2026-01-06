# Cat Rescue Backend

Backend API untuk aplikasi Cat Rescue - Platform penyelamatan dan adopsi kucing.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth & upload middleware
│   ├── routes/          # API routes
│   ├── seed.js          # Database seeder
│   └── server.js        # Main application
├── prisma/
│   └── schema.prisma    # Database schema
├── uploads/             # Uploaded files
├── .env                 # Environment variables
└── package.json
```

## 🛠️ Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup PostgreSQL Database
```bash
# Create database
createdb catrescue

# Or using psql
psql -U postgres
CREATE DATABASE catrescue;
```

### 3. Configure Environment
Copy `.env` and update with your settings:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/catrescue"
JWT_SECRET="your-secret-key"
PORT=3000
```

### 4. Run Database Migrations
```bash
npx prisma migrate dev
```

### 5. Seed Database
```bash
npm run seed
```

### 6. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

## 📚 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

**Base URL**: `http://localhost:3000/api`

### Quick Start

1. **Register User**:
   ```bash
   POST /api/auth/register
   ```

2. **Login**:
   ```bash
   POST /api/auth/login
   ```

3. **Get Shelters**:
   ```bash
   GET /api/shelters
   ```

## 🔑 Default Admin Account

```
Email: admin@catrescue.com
Password: admin123
```

**⚠️ Change this in production!**

## 📝 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with initial data
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## 🗄️ Database Schema

### Models
- **User** - User accounts with roles
- **Shelter** - Animal shelters
- **Pet** - Pets available for adoption
- **Report** - Cat rescue reports
- **Timeline** - Report activity timeline
- **Campaign** - Donation campaigns

See `prisma/schema.prisma` for complete schema.

## 🔐 Authentication

API uses JWT tokens for authentication. Include token in requests:

```
Authorization: Bearer <your_token>
```

## 📤 File Upload

Upload images to `/api/upload`:
- Max size: 5MB
- Allowed types: jpg, jpeg, png, gif
- Files stored in `uploads/` directory

## 🧪 Testing

Use Postman, Thunder Client, or curl to test endpoints:

```bash
# Health check
curl http://localhost:3000/health

# Get all shelters
curl http://localhost:3000/api/shelters
```

## 🚨 Error Handling

All errors return JSON:
```json
{
  "error": "Error message"
}
```

## 📦 Dependencies

### Production
- express - Web framework
- @prisma/client - Database ORM
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- cors - CORS middleware
- dotenv - Environment variables
- multer - File upload

### Development
- nodemon - Auto-restart server

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📄 License

ISC
