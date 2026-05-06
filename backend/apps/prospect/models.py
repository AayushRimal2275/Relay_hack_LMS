from django.db import models
from django.contrib.auth.models import User

class Enrollment(models.Model):
    learner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey('administration.Course', on_delete=models.CASCADE, related_name='enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = [('learner', 'course')]
        
    def __str__(self):
        return f"{self.learner.username} → {self.course.title}"

class Certificate(models.Model):
    learner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='certificates')
    course = models.ForeignKey('administration.Course', on_delete=models.CASCADE, related_name='certificates')
    issued_at = models.DateTimeField(auto_now_add=True)
    certificate_id = models.CharField(max_length=100, unique=True)
    
    def save(self, *args, **kwargs):
        if not self.certificate_id:
            import uuid
            self.certificate_id = str(uuid.uuid4())
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"Certificate: {self.learner.username} - {self.course.title}"
