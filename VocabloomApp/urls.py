from django.urls import path
from . import views

urlpatterns = [
    path('lobby/', views.lobby),
    path('room/', views.room),

    path('get_token/', views.agora_token),

    path('create_member/', views.createMember),
    path('delete_member/', views.deleteMember),
    path('get_member/', views.getMember),
]