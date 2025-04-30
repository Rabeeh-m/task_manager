
from rest_framework import permissions
from accounts.models import User

class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'superadmin'

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class IsAdminOrSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'superadmin']

class IsAssignedUser(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user == obj.assigned_to

class IsTaskOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Allow GET, HEAD, OPTIONS requests to all
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Check if user is admin or superadmin
        if request.user.role in ['admin', 'superadmin']:
            return True
            
        # Check if user is the task owner
        return obj.owner == request.user