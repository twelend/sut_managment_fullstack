from django.contrib import admin
from .models import Subject, Contest, LessonApplication, ContestApplication, ApplicationStatus

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'new_app_count')
    list_filter = ('status',)

    def new_app_count(self, obj):
        return obj.applications.filter(status=ApplicationStatus.NEW).count()
    new_app_count.short_description = 'Новых заявок'

@admin.register(Contest)
class ContestAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'new_app_count')
    def new_app_count(self, obj):
        return obj.applications.filter(status=ApplicationStatus.NEW).count()
    new_app_count.short_description = 'Новых заявок'

@admin.register(LessonApplication)
class LessonApplicationAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'subject', 'status', 'created_at')
    list_filter = ('status', 'subject')
    actions = ['mark_accepted_action', 'mark_rejected_action']

    def mark_accepted_action(self, request, queryset):
        for q in queryset:
            q.mark_accepted()
    mark_accepted_action.short_description = "Принять выбранные заявки"

    def mark_rejected_action(self, request, queryset):
        for q in queryset:
            q.mark_rejected()
    mark_rejected_action.short_description = "Отклонить выбранные заявки"

@admin.register(ContestApplication)
class ContestApplicationAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'contest', 'status', 'created_at')
    list_filter = ('status', 'contest')
    actions = ['mark_accepted_action', 'mark_rejected_action']
    def mark_accepted_action(self, request, queryset):
        for q in queryset:
            q.mark_accepted()
    mark_accepted_action.short_description = "Принять выбранные заявки"
    def mark_rejected_action(self, request, queryset):
        for q in queryset:
            q.mark_rejected()
    mark_rejected_action.short_description = "Отклонить выбранные заявки"
