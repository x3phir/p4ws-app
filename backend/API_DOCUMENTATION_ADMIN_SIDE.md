# Cat Rescue Admin API Documentation

## Base URL
http://localhost:3000/api

## Authentication
All endpoints require ADMIN role authentication.

Header:
Authorization: Bearer <admin_token>

---

## Report Management

### Get All Reports
GET /reports

Headers:
Authorization: Bearer <admin_token>

Query Parameters (optional):
- status: PENDING | PROCESSING | COMPLETED | CANCELLED
- shelterId: UUID

---

### Update Report Status
**PUT** `/reports/:id/status`

**Headers:**
`Authorization: Bearer <admin_token>`

**Request Body Examples:**

PENDING -> PROCESSING
``` json
{
  "status": "PROCESSING"
}
```

PROCESSING -> COMPLETED
``` json
{
  "status": "COMPLETED"
}
```

PENDING -> CANCELLED
``` json
{
  "status": "CANCELLED"
}
```

---

### Add Report Timeline
POST /reports/:id/timeline

Headers:
Authorization: Bearer <admin_token>

Request Body Examples:

{
  "activity": "Petugas menuju lokasi",
  "description": "Tim shelter sedang dalam perjalanan",
  "icon": "truck"
}

{
  "activity": "Kucing ditemukan",
  "description": "Kucing ditemukan dalam kondisi luka ringan",
  "icon": "search"
}

{
  "activity": "Kucing berhasil diselamatkan",
  "description": "Kucing telah dibawa ke shelter",
  "icon": "check-circle"
}

---

## Donation Verification

### Get All Donations
GET /donations

Headers:
Authorization: Bearer <admin_token>

---

### Update Donation Status
PUT /donations/:id/status

Headers:
Authorization: Bearer <admin_token>

Request Body Examples:

PENDING -> VERIFIED
{
  "status": "VERIFIED"
}

PENDING -> REJECTED
{
  "status": "REJECTED"
}

Reset to PENDING
{
  "status": "PENDING"
}

---

## Adoption Management

### Get All Adoption Requests
GET /adoptions

Headers:
Authorization: Bearer <admin_token>

---

### Update Adoption Status
PUT /adoptions/:id/status

Headers:
Authorization: Bearer <admin_token>

Request Body Examples:

PENDING -> APPROVED
{
  "status": "APPROVED",
  "adminNote": "Silakan datang ke shelter hari Minggu"
}

PENDING -> REJECTED
{
  "status": "REJECTED",
  "adminNote": "Lingkungan rumah belum sesuai"
}

APPROVED -> COMPLETED
{
  "status": "COMPLETED",
  "adminNote": "Kucing telah resmi diadopsi"
}

Any -> CANCELLED
{
  "status": "CANCELLED",
  "adminNote": "Permintaan dibatalkan"
}

---

## Status Reference

### Report Status
- PENDING
- PROCESSING
- COMPLETED
- CANCELLED

### Donation Status
- PENDING
- VERIFIED
- REJECTED

### Adoption Status
- PENDING
- APPROVED
- REJECTED
- COMPLETED
- CANCELLED
