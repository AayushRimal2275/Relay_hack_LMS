from django.contrib import admin
from .models import LearnerProfile, Employer, Course, Event, EventRegistration, Payment, JobPosting

admin.site.register(LearnerProfile)
admin.site.register(Employer)
admin.site.register(Course)
admin.site.register(Event)
admin.site.register(EventRegistration)
admin.site.register(Payment)
admin.site.register(JobPosting)
