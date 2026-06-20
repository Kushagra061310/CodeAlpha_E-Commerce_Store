from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth.models import User
from .models import Product, Review
from .serializers import ProductSerializer, UserSerializer, ReviewSerializer

# 1. THE INVENTORY ENGINE
@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

# 2. THE SECURITY & REGISTRATION ENGINE
@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User created successfully!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 3. THE NEW 5-STAR RATING ENGINE
@api_view(['GET', 'POST'])
def product_reviews(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        # Fetch all reviews for this specific product
        reviews = product.reviews.all().order_by('-created_at')
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        # Safely grab the rating from the frontend (defaulting to 5 if missing)
        user_rating = int(request.data.get('rating', 5))
        
        # Save directly to the database
        review = Review.objects.create(
            product=product,
            author=request.data.get('author', 'Anonymous Executive'),
            text=request.data.get('text', ''),
            rating=user_rating
        )
        serializer = ReviewSerializer(review)
        return Response(serializer.data, status=status.HTTP_201_CREATED)