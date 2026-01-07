# Cat Rescue API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

---

## 📋 Table of Contents
- [Authentication](#authentication-endpoints)
- [Shelters](#shelter-endpoints)
- [Pets](#pet-endpoints)
- [Reports](#report-endpoints)
- [Campaigns](#campaign-endpoints)
- [Notifications](#notification-endpoints)
- [Upload](#upload-endpoint)

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "081234567890"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "081234567890",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  },
  "token": "jwt_token_here"
}
```

### Get Current User
**GET** `/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "081234567890",
  "avatar": null,
  "role": "USER",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Shelter Endpoints

### Get All Shelters
**GET** `/shelters`

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Paw Care",
    "description": "Shelter kucing terpercaya",
    "address": "Jl. Raya Bogor No. 123",
    "phone": "021-12345678",
    "email": "contact@pawcare.com",
    "capacity": 50,
    "currentOccupancy": 32,
    "isAvailable": true,
    "imageUrl": "https://...",
    "_count": {
      "pets": 10,
      "reports": 5
    }
  }
]
```

### Get Shelter by ID
**GET** `/shelters/:id`

**Response:**
```json
{
  "id": "uuid",
  "name": "Paw Care",
  "description": "Shelter kucing terpercaya",
  "address": "Jl. Raya Bogor No. 123",
  "capacity": 50,
  "currentOccupancy": 32,
  "isAvailable": true,
  "pets": [...],
  "campaigns": [...]
}
```

### Create Shelter (Admin Only)
**POST** `/shelters`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "New Shelter",
  "description": "Description here",
  "address": "Full address",
  "phone": "021-12345678",
  "email": "shelter@example.com",
  "capacity": 50,
  "imageUrl": "https://..."
}
```

### Update Shelter (Admin Only)
**PUT** `/shelters/:id`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:** (any fields to update)
```json
{
  "currentOccupancy": 35,
  "isAvailable": true
}
```

### Delete Shelter (Admin Only)
**DELETE** `/shelters/:id`

**Headers:** `Authorization: Bearer <admin_token>`

---

## Pet Endpoints

### Get All Pets
**GET** `/pets`

**Query Parameters:**
- `status` (optional): AVAILABLE, ADOPTED, PENDING
- `shelterId` (optional): Filter by shelter

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Molly",
    "description": "Si Kecil Aktif",
    "about": "Molly adalah kucing betina...",
    "imageUrl": "https://...",
    "age": "2 tahun",
    "gender": "Betina",
    "breed": "Domestic Short Hair",
    "vaccine": "Lengkap",
    "steril": "Sudah",
    "status": "AVAILABLE",
    "shelter": {
      "id": "uuid",
      "name": "Paw Care",
      "address": "..."
    }
  }
]
```

### Get Pet by ID
**GET** `/pets/:id`

### Create Pet
**POST** `/pets`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Molly",
  "description": "Si Kecil Aktif",
  "about": "Molly adalah kucing betina...",
  "imageUrl": "https://...",
  "age": "2 tahun",
  "gender": "Betina",
  "breed": "Domestic Short Hair",
  "vaccine": "Lengkap",
  "steril": "Sudah",
  "shelterId": "shelter-uuid"
}
```

### Update Pet
**PUT** `/pets/:id`

**Headers:** `Authorization: Bearer <token>`

### Delete Pet
**DELETE** `/pets/:id`

**Headers:** `Authorization: Bearer <token>`

---

## Report Endpoints

### Get All Reports
**GET** `/reports`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): PENDING, PROCESSING, COMPLETED, CANCELLED
- `userId` (optional): Filter by user

**Response:**
```json
[
  {
    "id": "uuid",
    "location": "Jl. Sudirman No. 45",
    "condition": "TERLUKA",
    "imageUrl": "https://...",
    "description": "Kucing terluka di jalan",
    "status": "PENDING",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "user@example.com"
    },
    "shelter": {
      "id": "uuid",
      "name": "Paw Care"
    },
    "timeline": [...]
  }
]
```

### Get Report by ID
**GET** `/reports/:id`

**Headers:** `Authorization: Bearer <token>`

### Create Report
**POST** `/reports`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `location`: string (e.g. "Jl. Sudirman No. 45")
- `condition`: 'SEHAT' | 'TERLUKA' | 'SAKIT'
- `description`: string (optional)
- `shelterId`: string (UUID)
- `image`: File (optional, max 5MB)

**Response:** Report object with initial timeline entry

### Update Report Status
**PUT** `/reports/:id/status`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "PROCESSING"
}
```

### Add Timeline Entry
**POST** `/reports/:id/timeline`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "activity": "Kucing berhasil diselamatkan",
  "description": "Kucing telah dibawa ke shelter",
  "icon": "check-circle"
}
```

---

## Campaign Endpoints

### Get All Campaigns
**GET** `/campaigns`

