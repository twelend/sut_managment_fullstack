from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import viewsets, generics, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings

from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from django.contrib.auth import authenticate

from .models import Subject, Contest, LessonApplication, ContestApplication, ApplicationStatus, RefbookTemplate
from .serializers import (
    SubjectSerializer, ContestSerializer,
    LessonApplicationCreateSerializer, ContestApplicationCreateSerializer,
    ContestCreateSerializer, ApplicationSerializer,
    RefbookTemplateSerializer, RefbookTemplateCreateSerializer,
    SubjectCreateSerializer
)

@extend_schema(tags=["Applications"], summary="Запись на занятие", description="Создает заявку на занятие (для сайта/фронта)")
class LessonApplicationCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = LessonApplicationCreateSerializer
    queryset = LessonApplication.objects.all()

@extend_schema(tags=["Applications"], summary="Запись на конкурс", description="Создает заявку на конкурс (для сайта/фронта)")
class ContestApplicationCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = ContestApplicationCreateSerializer
    queryset = ContestApplication.objects.all()

@extend_schema(tags=["Teacher panel"], summary="Получение предметов", description="Возвращает список предметов и количество новых заявок по каждому.")
class SubjectListForTeacherView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = SubjectSerializer
    queryset = Subject.objects.all()


@extend_schema(
    tags=["Teacher panel"],
    summary="Создание предмета",
    description="Создает новый курс/предмет для панели преподавателя.",
)
class SubjectCreateView(generics.CreateAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = SubjectCreateSerializer
    queryset = Subject.objects.all()

@extend_schema(tags=["Teacher panel", "Contest"], summary="Получение конкурсов", description="Возвращает список конкурсов и количество новых заявок по каждому.")
class ContestListForTeacherView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = ContestSerializer
    queryset = Contest.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        if not queryset.exists():
            return Response({"detail": "Конкурсов пока не было создано"}, status=status.HTTP_200_OK)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

@extend_schema(tags=["Teacher panel", "Contest"], summary="Создание конкурса", description="Создает новый конкурс.")
class ContestCreateView(generics.CreateAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = ContestCreateSerializer
    queryset = Contest.objects.all()


@extend_schema(
    tags=["Teacher panel"],
    summary="Удаление предмета",
    description="Удаляет предмет/курс по идентификатору.",
)
class SubjectDeleteView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, pk):
        subject = get_object_or_404(Subject, pk=pk)
        subject.delete()
        return Response({"detail": "Предмет удалён"}, status=status.HTTP_204_NO_CONTENT)

from rest_framework import filters

@extend_schema(tags=["Teacher panel"], summary="Получение заявок", description="Фильтрация по статусу: ?status=new|accepted|rejected")
class LessonApplicationsListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = LessonApplicationCreateSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['full_name', 'email']

    def get_queryset(self):
        subject_id = self.kwargs.get('subject_id')
        status_filter = self.request.query_params.get('status')
        qs = LessonApplication.objects.filter(subject_id=subject_id).order_by('-created_at')
        if status_filter == 'new':
            qs = qs.filter(status=ApplicationStatus.NEW)
        elif status_filter == 'accepted':
            qs = qs.filter(status=ApplicationStatus.ACCEPTED)
        elif status_filter == 'rejected':
            qs = qs.filter(status=ApplicationStatus.REJECTED)
        return qs


class ContestApplicationsListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, contest_id):
        status_query = request.query_params.get("status")

        try:
            contest = Contest.objects.get(id=contest_id)
        except Contest.DoesNotExist:
            return Response({"detail": "Contest not found"}, status=404)

        queryset = ContestApplication.objects.filter(contest=contest)

        if status_query and status_query != "all":
            queryset = queryset.filter(status=status_query)

        counts = {
            "all": ContestApplication.objects.filter(contest=contest).count(),
            "new": ContestApplication.objects.filter(contest=contest, status=ApplicationStatus.NEW).count(),
            "accepted": ContestApplication.objects.filter(contest=contest, status=ApplicationStatus.ACCEPTED).count(),
            "rejected": ContestApplication.objects.filter(contest=contest, status=ApplicationStatus.REJECTED).count(),
        }

        return Response({
            "counts": counts,
            "items": ApplicationSerializer(queryset, many=True).data
        })

