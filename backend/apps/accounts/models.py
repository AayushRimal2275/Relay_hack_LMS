from django.db import models
from django.contrib.auth.models import User


class LearnerProfile(models.Model):
    TRACK_CHOICES = [
        ('MERN', 'MERN Stack'),
        ('DevOps', 'DevOps'),
        ('QA', 'Quality Assurance'),
        ('Design', 'UI/UX Design'),
        ('Data Science', 'Data Science'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='learner_profile')
    track = models.CharField(max_length=50, choices=TRACK_CHOICES)
    skills = models.JSONField(default=list)
    score = models.FloatField(default=0)
    certification_count = models.IntegerField(default=0)
    bio = models.TextField(blank=True)
    avatar_url = models.URLField(blank=True)

    def __str__(self):
        return f"{self.user.username} – {self.track}"
