# Leapfrog Connect — Admin Module

> Hackathon prototype · Skills-to-Jobs platform · Admin Panel only

---

## 📁 Project Structure

```
Relay_hack_LMS/
├── backend/                     # Django REST API
│   ├── config/                  # Django project settings & URLs
│   │   ├── settings.py
│   │   └── urls.py
│   ├── administration/          # Core admin Django app
│   │   ├── models.py            # DB models (Course, Event, Payment, Employer, etc.)
│   │   ├── serializers.py       # DRF serializers
│   │   ├── views/               # Modular view files per feature
│   │   ├── urls/                # /api/auth/ and /api/admin/ routers
│   │   └── management/commands/seed_data.py
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/                    # React + Vite admin SPA
    └── src/
        ├── App.jsx
        ├── features/admin/
        │   ├── components/      # AdminLayout, Sidebar, Table, Modal, Badge, StatCard, Filters
        │   ├── pages/           # Dashboard, Courses, Events, Payments, Users, Employers, Analytics
        │   ├── services/        # Axios service per feature (api.js, courseService.js, ...)
        │   └── store/           # Zustand stores (authStore, courseStore, eventStore, paymentStore)
        └── lib/utils.js
```

---

## 🚀 Setup Instructions

### Prerequisites
- Python 3.11+  |  Node.js 18+  |  PostgreSQL 14+

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # edit DB credentials + SECRET_KEY
createdb leapfrog_connect
python manage.py migrate
python manage.py seed_data    # creates admin user + 60+ demo records
python manage.py runserver    # http://localhost:8000/api/
```

Demo credentials: **admin / admin123**

### Frontend

```bash
cd frontend
npm install
cp .env.example .env          # VITE_API_BASE_URL already set to localhost:8000
npm run dev                   # http://localhost:5173/
```

---

## 🔌 API Endpoints

| Prefix | Endpoints |
|--------|-----------|
| `/api/auth/` | `login/`, `refresh/`, `logout/` |
| `/api/admin/analytics/` | `dashboard/`, `courses/`, `events/`, `revenue/` |
| `/api/admin/courses/` | CRUD + filters: `search`, `track`, `level`, `is_published` |
| `/api/admin/events/` | CRUD + `<id>/registrations/`, `registrations/<id>/` |
| `/api/admin/payments/` | CRUD + filters: `status`, `payment_method`, `user_id` |
| `/api/admin/users/` | List + `<id>/` (PATCH) |
| `/api/admin/employers/` | CRUD |
| `/api/admin/jobs/` | CRUD |

**Response format:** `{ "status": "success|error", "message": "…", "data": { … } }`

---

## 🤝 Team Integration — Shared Contracts

| Model | Stable fields (do not rename) |
|-------|-------------------------------|
| `Course` | `id`, `title`, `track`, `youtube_video_id`, `thumbnail_url`, `instructor_name`, `is_published` |
| `EventRegistration` | `learner` → FK to `django.contrib.auth.models.User` |

- Auth: all `/api/admin/*` require `Authorization: Bearer <token>` + `is_staff=True`
- `LearnerProfile` is a OneToOne to Django's `User` — access via `user.learner_profile`
- Frontend services live in `src/features/admin/services/`
- Zustand stores live in `src/features/admin/store/`

---

## ⚠️ Common Pitfalls

1. **Migration conflicts** — resolve by reordering migration file dependencies
2. **CORS** — add your dev port to `CORS_ALLOWED_ORIGINS` in `.env`
3. **Custom User model** — never; extend with `LearnerProfile` OneToOne instead
4. **Boolean query params** — use `is_published=true` (lowercase string)
5. **Datetimes** — always ISO 8601: `2024-06-15T10:00:00Z`

---

## 🎯 Demo Flow

1. Login (`admin / admin123`)
2. **Dashboard** — stats overview, recent payments
3. **Courses** — create/edit/publish course with YouTube ID
4. **Events** — create event, view registrations list
5. **Payments** — filter by status, change status inline
6. **Users** — view learners, activate/deactivate
7. **Employers** — add company, post job opening
8. **Analytics** — enrollment bar charts, monthly revenue line, pie charts
