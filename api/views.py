from django.shortcuts import render

from .serializers import FloodExtentSerializer,ConflictEventSerializer, IDPSerializer, RiverSerializer, SURPIIRoadSerializer, SURPIIBuildingSerializer, LandParcelSerializer, LandParcelListSerializer, MunicipalitySerializer, OwnerSerializer, LandMarkSerializer, RoadSerializer, BuildingSerializer, AdministrativeBoundarySerializer, DistrictSerializer, RegistrationSerializer, LoginSerializer
from rest_framework import generics
from manager.models import FloodExtent ,ConflictEvent, IDP, River, SURPII_Road ,SURPII_Building, LandParcel, Municipality, Owner, LandMark, Road, Building, AdministrativeBoundary, District
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login, logout, authenticate
from django.db.models import Count, Sum

from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_GET
import requests


class LandParcelView(generics.ListAPIView):
    queryset = LandParcel.objects.all()
    serializer_class = LandParcelSerializer

class LandParcelListView(generics.ListAPIView):
    queryset = LandParcel.objects.all()
    serializer_class = LandParcelListSerializer
    search_fields = [ 'owner','parcel_number']
    filter_backends = [DjangoFilterBackend]
    pagination_class = None 


class OwnerView(generics.ListAPIView):
    queryset = Owner.objects.all()
    serializer_class = OwnerSerializer

class LandMarkView(generics.ListAPIView):
    queryset = LandMark.objects.all()
    serializer_class = LandMarkSerializer

class RoadView(generics.ListAPIView):
    queryset = Road.objects.all()
    serializer_class = RoadSerializer

class BuildingView(generics.ListAPIView):
    queryset = Building.objects.all()
    serializer_class = BuildingSerializer

class AdministrativeBoundaryPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 18

class AdministrativeBoundaryView(generics.ListAPIView):
    queryset = AdministrativeBoundary.objects.all()
    serializer_class = AdministrativeBoundarySerializer
    # filter_backends = [DjangoFilterBackend]
    # filterset_fields = ['name', 'boundary_type']
    # search_fields = ['name']
    # pagination_class = AdministrativeBoundaryPagination


class DistrictPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 47


class DistrictView(generics.ListAPIView):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer
    # filter_backends = [DjangoFilterBackend]
    # filterset_fields = ['name', 'boundary_type']
    # search_fields = ['name']
    # pagination_class = DistrictPagination


class MunicipalityView(generics.ListAPIView):
    queryset = Municipality.objects.all()
    serializer_class = MunicipalitySerializer

class IDPListView(generics.ListAPIView):
    queryset = IDP.objects.all()
    serializer_class = IDPSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['urbanName', 'admin1Name', 'admin2Name', 'settlementClass']
    search_fields = ['urbanName', 'admin1Name', 'admin2Name', 'settlementClass']


class SURPIIBuildingListView(generics.ListAPIView):
    serializer_class = SURPIIBuildingSerializer

    def get_queryset(self):
        urban_name = self.request.query_params.get("urban_name")

        if not urban_name:
            return SURPII_Building.objects.none()

        return SURPII_Building.objects.filter(UrbanName__iexact=urban_name)


class SURPIIRoadListView(generics.ListAPIView):
    serializer_class = SURPIIRoadSerializer

    def get_queryset(self):
        queryset = SURPII_Road.objects.all()

        admin2_name = self.request.query_params.get("admin2Name")
        highway = self.request.query_params.get("highway")

        if admin2_name:
            queryset = queryset.filter(admin2Name__icontains=admin2_name)

        if highway:
            queryset = queryset.filter(highway__iexact=highway)

        return queryset

class RiverListView(generics.ListAPIView):
    serializer_class = RiverSerializer

    def get_queryset(self):
        queryset = River.objects.all()

        name = self.request.query_params.get("name")
        river_class = self.request.query_params.get("river_class")

        if name:
            queryset = queryset.filter(name__icontains=name)

        if river_class:
            queryset = queryset.filter(river_class__iexact=river_class)

        return queryset

class ConflictEventListView(generics.ListAPIView):
    serializer_class = ConflictEventSerializer

    def get_queryset(self):
        queryset = ConflictEvent.objects.all()

        event_type = self.request.query_params.get("event_type")
        admin1 = self.request.query_params.get("admin1")
        admin2 = self.request.query_params.get("admin2")
        event_date = self.request.query_params.get("event_date")

        if event_type:
            queryset = queryset.filter(event_type__icontains=event_type)

        if admin1:
            queryset = queryset.filter(admin1__icontains=admin1)

        if admin2:
            queryset = queryset.filter(admin2__icontains=admin2)

        if event_date:
            queryset = queryset.filter(event_date=event_date)

        return queryset


# class ConflictDistrictListAPIView(APIView):
#     def get(self, request):
#         districts = (
#             ConflictEvent.objects.exclude(admin2__isnull=True)
#             .exclude(admin2="")
#             .values_list("admin2", flat=True)
#             .distinct()
#             .order_by("admin2")
#         )

#         return Response(list(districts))

class FloodExtentListView(generics.ListAPIView):
    queryset = FloodExtent.objects.all()
    serializer_class = FloodExtentSerializer

class RegistrationView(APIView):
    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            login(request, serializer.validated_data['user'])

            return Response(
                {"message": "Login successful"},
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)


@require_GET
def geoserver_proxy(request):
    geoserver_url = "http://localhost:8080/geoserver/risk_dashboard/wms"
    try:
        response = requests.get(
            geoserver_url,
            params=request.GET,
            timeout=30,
        )
        return HttpResponse(
            response.content,
            content_type=response.headers.get("Content-Type", "application/json"),
            status=response.status_code,
        )
    except requests.RequestException as exc:
        return JsonResponse({"error": str(exc)}, status=500)
    
    