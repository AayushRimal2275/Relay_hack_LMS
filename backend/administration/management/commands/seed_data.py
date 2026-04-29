"""
Seed command: python manage.py seed_data

Creates demo data for the Leapfrog Connect Admin Module hackathon demo.
Safe to run multiple times (uses get_or_create where possible).
"""
import random
import uuid
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

from administration.models import (
    LearnerProfile, Employer, Course, Event,
    EventRegistration, Payment, JobPosting,
)


TRACKS = ["frontend", "backend", "fullstack", "devops", "data", "design", "mobile"]
LEVELS = ["beginner", "intermediate", "advanced"]
INDUSTRIES = ["Technology", "Finance", "Healthcare", "Education", "E-commerce", "Media", "Consulting"]
EVENT_TYPES = ["workshop", "webinar", "hackathon", "career_fair", "bootcamp", "networking"]
PAY_METHODS = ["card", "esewa", "khalti", "bank_transfer"]
PAY_STATUSES = ["pending", "completed", "completed", "completed", "failed", "refunded"]

COURSE_DATA = [
    ("React Fundamentals", "frontend", "Jane Smith", "dQw4w9WgXcQ"),
    ("Advanced Django REST APIs", "backend", "Alex Johnson", "M7lc1UVf-VE"),
    ("Full Stack with Next.js", "fullstack", "Sarah Lee", "HMqgVXy6HbI"),
    ("Docker & Kubernetes Basics", "devops", "Mike Chen", "PivWY9wn_Kc"),
    ("Python for Data Science", "data", "Emily Davis", "ua-CiDNNj30"),
    ("UI/UX Design Principles", "design", "Chris Park", "5iqvnsFqRnA"),
    ("React Native Mobile Apps", "mobile", "Tom Wilson", "0-S5ztqDqV0"),
    ("Node.js & Express APIs", "backend", "Lisa Wang", "zb3Lm7mSMrs"),
    ("TypeScript Deep Dive", "frontend", "David Kim", "30LWjhZzeSs"),
    ("PostgreSQL for Developers", "backend", "Anna Brown", "qw-OjSSVMsw"),
    ("CI/CD Pipelines with GitHub Actions", "devops", "James Martinez", "eB13uams3iU"),
    ("Machine Learning Foundations", "data", "Sophie Turner", "aircAruvnKk"),
    ("Vue.js 3 Complete Guide", "frontend", "Ethan Clark", "nhBVL5s58tA"),
    ("System Design Essentials", "fullstack", "Olivia White", "0Z9RcesTPks"),
    ("Figma for Developers", "design", "Liam Scott", "II-6dOwRZh4"),
]

EMPLOYER_DATA = [
    ("CloudNine Tech", "Technology", "John Doe", "john@cloudnine.com"),
    ("FinEdge Solutions", "Finance", "Alice Kim", "alice@finedge.com"),
    ("HealthSync Nepal", "Healthcare", "Dr. Ram Prasad", "ram@healthsync.np"),
    ("LearnBridge Inc.", "Education", "Sita Thapa", "sita@learnbridge.com"),
    ("ShopKartly", "E-commerce", "Bikram Rai", "bikram@shopkartly.com"),
    ("MediaPlex", "Media", "Priya Sharma", "priya@mediaplex.com"),
    ("ConsultPro Nepal", "Consulting", "Mohan Gurung", "mohan@consultpro.np"),
    ("DataStream Analytics", "Technology", "Nina Patel", "nina@datastream.com"),
]

EVENT_DATA = [
    ("React Workshop 2024", "workshop", 50),
    ("Backend Architecture Webinar", "webinar", 200),
    ("Leapfrog Hackathon #3", "hackathon", 100),
    ("Tech Career Fair Spring 2024", "career_fair", 300),
    ("Full Stack Bootcamp", "bootcamp", 30),
    ("Developer Networking Night", "networking", 80),
    ("Python & AI Workshop", "workshop", 60),
    ("Cloud DevOps Webinar", "webinar", 150),
]


