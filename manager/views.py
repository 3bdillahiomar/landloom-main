from django.shortcuts import render
from django.views.generic import TemplateView
from django.db.models import Count, Sum

from .models import (
    LandParcel,
    LandMark,
    District,
    AdministrativeBoundary,
    Municipality,
    SURPII_Building,
    SURPII_Road,
    River,
    IDP,
    ConflictEvent,
)


class AboutView(TemplateView):
    template_name = "about.html"


class HomeView(TemplateView):
    template_name = "home.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # Administrative Layers
        context["admin_boundaries"] = AdministrativeBoundary.objects.values("name")
        context["district_boundaries"] = District.objects.values("name")

        # Municipalities
        context["municipalities"] = Municipality.objects.values(
            "name",
            "admin1_name",
            "admin2_name",
        )

        # Buildings
        context["surpii_buildings"] = SURPII_Building.objects.values(
            "UrbanName",
            "admin1Name",
            "admin2Name",
            "UrbanType",
        )

        # Roads
        context["surpii_roads"] = SURPII_Road.objects.values(
            "highway",
            "admin1Name",
            "admin2Name",
        )

        # Rivers
        context["rivers"] = River.objects.values(
            "name",
            "river_class",
        )

        # IDP Table
        context["idps"] = IDP.objects.values(
            "settlementName",
            "admin2Name",
            "idpHouseholds",
            "idpIndividuals",
            "populationCategory",
        )

        # Dashboard Statistics
        context["total_municipalities"] = Municipality.objects.count()
        context["total_idps"] = IDP.objects.count()
        context["total_conflicts"] = ConflictEvent.objects.count()

        context["total_fatalities"] = (
            ConflictEvent.objects.aggregate(
                total=Sum("fatalities")
            )["total"] or 0
        )

        # Conflict data (for future filters/chart)
        context["conflicts"] = (
            ConflictEvent.objects.values("admin2")
            .exclude(admin2__isnull=True)
            .exclude(admin2="")
            .distinct()
            .order_by("admin2")
        )

        return context


class MethodologyView(TemplateView):
    template_name = "methodology.html"


class MunicipalitiesView(TemplateView):
    template_name = "municipalities.html"


class CityRiskComparisonView(TemplateView):
    template_name = "city_risk_comparison.html"


class SURPIIBuildingListView(TemplateView):
    template_name = "surpii_building_list.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["surpii_buildings"] = SURPII_Building.objects.values(
            "UrbanName",
            "admin1Name",
            "admin2Name",
            "UrbanType",
        )
        return context


class SURPIIRoadListView(TemplateView):
    template_name = "surpii_road_list.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["surpii_roads"] = SURPII_Road.objects.values(
            "highway",
            "admin1Name",
            "admin2Name",
        )
        return context


class RiverListView(TemplateView):
    template_name = "river_list.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["rivers"] = River.objects.values(
            "name",
            "river_class",
        )
        return context
    
    