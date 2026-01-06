# P4WS App - Aplikasi Adopsi & Donasi Hewan

Dokumentasi ini menjelaskan langkah-langkah untuk setup awal, instalasi dependensi, migrasi database, dan menjalankan aplikasi (Frontend & Backend).

## Prasyarat (Prerequisites)

Pastikan Anda sudah menginstall:
- **Node.js** (versi LTS disarankan)
- **PostgreSQL** (Database)
- **Git**
- **Expo Go** (Aplikasi di HP Android/iOS untuk testing mobile)

---

## 1. Setup Backend

Backend berada di folder `backend/`. Aplikasi ini menggunakan Express.js dan Prisma ORM dengan PostgreSQL.

1.  **Masuk ke folder backend:**
    ```bash
    cd backend
    ```

2.  **Install Dependensi:**
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment Variable (.env):**
    Buat file `.env` di dalam folder `backend/` dan isi dengan konfigurasi berikut (sesuaikan dengan password database Anda):
    ```env
    PORT=3000
    DATABASE_URL="postgresql://postgres:password@localhost:5432/p4ws_db?schema=public"
    JWT_SECRET="rahasia_super_aman"
    ```
    *Catatan: Ganti `password` dengan password user `postgres` di komputer Anda, dan pastikan database `p4ws_db` (atau nama yang Anda inginkan) sudah dibuat atau biarkan Prisma membuatnya jika user memiliki hak akses.*

4.  **Jalankan Migrasi Database:**
    Perintah ini akan membuat tabel-tabel di database sesuai schema Prisma.
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Jalankan Server Backend:**
    ```bash
    npm run dev
    ```
    Server akan berjalan di `http://localhost:3000`.

---

## 2. Setup Frontend (Mobile App)

Frontend berada di folder `MyApps/`. Aplikasi ini dibangun menggunakan React Native dengan Expo.

1.  **Buka terminal baru** (biarkan terminal backend tetap berjalan).

2.  **Masuk ke folder frontend:**
    ```bash
    cd MyApps
    ```

3.  **Install Dependensi:**
    ```bash
    npm install
    ```

4.  **Konfigurasi Environment Variable (.env):**
    Buat file `.env` di dalam folder `MyApps/` dan isi dengan konfigurasi berikut:
    ```env
    # PENTING: Ganti 192.168.1.4 dengan IP Address komputer Anda!
    # Jangan gunakan localhost jika ingin testing di HP fisik.
    EXPO_PUBLIC_API_URL=http://192.168.1.4:3000/api
    ```
    *Cara cek IP Address:*
    *   **Windows**: Buka CMD, ketik `ipconfig` (cari IPv4 Address di Wireless LAN / Ethernet adapter).
    *   **Mac/Linux**: Ketik `ifconfig` atau `ip a`.

5.  **Jalankan Aplikasi Expo:**
    ```bash
    npx expo start --clear
    ```

6.  **Scan QR Code:**
    *   Buka aplikasi **Expo Go** di HP Anda.
    *   Scan QR code yang muncul di terminal.
    *   Pastikan HP dan Komputer terhubung ke jaringan WiFi yang sama.

---

## Struktur Folder

- **`MyApps/`**: Source code Frontend (React Native/Expo).
- **`backend/`**: Source code Backend (Node.js/Express).

## Troubleshooting Umum

- **Axios Network Error / Gagal Connect ke Backend:**
    *   Pastikan HP dan Laptop satu WiFi.
    *   Pastikan `EXPO_PUBLIC_API_URL` di `MyApps/.env` menggunakan IP Address komputer (bukan `localhost`).
    *   Coba matikan Firewall sementara jika masih terblokir.
    *   Pastikan backend server (`npm run dev`) statusnya running.

- **Prisma Error:**
    *   Pastikan service PostgreSQL sudah nyala.
    *   Cek URL koneksi database di `backend/.env`.
