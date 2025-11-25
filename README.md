## Portfolio CMS

Aplikasi portfolio full-stack dengan **Next.js 14**, **Tailwind CSS**, dan **MongoDB**. Pengunjung bisa melihat proyek, blog, skill, dan pengalaman. Admin mendapat dashboard khusus untuk CRUD semuanya.

### Fitur Utama
- Halaman publik responsif dengan App Router.
- Dashboard admin terlindungi (JWT + HTTP-only cookie).
- Upload gambar via Cloudinary.
- Validasi form memakai Zod.

## Cara Menjalankan

### 1. Prasyarat
- Node.js ≥ 18.18
- MongoDB (Atlas atau lokal)

### 2. Konfigurasi Environment
Buat file `.env.local` di root:
```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/portfolio
AUTH_SECRET=<random-long-string>
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=super-secure-password
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
CLOUDINARY_FOLDER=portfolio   # opsional
```
Saat login admin pertama kali, user akan otomatis dibuat memakai `ADMIN_EMAIL` & `ADMIN_PASSWORD`.

### 3. Instalasi & Development
```bash
npm install
npm run dev
# buka http://localhost:3000
```

Script lainnya:
```bash
npm run lint            # jalankan eslint
npm run seed:admin      # paksa buat akun admin
npm run migrate:skills  # isi kategori skill lama
```

## Struktur Singkat
```
src/
├─ app/              # halaman publik + admin + API routes
├─ components/       # UI umum dan komponen admin
├─ lib/              # koneksi DB, auth helper, utilitas
├─ models/           # schema Mongoose
└─ types/            # tipe bantuan
```

## Alur Singkat
- Pengunjung mengakses halaman publik → data diambil langsung dari MongoDB via server component.
- Admin login di `/admin/login` → dashboard CRUD untuk Projects, Blog, Skills, Experience.
- Semua perubahan admin langsung tampil di halaman publik.

Selamat membangun! 🚀
