from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import *
from .serializers import *
import nltk



from nltk import ngrams
from nltk.tokenize import word_tokenize

def generate_ngrams(text, n):
    words = word_tokenize(text)
    return set(ngrams(words, n))

def compare_ngrams(string1, string2, n):
    ngrams1 = generate_ngrams(string1, n)
    ngrams2 = generate_ngrams(string2, n)

    # Calculate Jaccard similarity between the sets of n-grams
    intersection = len(ngrams1.intersection(ngrams2))
    union = len(ngrams1.union(ngrams2))
    similarity = intersection / union if union != 0 else 0

    return similarity



@api_view(['GET'])
def home(request):
    user_objs = user.objects.all()
    serializers = UserSerializer(user_objs,many=True)
    
    
    print(request.data.get("text"))
    return Response({'status':200,'payload':serializers.data})

@api_view(['POST'])
def post_home(request):
    try:
        data= request.data
        
        text1 = data.get('text1')
        text2 = data.get('text2')
        result =compare_ngrams(text1,text2,2)
        #print(text1,text2)    
     

        return Response({'ngrams': result})
    
    except Exception as e:
        return  Response({'message': f"Error: {str(e)}"})
    
    

