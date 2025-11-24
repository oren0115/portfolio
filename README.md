## Next.js Portfolio CMS

Full-stack portfolio platform (public site + admin dashboard) built with **Next.js 14 App Router**, **MongoDB (Mongoose)**, **Tailwind CSS**, and **JWT-based admin auth**. Supports CRUD for Projects, Blog Posts, Skills, and Experience with dedicated public pages and protected admin tools.

### ✨ Highlights

- App Router architecture with server components for public pages and client-side admin tooling.
- MongoDB models for `users`, `projects`, `blog`, `skills`, `experience`.
- Secure admin authentication using signed HTTP-only cookies (JWT).
- Ready-to-use API routes mirroring the proposed contract.
- Tailwind-based UI kit for hero, cards, and admin forms.

---

## 1. Getting Started

### Prerequisites

- Node.js ≥ 18.18
- MongoDB database (Atlas or self-hosted)

### Environment Variables

Create a `.env.local` file with:

```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/portfolio
AUTH_SECRET=<random-long-string>
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=super-secure-password
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
# Optional, defaults to "portfolio"
CLOUDINARY_FOLDER=portfolio-media
```

> On first login, the system will auto-seed an admin user using `ADMIN_EMAIL` & `ADMIN_PASSWORD`.

### Install & Run

```bash
npm install
npm run dev
# open http://localhost:3000
```

Additional scripts:

```bash
npm run lint   # lint with next lint
```

---

## 2. Architecture Overview

```
src/
├─ app/
│  ├─ (public) pages: /, /projects, /projects/[id], /blog, /blog/[slug], /skills, /experience
│  ├─ admin/
│  │   ├─ (public)/login → admin login form
│  │   └─ (protected)/… → dashboard + CRUD screens
│  └─ api/… → RESTful CRUD endpoints (projects, blog, skills, experience, auth)
├─ components/ → public cards, admin managers, shared UI
├─ lib/ → db connector, auth helpers, validation, data loaders
└─ models/ → Mongoose schemas for User/Project/Blog/Skill/Experience
```

- **Public UI** uses server components fetching directly from MongoDB via `lib/data`.
- **Admin UI** renders through a protected layout that checks the session cookie, then hydrates client-side CRUD managers that talk to the API routes.
- **Auth Flow**: `/api/auth/login` validates credentials → issues JWT → sets `portfolio_session` HTTP-only cookie. `/api/auth/logout` clears the cookie. All CRUD API routes enforce this cookie.
- **Data Validation** handled by `zod` schemas per entity before hitting MongoDB.

---

## 3. API Contract (excerpt)

| Method | Route | Description |
|--------|-------|-------------|
| POST   | `/api/auth/login` | Login admin (body: `{ email, password }`) |
| POST   | `/api/auth/logout` | Clear session |
| GET    | `/api/projects` | Public list |
| POST   | `/api/projects` | **Admin** create project |
| GET/PATCH/DELETE | `/api/projects/[id]` | View/update/delete project |
| GET/POST | `/api/blog` | List or create blog post |
| GET/PATCH/DELETE | `/api/blog/[slug]` | Blog detail & mutations |
| POST | `/api/uploads` | **Admin** image upload → Cloudinary |
| GET/POST | `/api/skills` | List or create skills |
| PATCH/DELETE | `/api/skills/[id]` | Update/delete skill |
| GET/POST | `/api/experience` | List or create experience |
| PATCH/DELETE | `/api/experience/[id]` | Update/delete experience |

All non-GET operations require a valid admin session cookie.

---

## 4. Content Flow

### Public Visitor
1. User loads landing page → server components fetch MongoDB data for hero, projects, blog, skills, experience.
2. Detail views are served via dynamic routes (`/projects/[id]`, `/blog/[slug]`).

### Admin CRUD
1. Admin visits `/admin/login`, authenticates via `/api/auth/login`.
2. Protected layout verifies the session and exposes navigation + logout.
3. Each CRUD screen has:
   - Form for Create/Update (auto-switches to edit mode per item).
   - Live table/list with Edit/Delete actions (hits API routes).
4. Updates reflect instantly on public pages (server components re-fetch on request).

---

## 5. Data Model Snapshot

```ts
Project {
  title: string;
  description: string;
  techStack: string[];
  image?: string;
  link_demo?: string;
  link_repo?: string;
  createdAt: Date;
}

BlogPost {
  title: string;
  slug: string;
  content: string (markdown);
  tags: string[];
  coverImage?: string;
  createdAt: Date;
}

Skill {
  name: string;
  level: "beginner" | "intermediate" | "expert";
  icon?: string;
}

Experience {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
  highlights: string[];
}
```

---

## 6. Next Steps

- Swap JWT auth with NextAuth or enterprise SSO if needed.
- Extend uploads to support additional media types (video, documents, etc.).
- Implement role management if inviting multiple editors.
- Add e2e tests (Playwright) for admin flows.

Enjoy building and customizing! 🎨🚀
