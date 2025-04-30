
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Task
from .serializers import TaskSerializer, TaskUpdateSerializer, TaskReportSerializer
from .permissions import IsAssignedUser, IsAdminOrSuperAdmin, IsAdmin, IsSuperAdmin

class TaskListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role in ['admin', 'superadmin']:
            tasks = Task.objects.filter(assigned_by=request.user) if request.user.role == 'admin' else Task.objects.all()
        else:
            tasks = Task.objects.filter(assigned_to=request.user)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def post(self, request):
        permission_classes = [IsAdminOrSuperAdmin]
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(assigned_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            task = Task.objects.get(pk=pk)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role in ['admin', 'superadmin'] or request.user == task.assigned_to:
            serializer = TaskUpdateSerializer(task, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

class TaskReportView(APIView):
    permission_classes = [IsAdminOrSuperAdmin]

    def get(self, request, pk):
        try:
            task = Task.objects.get(pk=pk)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

        if task.status != 'completed':
            return Response({"error": "Task is not completed"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = TaskReportSerializer(task)
        return Response(serializer.data)