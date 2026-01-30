from rest_framework import serializers
from .models import Subject, Contest, LessonApplication, ContestApplication, ApplicationStatus, RefbookTemplate, SubjectStatus
from .service.telegram_notify import send_telegram_message

class SubjectSerializer(serializers.ModelSerializer):
    newApplications = serializers.SerializerMethodField()
    totalApplications = serializers.SerializerMethodField()
    is_active = serializers.SerializerMethodField()

    class Meta:
        model = Subject
        fields = [
            'id',
            'title',
            'description',
            'enrolled',
            'capacity',
            'status',
            'is_active',
            'newApplications',
            'totalApplications',
        ]

    def get_newApplications(self, obj):
        return obj.applications.filter(status=ApplicationStatus.NEW).count()

    def get_totalApplications(self, obj):
        return obj.applications.count()

    def get_is_active(self, obj):
        return obj.status == SubjectStatus.OPEN


class SubjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ["title", "description", "enrolled", "capacity", "status"]

class ContestSerializer(serializers.ModelSerializer):
    newApplications = serializers.SerializerMethodField()
    acceptedAplications = serializers.SerializerMethodField()
    totalApplications = serializers.SerializerMethodField()

    class Meta:
        model = Contest
        fields = ['id', 'title', 'description', 'is_active', 'newApplications', 'acceptedAplications', "totalApplications"]

    def get_totalApplications(self, obj):
        return obj.applications.count()

    def get_newApplications(self, obj):
        return obj.applications.filter(status=ApplicationStatus.NEW).count()

    def get_acceptedAplications(self, obj):
        return obj.applications.filter(status=ApplicationStatus.ACCEPTED).count()

class ContestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contest
        fields = ['title', 'description']
    
    def create(self, validated_data):
        return Contest.objects.create(**validated_data)

class LessonApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonApplication
        fields = [
            "id",
            "subject",
            "child_name",
            "parent_name",
            "email",
            "phone",
            "age",
            "message",
        ]

    def create(self, validated_data):
        instance = super().create(validated_data)
        subject_title = instance.subject.title
        text = (
            "‼️ Новая заявка на занятие ‼️\n"
            f"Курс: {subject_title}\n"
            f"Ребёнок: {instance.child_name or '—'}\n"
            f"Родитель: {instance.parent_name or '—'}\n"
            f"Email: {instance.email}\n"
            f"Телефон: {instance.phone or '—'}\n"
            f"Возраст: {instance.age or '—'}\n"
            f"Сообщение: {instance.message or '—'}"
        )
        send_telegram_message(text)
        return instance


class ContestApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContestApplication
        fields = [
            "id",
            "contest",
            "child_name",
            "parent_name",
            "email",
            "phone",
            "age",
            "message",
        ]

    def create(self, validated_data):
        instance = super().create(validated_data)
        contest_title = instance.contest.title
        text = (
            "‼️ Новая заявка на конкурс ‼️\n"
            f"Конкурс: {contest_title}\n"
            f"Ребёнок: {instance.child_name or '—'}\n"
            f"Родитель: {instance.parent_name or '—'}\n"
            f"Email: {instance.email}\n"
            f"Телефон: {instance.phone or '—'}\n"
            f"Возраст: {instance.age or '—'}\n"
            f"Сообщение: {instance.message or '—'}"
        )
        send_telegram_message(text)
        return instance

class ApplicationSerializer(serializers.ModelSerializer):
    appliedAt = serializers.SerializerMethodField()

    class Meta:
        model = ContestApplication
        fields = [
            "id",
            "child_name",
            "parent_name",
            "email",
            "phone",
            "age",
            "message",
            "status",
            "appliedAt",
        ]

    def get_appliedAt(self, obj):
        # Человеческий формат времени
        return obj.created_at.strftime("%Y-%m-%d %H:%M") if obj.created_at else None

class ApplicationListSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonApplication
        fields = ['id', 'full_name', 'email', 'phone', 'message', 'status', 'created_at', 'responded_at', 'response_message']

class RefbookTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RefbookTemplate
        fields = ["id", "title", "content", "created_at", "updated_at"]

class RefbookTemplateCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RefbookTemplate
        fields = ["title", "content"]
