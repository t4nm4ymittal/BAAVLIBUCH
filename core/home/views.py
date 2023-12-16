from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import *
from .serializers import *
# Create your views here.

@api_view(['GET'])
def home(request):
    user_objs = user.objects.all()
    serializers = UserSerializer(user_objs,many=True)
    
    
    print(request.data.get("text"))
    return Response({'status':200,'payload':serializers.data})
