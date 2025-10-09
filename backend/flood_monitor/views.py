from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import WaterData
from .serializers import WaterDataSerializer

@api_view(['GET', 'POST'])
def water_data_api(request):
    if request.method == 'GET':
        data = WaterData.objects.all().order_by('-timestamp')[:10]  # last 10 readings
        serializer = WaterDataSerializer(data, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = WaterDataSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            print("Serializer Errors:", serializer.errors)
            return Response(serializer.errors, status=400)