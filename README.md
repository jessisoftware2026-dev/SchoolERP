# Jessi ERP — AI-Ready School Management Platform

A future-ready, AI-first monorepo implementing the recommended blueprint:

| Layer        | Technology                                  |
| ------------ | ------------------------------------------- |
| Web Frontend | React + **Next.js 14** + TypeScript + Tailwind |
| Core Backend | **NestJS** (Node.js) + Prisma               |
| AI Service   | **Python · FastAPI**                        |
| Database     | **PostgreSQL** + `pgvector`                 |
| Cache / RT   | **Redis**                                   |
| DevOps       | Docker · Docker Compose · Nginx-ready       |

> **Design principle:** the Core ERP backend and the Python AI service are kept
> separate. The ERP stays fast and stable; the AI service scales and evolves
> independently and is reached over an internal API.

---

## Repository layout

```
jessi-erp/
├── apps/
│   ├── web/      # Next.js 14 dashboard (modern SaaS UI) + Students module
│   ├── api/      # NestJS core ERP backend (Prisma + Postgres) + Students CRUD
│   └── ai/       # FastAPI AI microservice (chat, risk prediction, pgvector)
├── docker-compose.yml
├── .env.example
└── package.json  # npm workspaces (web + api)
```

## Architecture

```
  Browser / Mobile
        │  HTTPS · REST · WebSocket
        ▼
┌─────────────────────┐        internal REST        ┌────────────────────┐
│  Next.js Web (3000) │ ─────────────────────────▶  │  NestJS API (4000) │
└─────────────────────┘                             └─────────┬──────────┘
        │                                                     │ internal
        │                                                     ▼
        │                                          ┌────────────────────┐
        └────────────── (AI features) ───────────▶ │ FastAPI AI (8000)  │
                                                   └─────────┬──────────┘
                                                             │
                       ┌──────────────┬────────────────────┼───────────────┐
                       ▼              ▼                     ▼               ▼
                 PostgreSQL      Redis (6379)         pgvector       Object Storage
                 + pgvector                           (embeddings)   (S3-compatible)
                  (5432)
```

## Quick start (Docker — everything)

```bash
cp .env.example .env
docker compose up -d --build
```

Then open:

- Web app   → http://localhost:3000
- API       → http://localhost:4000/health
- API docs  → http://localhost:4000/docs (Swagger)
- AI service → http://localhost:8000/health
- AI docs   → http://localhost:8000/docs

## Local development (without Docker for the apps)

Start just the infra (Postgres + Redis) with Docker, run the apps on your host:

```bash
docker compose up -d postgres redis

# install JS deps (root workspaces)
npm install

# database
npm run prisma:migrate --workspace apps/api

# run the three services in separate terminals
npm run dev:api          # NestJS  → http://localhost:4000
npm run dev:web          # Next.js → http://localhost:3000

cd apps/ai
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Reference module: Students / Admissions

The **Students** module is wired end-to-end as the reference pattern to copy for
the remaining ERP modules:

```
Next.js  /students            → GET  /students            (NestJS)
Next.js  /students/[id]       → GET  /students/:id         (NestJS)
                                 POST /students            (NestJS → Prisma → Postgres)
```

Copy `apps/api/src/students` + `apps/web/src/app/(dashboard)/students` as a
template when adding admissions, fees, attendance, exams, HR, etc.

## The 22 ERP modules (roadmap)

Admissions · Students · Fees · Attendance · Exams & Results · Timetable ·
HR & Payroll · Accounts · Transport · Library · Hostel · Inventory ·
Communication · Front Office · Certificates · Health · Discipline ·
Online Learning · Reports / MIS · Multi-branch · Settings · Audit Logs

## AI service endpoints

Working stubs (real contracts, placeholder logic — swap in real models):

- `GET  /health`          — service health
- `POST /ai/chat`         — assistant chatbot
- `POST /ai/predict/risk` — student dropout / performance risk (heuristic)
- `POST /ai/embed`        — text → vector (pgvector semantic search ready)

Roadmap: `POST /ai/predict/result` (result prediction), OCR, face-recognition
attendance, timetable optimisation.

## Multi-tenancy (SaaS / multi-school)

The platform is multi-tenant using **shared-database, row-level isolation**:

- Every tenant-owned row carries a `schoolId`; all queries are scoped by it.
- A **`School`** model is the tenant (with a unique `slug` used as the subdomain).
- Tenants are selected by **subdomain**: `demo.localhost:3000` → school `demo`.
  The web client derives the slug from the hostname and sends it as the
  `x-tenant-slug` header; on the server, `TenantMiddleware` resolves the
  `School` from that header (or the `Host`) and `TenantGuard` enforces it.
- **`SUPER_ADMIN`** users are platform operators (no `schoolId`). They sign in on
  the root domain and manage tenants at **`/settings/schools`** (API: `/schools`,
  restricted by `RolesGuard`).
- The JWT carries `schoolId`; school users can only touch their own tenant's data.

### Seeded accounts

| Role        | Login URL                  | Email               | Password   |
| ----------- | -------------------------- | ------------------- | ---------- |
| SUPER_ADMIN | `http://localhost:3000`    | `super@jessi.local` | `super123` |
| School ADMIN| `http://demo.localhost:3000` | `admin@jessi.local` | `admin123` |

### Local subdomains

- **Chrome/Edge** resolve `*.localhost` to 127.0.0.1 automatically — just open
  `http://demo.localhost:3000`. Keep `WEB_ORIGIN=http://localhost:3000`.
- **Firefox / cross-browser:** use `lvh.me` (resolves to 127.0.0.1):
  open `http://demo.lvh.me:3000` and set `WEB_ORIGIN=http://lvh.me:3000` and
  `NEXT_PUBLIC_API_URL=http://localhost:4000`. (CORS allows the base host and its
  subdomains.)

### Applying the tenancy migration

The schema added `schoolId` as a **required** column on `Student`, so an existing
non-empty dev DB can't migrate in place. In development, reset and reseed:

```bash
docker compose exec api npx prisma migrate reset --force   # drops + recreates
docker compose exec api npm run prisma:seed
docker compose restart api
```

(For a fresh DB, `prisma migrate dev --name multi-tenant` + seed is enough.)

### Adding tenancy to new modules

Copy the **Students** pattern: add `schoolId` + a `School` relation in
`schema.prisma`, take `@CurrentSchool()` in the controller, put
`@UseGuards(TenantGuard)` on the controller, and pass `school.id` into every
service query. The `users` and `roles` modules should adopt the same scoping.

---

© 2026 Jessi Software · Recommended blueprint — adapt to your team & budget.