**Query Parameters:**
- `status` (optional): ACTIVE, COMPLETED, CANCELLED
- `shelterId` (optional): Filter by shelter

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Pakan kucing di shelter",
    "description": "Bantu kami menyediakan makanan...",
    "imageUrl": "https://...",
    "targetAmount": 5000000,
    "currentAmount": 2500000,
    "status": "ACTIVE",
    "shelter": {
      "id": "uuid",
      "name": "Paw Care"
    }
  }
]
```

### Get Campaign by ID
**GET** `/campaigns/:id`

### Create Campaign
**POST** `/campaigns`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Pakan kucing di shelter",
  "description": "Bantu kami menyediakan makanan berkualitas",
  "imageUrl": "https://...",
  "targetAmount": 5000000,
  "shelterId": "shelter-uuid"
}
```

### Update Campaign
**PUT** `/campaigns/:id`

**Headers:** `Authorization: Bearer <token>`

### Process Donation
**POST** `/campaigns/:id/donate`

**Request Body:**
```json
{
  "amount": 100000
}
```

**Response:** Updated campaign with new currentAmount

---

---

## Adoption Endpoints

### Create Adoption Request
**POST** `/adoptions`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "petId": "uuid",
  "reason": "I love cats",
  "hasYard": true,
  "hasOtherPets": false,
  "contact": "08123456789"
}
```

### Get My Requests (User)
**GET** `/adoptions/my`

**Headers:** `Authorization: Bearer <token>`

### Get All Requests (Admin)
**GET** `/adoptions`

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** List of all adoption requests with user and pet details.

### Update Request Status (Admin)
**PUT** `/adoptions/:id/status`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "status": "APPROVED",
  "adminNote": "Please pick up on Sunday"
}
```
**Statuses:** `PENDING`, `APPROVED`, `REJECTED`, `COMPLETED`, `CANCELLED`

---

## Donation Endpoints

### Create Donation (With Proof)
**POST** `/donations`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `campaignId`: UUID of campaign
- `amount`: Number (e.g. 50000)
- `proof`: File (Image)

### Get My Donations (User)
**GET** `/donations/my`

**Headers:** `Authorization: Bearer <token>`

### Get All Donations (Admin)
**GET** `/donations`

**Headers:** `Authorization: Bearer <admin_token>`

### Verify/Reject Donation (Admin)
**PUT** `/donations/:id/status`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "status": "VERIFIED" 
}
```
**Statuses:** `PENDING`, `VERIFIED`, `REJECTED`

---

## Notification Endpoints

### Get All Notifications
**GET** `/notifications`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Update Status Laporan",
    "message": "Laporan Anda telah diperbarui menjadi: PROCESSING",
    "type": "REPORT_UPDATE",
    "isRead": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Mark as Read
**PUT** `/notifications/:id/read`

**Headers:** `Authorization: Bearer <token>`

### Mark All as Read
**PUT** `/notifications/read-all`

**Headers:** `Authorization: Bearer <token>`

### Delete Notification
**DELETE** `/notifications/:id`

**Headers:** `Authorization: Bearer <token>`

---

## Upload Endpoint

### Upload Image
**POST** `/upload`

**Headers:** `Content-Type: multipart/form-data`

**Form Data:**
- `image`: File (max 5MB, jpg/jpeg/png/gif)

**Response:**
```json
{
  "url": "http://localhost:3000/uploads/image-1234567890.jpg",
  "filename": "image-1234567890.jpg"
}
```

---

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "error": "Error message here"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Data Models

### User
```typescript
{
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  role: 'USER' | 'ADMIN' | 'SHELTER_STAFF'
  createdAt: Date
  updatedAt: Date
}
```

### Shelter
```typescript
{
  id: string
  name: string
  description?: string
  address: string
  phone?: string
  email?: string
  capacity: number
  currentOccupancy: number
  isAvailable: boolean
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}
```

### Pet
```typescript
{
  id: string
  name: string
  description: string
  about: string
  imageUrl: string
  age?: string
  gender?: string
  breed?: string
  vaccine: string
  steril: string
  shelterId: string
  status: 'AVAILABLE' | 'ADOPTED' | 'PENDING'
  createdAt: Date
  updatedAt: Date
}
```

### Report
```typescript
{
  id: string
  userId: string
  location: string
  condition: 'SEHAT' | 'TERLUKA' | 'SAKIT'
  imageUrl?: string
  description?: string
  shelterId: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
  createdAt: Date
  updatedAt: Date
}
```

### Campaign
```typescript
{
  id: string
  title: string
  description: string
  imageUrl: string
  targetAmount: number
  currentAmount: number
  shelterId: string
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  createdAt: Date
  updatedAt: Date
}
```

### Notification
```typescript
{
  id: string
  userId: string
  title: string
  message: string
  type?: string
  isRead: boolean
  createdAt: Date
}
```

---

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Setup Database:**
   - Install PostgreSQL
   - Create database: `createdb catrescue`
   - Update `.env` with your database URL

3. **Run Migrations:**
   ```bash
   npx prisma migrate dev
   ```

4. **Seed Database:**
   ```bash
   npm run seed
   ```

5. **Start Server:**
   ```bash
   npm run dev
   ```

6. **Test API:**
   - Visit: `http://localhost:3000/health`
   - Use Postman/Thunder Client to test endpoints

---

## Default Admin Credentials

```
Email: admin@catrescue.com
Password: admin123
```

**⚠️ Change this password in production!**