class Command(BaseCommand):
    help = "Seed demo data for Leapfrog Connect Admin Module"

    def handle(self, *args, **kwargs):
        self.stdout.write("🌱 Seeding database...")

        # ── Admin user ────────────────────────────────────────────────────────
        admin, created = User.objects.get_or_create(
            username="admin",
            defaults={
                "email": "admin@leapfrogconnect.com",
                "first_name": "Admin",
                "last_name": "User",
                "is_staff": True,
                "is_superuser": True,
            },
        )
        if created:
            admin.set_password("admin123")
            admin.save()
            self.stdout.write("  ✓ Admin user created (admin / admin123)")
        else:
            self.stdout.write("  ✓ Admin user already exists")

        # ── Learner users ─────────────────────────────────────────────────────
        learners = []
        learner_names = [
            ("aarav", "Aarav", "Sharma", "aarav@email.com"),
            ("bikash", "Bikash", "Thapa", "bikash@email.com"),
            ("chandani", "Chandani", "Rai", "chandani@email.com"),
            ("deepak", "Deepak", "Gurung", "deepak@email.com"),
            ("elina", "Elina", "Magar", "elina@email.com"),
            ("faisal", "Faisal", "Khan", "faisal@email.com"),
            ("gita", "Gita", "Bhandari", "gita@email.com"),
            ("hari", "Hari", "Bahadur", "hari@email.com"),
            ("indira", "Indira", "Poudel", "indira@email.com"),
            ("jagat", "Jagat", "Basnet", "jagat@email.com"),
            ("kavya", "Kavya", "Shrestha", "kavya@email.com"),
            ("laxmi", "Laxmi", "Tamang", "laxmi@email.com"),
            ("manish", "Manish", "Karki", "manish@email.com"),
            ("nisha", "Nisha", "Pandey", "nisha@email.com"),
            ("omar", "Omar", "Ali", "omar@email.com"),
            ("priya", "Priya", "Yadav", "priya@email.com"),
            ("ritesh", "Ritesh", "Koirala", "ritesh@email.com"),
            ("sunita", "Sunita", "Adhikari", "sunita@email.com"),
            ("tenzin", "Tenzin", "Lama", "tenzin@email.com"),
            ("urmila", "Urmila", "Dhakal", "urmila@email.com"),
        ]
        for username, first, last, email in learner_names:
            user, created = User.objects.get_or_create(
                username=username,
                defaults={"email": email, "first_name": first, "last_name": last},
            )
            if created:
                user.set_password("pass1234")
                user.save()
            LearnerProfile.objects.get_or_create(
                user=user,
                defaults={
                    "skills": random.sample(["React", "Python", "Django", "SQL", "TypeScript", "Docker", "Figma", "Node.js"], 3),
                    "bio": f"Passionate developer focused on {random.choice(TRACKS)} development.",
                    "linkedin_url": f"https://linkedin.com/in/{username}",
                },
            )
            learners.append(user)
        self.stdout.write(f"  ✓ {len(learners)} learner users ready")

        # ── Employers ─────────────────────────────────────────────────────────
        employers = []
        for company, industry, contact_name, email in EMPLOYER_DATA:
            emp, _ = Employer.objects.get_or_create(
                company_name=company,
                defaults={
                    "industry": industry,
                    "contact_name": contact_name,
                    "contact_email": email,
                    "website": f"https://{company.lower().replace(' ', '')}.com",
                    "logo_url": f"https://ui-avatars.com/api/?name={company.replace(' ', '+')}&background=random",
                },
            )
            employers.append(emp)
        self.stdout.write(f"  ✓ {len(employers)} employers ready")

        # ── Courses ───────────────────────────────────────────────────────────
        courses = []
        for title, track, instructor, yt_id in COURSE_DATA:
            course, _ = Course.objects.get_or_create(
                title=title,
                defaults={
                    "track": track,
                    "instructor_name": instructor,
                    "youtube_video_id": yt_id,
                    "thumbnail_url": f"https://img.youtube.com/vi/{yt_id}/maxresdefault.jpg",
                    "description": f"A comprehensive {title} course for modern developers.",
                    "level": random.choice(LEVELS),
                    "duration_hours": random.randint(8, 40),
                    "price": Decimal(str(random.choice([0, 999, 1499, 1999, 2499, 2999]))),
                    "is_published": random.choice([True, True, True, False]),
                    "enrollment_count": random.randint(50, 800),
                },
            )
            courses.append(course)
        self.stdout.write(f"  ✓ {len(courses)} courses ready")

        # ── Job Postings ──────────────────────────────────────────────────────
        job_titles = [
            "Frontend Developer", "Backend Engineer", "Full Stack Developer",
            "DevOps Engineer", "Data Analyst", "UI/UX Designer",
            "React Developer", "Python Developer", "Product Manager",
            "QA Engineer", "Mobile Developer", "Cloud Architect",
        ]
        jobs = []
        for i, title in enumerate(job_titles):
            employer = employers[i % len(employers)]
            job, _ = JobPosting.objects.get_or_create(
                title=title,
                employer=employer,
                defaults={
                    "description": f"We are looking for an experienced {title} to join our team.",
                    "required_skills": random.sample(["React", "Python", "Django", "TypeScript", "Docker", "AWS", "SQL", "Node.js", "Figma"], 3),
                    "job_type": random.choice(["full_time", "contract", "internship"]),
                    "location": random.choice(["Kathmandu", "Pokhara", "Lalitpur", "Remote"]),
                    "is_remote": random.choice([True, False]),
                    "salary_min": random.choice([30000, 40000, 50000, 60000]),
                    "salary_max": random.choice([70000, 80000, 100000, 120000]),
                    "status": random.choice(["open", "open", "open", "closed", "paused"]),
                    "application_count": random.randint(5, 80),
                },
            )
            jobs.append(job)
        self.stdout.write(f"  ✓ {len(jobs)} job postings ready")

        # ── Events ────────────────────────────────────────────────────────────
        now = timezone.now()
        events = []
        for i, (title, etype, cap) in enumerate(EVENT_DATA):
            offset_days = (i - 3) * 14
            start = now + timedelta(days=offset_days)
            end = start + timedelta(hours=3)
            status = "completed" if offset_days < -7 else ("ongoing" if offset_days < 0 else "upcoming")
            event, _ = Event.objects.get_or_create(
                title=title,
                defaults={
                    "description": f"Join us for {title}. A great learning opportunity.",
                    "event_type": etype,
                    "status": status,
                    "start_date": start,
                    "end_date": end,
                    "is_online": random.choice([True, False]),
                    "location": "Kathmandu, Nepal" if not random.choice([True, False]) else "",
                    "meeting_url": "https://meet.google.com/xyz-abc-def" if random.choice([True, False]) else "",
                    "max_capacity": cap,
                    "banner_url": f"https://picsum.photos/seed/{title.replace(' ', '')}/800/400",
                },
            )
            events.append(event)
        self.stdout.write(f"  ✓ {len(events)} events ready")

        # ── Event Registrations ───────────────────────────────────────────────
        reg_count = 0
        for event in events:
            sample_size = min(random.randint(8, 20), len(learners))
            for learner in random.sample(learners, sample_size):
                _, created = EventRegistration.objects.get_or_create(
                    event=event,
                    learner=learner,
                    defaults={
                        "status": random.choice(["registered", "attended", "attended", "cancelled"]),
                    },
                )
                if created:
                    reg_count += 1
        self.stdout.write(f"  ✓ {reg_count} event registrations created")

        # ── Payments ──────────────────────────────────────────────────────────
        pay_count = 0
        for _ in range(60):
            learner = random.choice(learners)
            course = random.choice([c for c in courses if c.price > 0])
            txn_id = f"TXN-{uuid.uuid4().hex[:12].upper()}"
            if not Payment.objects.filter(user=learner, course=course).exists():
                Payment.objects.create(
                    user=learner,
                    course=course,
                    amount=course.price,
                    status=random.choice(PAY_STATUSES),
                    payment_method=random.choice(PAY_METHODS),
                    transaction_id=txn_id,
                    created_at=now - timedelta(days=random.randint(0, 180)),
                )
                pay_count += 1
        self.stdout.write(f"  ✓ {pay_count} payments created")

        self.stdout.write(self.style.SUCCESS("\n✅ Seed complete! Login: admin / admin123"))
