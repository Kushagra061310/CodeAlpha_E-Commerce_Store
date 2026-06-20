from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, Review  

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

# NEW: Translator for Reviews
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}} # Hides the password from being read

    def create(self, validated_data):
        # This securely hashes the password instead of saving it as plain text
        user = User.objects.create_user(**validated_data)
        return user