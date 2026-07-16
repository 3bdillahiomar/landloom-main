# from .views import HomeView, AboutView, SURPIIBuildingListView

# urlpatterns = [
#     path('', HomeView.as_view(), name='home'),
#     path('about/', AboutView.as_view(), name='about'),
# ]

from django.urls import path
from .views import (
    HomeView,
    AboutView,
    MethodologyView,
    MunicipalitiesView,
    CityRiskComparisonView,
    SURPIIBuildingListView,
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
]
