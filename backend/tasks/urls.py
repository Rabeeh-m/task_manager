from django.urls import path
from .views import TaskListView, TaskDetailView, TaskReportView

urlpatterns = [
    path('tasks/', TaskListView.as_view(), name='task-list'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
    path('tasks/<int:pk>/report/', TaskReportView.as_view(), name='task-report'),
]