@extend_schema(tags=["Teacher panel", "Contest"], summary="Удаление конкурса", description="Удаление конкурса по id")
class ContestDeleteView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, pk):
        contest = get_object_or_404(Contest, pk=pk)
        contest.delete()
        return Response({"detail": "Конкурс удалён"}, status=status.HTTP_204_NO_CONTENT)

@extend_schema(tags=["Teacher panel", "Refbook"], summary="Получение шаблонов ответов", description="Возвращает список шаблонов для быстрых ответов.")
class RefbookTemplateListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = RefbookTemplateSerializer
    queryset = RefbookTemplate.objects.all().order_by("-updated_at")

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        if not queryset.exists():
            return Response({"detail": "Шаблонов пока нет"}, status=status.HTTP_200_OK)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

@extend_schema(tags=["Teacher panel", "Refbook"], summary="Создание шаблона ответа", description="Создает новый шаблон письма.")
class RefbookTemplateCreateView(generics.CreateAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = RefbookTemplateCreateSerializer
    queryset = RefbookTemplate.objects.all()

@extend_schema(tags=["Teacher panel", "Refbook"], summary="Удаление шаблона ответа", description="Удаляет шаблон по идентификатору.")
class RefbookTemplateDeleteView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, pk):
        template = get_object_or_404(RefbookTemplate, pk=pk)
        template.delete()
        return Response({"detail": "Шаблон удалён"}, status=status.HTTP_204_NO_CONTENT)

@extend_schema(tags=["Teacher panel", "Task Status"], summary="Изменение статуса заявки", description="action: accept или reject, message: текст письма")
class ApplicationActionView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, app_type, pk):
        action = request.data.get('action')
        message = request.data.get('message', '')
        if app_type == 'lesson':
            app = get_object_or_404(LessonApplication, pk=pk)
        else:
            app = get_object_or_404(ContestApplication, pk=pk)

        if action == 'accept':
            app.mark_accepted(response_text=message)
            subject = f"Ваша заявка принята"
        elif action == 'reject':
            app.mark_rejected(response_text=message)
            subject = f"Ваша заявка отклонена"
        else:
            return Response({"detail": "unknown action"}, status=status.HTTP_400_BAD_REQUEST)

        body = f"Здравствуйте, {app.full_name}!\n\n{message}\n\nСтатус вашей заявки: {app.get_status_display()}"
        send_mail(
            subject,
            body,
            settings.DEFAULT_FROM_EMAIL,
            [app.email],
            fail_silently=False,
        )

        return Response({"detail": "ok", "status": app.status})

class StatisticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        subjects = []
        for subject in Subject.objects.all():
            subjects.append({
                "id": subject.id,
                "title": subject.title,
                "status": subject.status,
                "new": subject.applications.filter(status=ApplicationStatus.NEW).count(),
                "accepted": subject.applications.filter(status=ApplicationStatus.ACCEPTED).count(),
                "rejected": subject.applications.filter(status=ApplicationStatus.REJECTED).count(),
            })

        contests = []
        for contest in Contest.objects.all():
            contests.append({
                "id": contest.id,
                "title": contest.title,
                "new": contest.applications.filter(status=ApplicationStatus.NEW).count(),
                "accepted": contest.applications.filter(status=ApplicationStatus.ACCEPTED).count(),
                "rejected": contest.applications.filter(status=ApplicationStatus.REJECTED).count(),
            })

        return Response({
            "subjects": subjects,
            "contests": contests
        })

@extend_schema(tags=['Teacher Login'], summary='Поинт входа в аккаунт учителя', description='Вход в систему правления')
class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email и пароль обязательны"}, status=400)

        user = authenticate(username=email, password=password)

        if not user:
            return Response({"error": "Неверный email или пароль"}, status=401)

        token, _ = Token.objects.get_or_create(user=user)

        return Response({"data": {"token": token.key}})
