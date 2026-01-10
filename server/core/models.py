from django.db import models
from django.utils import timezone

class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True

class SubjectStatus(models.TextChoices):
    OPEN = "open", "Набор открыт"
    CLOSED = "closed", "Набор закрыт"


class Subject(TimestampedModel):
    title = models.CharField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    enrolled = models.PositiveIntegerField(
        default=0,
        help_text="Сколько учеников уже записано"
    )
    capacity = models.PositiveIntegerField(
        default=0,
        help_text="Вместимость группы"
    )
    status = models.CharField(
        max_length=10,
        choices=SubjectStatus.choices,
        default=SubjectStatus.OPEN,
        help_text="Статус набора"
    )

    def __str__(self):
        return self.title

class Contest(TimestampedModel):
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True, help_text="Можно ли записываться на конкурс")

    def __str__(self):
        return self.title

class RefbookTemplate(TimestampedModel):
    title = models.CharField(max_length=255)
    content = models.TextField()

    def __str__(self):
        return self.title

class ApplicationStatus(models.TextChoices):
    NEW = 'new', 'Новая'
    ACCEPTED = 'accepted', 'Принята'
    REJECTED = 'rejected', 'Отклонена'

class BaseApplication(TimestampedModel):
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=ApplicationStatus.choices, default=ApplicationStatus.NEW)
    response_message = models.TextField(blank=True)  # текст, отправленный при принятии/отказе
    responded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True
        ordering = ['-created_at']  # по умолчанию от новых к старым

    def mark_accepted(self, response_text=None):
        self.status = ApplicationStatus.ACCEPTED
        self.response_message = response_text or ''
        self.responded_at = timezone.now()
        self.save()

    def mark_rejected(self, response_text=None):
        self.status = ApplicationStatus.REJECTED
        self.response_message = response_text or ''
        self.responded_at = timezone.now()
        self.save()

class LessonApplication(BaseApplication):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="applications")
    child_name = models.CharField(max_length=200, null=True, blank=True)
    parent_name = models.CharField(max_length=200, null=True, blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.subject} — {self.child_name} ({self.status})"

class ContestApplication(BaseApplication):
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE, related_name="applications")
    child_name = models.CharField(max_length=200, null=True, blank=True)
    parent_name = models.CharField(max_length=200, null=True, blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.contest} — {self.child_name} ({self.status})"
