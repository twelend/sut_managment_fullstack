from django.conf import settings
from django.core.mail import send_mail

from core.models import ApplicationStatus, LessonApplication, SubjectStatus


def _update_subject_enrolled(subject):
    subject.enrolled = subject.applications.filter(status=ApplicationStatus.ACCEPTED).count()
    if subject.capacity > 0 and subject.enrolled >= subject.capacity:
        subject.status = SubjectStatus.CLOSED
    subject.save()


def handle_application_action(app, action: str, message: str):
    if action == "accept":
        app.mark_accepted(response_text=message)
        subject = "Ваша заявка принята"
    elif action == "reject":
        app.mark_rejected(response_text=message)
        subject = "Ваша заявка отклонена"
    else:
        raise ValueError("Unknown action")

    if isinstance(app, LessonApplication):
        _update_subject_enrolled(app.subject)

    body = (
        f"{message}\n\n"
        f"Статус вашей заявки: {app.get_status_display()}\n\n"
        f"Всегда рады вас видеть в Станции Юных Техников Устиновского района!"
    )

    send_mail(
        subject,
        body,
        settings.DEFAULT_FROM_EMAIL,
        [app.email],
        fail_silently=False,
    )
