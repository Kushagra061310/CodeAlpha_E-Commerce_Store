from django.contrib import admin
from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from store import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/products/', views.get_products),
    path('api/register/', views.register),
    path('api/login/', obtain_auth_token),
    
    # NEW: The dynamic route for specific product reviews
    path('api/products/<int:pk>/reviews/', views.product_reviews),
]