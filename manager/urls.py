# from .views import HomeView, AboutView, SURPIIBuildingListView

# urlpatterns = [
#     path('', HomeView.as_view(), name='home'),
#     path('about/', AboutView.as_view(), name='about'),
# ]

from django.urls import path
from .views import (
    AboutView,
    HomeView,
    MethodologyView,
    MunicipalitiesView,
    CityRiskComparisonView,
    SURPIIBuildingListView,
    SURPIIRoadListView,
    RiverListView,
)

urlpatterns = [
    path("", HomeView.as_view(), name="home"),
    path("about/", AboutView.as_view(), name="about"),
    path("methodology/", MethodologyView.as_view(), name="methodology"),
    path("municipalities/", MunicipalitiesView.as_view(), name="municipalities"),
    path(
        "city-risk-comparison/",
        CityRiskComparisonView.as_view(),
        name="city-risk-comparison",
    ),
    path(
        "api/surpii-buildings/",
        SURPIIBuildingListView.as_view(),
        name="surpii-buildings",
    ),
    path(
        "api/surpii-roads/",
        SURPIIRoadListView.as_view(),
        name="surpii-roads",
    ),
    path(
        "api/rivers/",
        RiverListView.as_view(),
        name="rivers",
    ),
]
