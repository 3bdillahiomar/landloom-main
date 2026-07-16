from django.urls import path
from .views import FloodExtentListView,ConflictEventListView, IDPListView, RiverListView, SURPIIBuildingListView, SURPIIRoadListView, MunicipalityView, LandParcelListView, LandParcelView, OwnerView, LandMarkView, RoadView, BuildingView, AdministrativeBoundaryView, DistrictView, RegistrationView, LoginView, LogoutView

urlpatterns = [
        path('landparcels/', LandParcelView.as_view(), name='landparcel-list'),
        path('landparcels/list/', LandParcelListView.as_view(), name='landparcel-list-view'),
        path('owners/', OwnerView.as_view(), name='owner-list'),
        path('landmarks/', LandMarkView.as_view(), name='landmark-list'),
        path('roads/', RoadView.as_view(), name='road-list'),
        path('buildings/', BuildingView.as_view(), name='building-list'),
        path('administrative-boundaries/', AdministrativeBoundaryView.as_view(), name='administrative-boundary-list'),
        path('districts/', DistrictView.as_view(), name='district-list'),
        path('municipalities/', MunicipalityView.as_view(), name='municipality-list'),
        path('idps/', IDPListView.as_view(), name='idp-list'),
        path('rivers/', RiverListView.as_view(), name='river-list'),
        path('conflict-events/', ConflictEventListView.as_view(), name='conflict-event-list'),
        path('surpii-buildings/', SURPIIBuildingListView.as_view(), name='surpii-building-list'),
        path('surpii-roads/', SURPIIRoadListView.as_view(), name='surpii-road-list'),

        path('flood-extents/', FloodExtentListView.as_view(), name='flood-extent-list'),
        path('register/', RegistrationView.as_view(), name='register'),
        path('login/', LoginView.as_view(), name='login'),
        path('logout/', LogoutView.as_view(), name='logout'),
        # path('conflict-districts/', ConflictDistrictListAPIView.as_view(), name='conflict-district-list'),        
    ]

