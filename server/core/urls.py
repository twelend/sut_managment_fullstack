from django.urls import path
from .views import (
    LessonApplicationCreateView, ContestApplicationCreateView,
    SubjectListForTeacherView, SubjectCreateView, SubjectDeleteView,
    ContestListForTeacherView,
    LessonApplicationsListView, ContestApplicationsListView,
    ApplicationActionView, StatisticsView, LoginView,
    ContestCreateView, ContestDeleteView,
    RefbookTemplateListView, RefbookTemplateCreateView, RefbookTemplateDeleteView
)

urlpatterns = [
    path("teacher/login/", LoginView.as_view(), name="login"),

    path('apply/lesson/', LessonApplicationCreateView.as_view(), name='apply-lesson'),
    path('apply/contest/', ContestApplicationCreateView.as_view(), name='apply-contest'),

    #Subject
    path('teacher/subjects/', SubjectListForTeacherView.as_view(), name='teacher-subjects'),
    path('teacher/subjects/create/', SubjectCreateView.as_view(), name='teacher-subject-create'),
    path('teacher/subjects/<int:pk>/', SubjectDeleteView.as_view(), name='teacher-subject-delete'),

    #Contest
    path('teacher/contests/', ContestListForTeacherView.as_view(), name='teacher-contests'),
    path('teacher/contests/create/', ContestCreateView.as_view(), name='teacher-contests-create'),
    path("teacher/contests/<int:pk>/", ContestDeleteView.as_view()),
    # Refbook
    path("teacher/refbook/", RefbookTemplateListView.as_view(), name="teacher-refbook"),
    path("teacher/refbook/create/", RefbookTemplateCreateView.as_view(), name="teacher-refbook-create"),
    path("teacher/refbook/<int:pk>/", RefbookTemplateDeleteView.as_view(), name="teacher-refbook-delete"),

    
    path('teacher/subject/<int:subject_id>/applications/', LessonApplicationsListView.as_view(), name='subject-apps'),
    path('teacher/contest/<int:contest_id>/applications/', ContestApplicationsListView.as_view(), name='contest-apps'),

    path('teacher/application/<str:app_type>/<int:pk>/action/', ApplicationActionView.as_view(), name='application-action'),

    path("teacher/statistics/", StatisticsView.as_view(), name="statistics"),
]
