from django.db import models
from django.contrib.auth.models import User


# ─── Course ──────────────────────────────────────────────────────────────────
class Course(models.Model):
    TRACK_CHOICES = [
        ("frontend", "Frontend"),
        ("backend", "Backend"),
        ("fullstack", "Full Stack"),
        ("devops", "DevOps"),
        ("data", "Data Science"),
        ("design", "UI/UX Design"),
        ("mobile", "Mobile"),
        ("other", "Other"),
    ]
    LEVEL_CHOICES = [
        ("beginner", "Beginner"),
        ("intermediate", "Intermediate"),
        ("advanced", "Advanced"),
    ]

    title = models.CharField(max_length=255, db_index=True)
    track = models.CharField(max_length=50, choices=TRACK_CHOICES, db_index=True)
    youtube_video_id = models.CharField(max_length=50, blank=True)
    thumbnail_url = models.URLField(blank=True)
    instructor_name = models.CharField(max_length=255)
    is_published = models.BooleanField(default=False, db_index=True)
    description = models.TextField(blank=True)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default="beginner")
    duration_hours = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    enrollment_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


# ─── Event ───────────────────────────────────────────────────────────────────
class Event(models.Model):
    TYPE_CHOICES = [
        ("workshop", "Workshop"),
        ("webinar", "Webinar"),
        ("hackathon", "Hackathon"),
        ("career_fair", "Career Fair"),
        ("bootcamp", "Bootcamp"),
        ("networking", "Networking"),
    ]
    STATUS_CHOICES = [
        ("upcoming", "Upcoming"),
        ("ongoing", "Ongoing"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    title = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True)
    event_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="upcoming", db_index=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    location = models.CharField(max_length=255, blank=True)
    is_online = models.BooleanField(default=False)
    meeting_url = models.URLField(blank=True)
    max_capacity = models.PositiveIntegerField(default=100)
    banner_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-start_date"]

    def __str__(self):
        return self.title

    @property
    def registration_count(self):
        return self.registrations.count()


# ─── EventRegistration ───────────────────────────────────────────────────────
class EventRegistration(models.Model):
    STATUS_CHOICES = [
        ("registered", "Registered"),
        ("attended", "Attended"),
        ("cancelled", "Cancelled"),
        ("waitlisted", "Waitlisted"),
    ]

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="registrations")
    learner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="event_registrations")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="registered")
    registered_at = models.DateTimeField(auto_now_add=True)
    attended_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = [("event", "learner")]
        ordering = ["-registered_at"]

    def __str__(self):
        return f"{self.learner.username} → {self.event.title}"


# ─── Payment ─────────────────────────────────────────────────────────────────
class Payment(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("failed", "Failed"),
        ("refunded", "Refunded"),
    ]
    METHOD_CHOICES = [
        ("card", "Credit/Debit Card"),
        ("esewa", "eSewa"),
        ("khalti", "Khalti"),
        ("bank_transfer", "Bank Transfer"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="payments")
    course = models.ForeignKey(Course, null=True, blank=True, on_delete=models.SET_NULL, related_name="payments")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default="NPR")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending", db_index=True)
    payment_method = models.CharField(max_length=30, choices=METHOD_CHOICES, default="card")
    transaction_id = models.CharField(max_length=100, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Payment({self.transaction_id} – {self.status})"
