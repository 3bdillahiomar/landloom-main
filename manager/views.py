from django.shortcuts import render
from django.views.generic import TemplateView

from .models import LandParcel, LandMark, District, AdministrativeBoundary, Municipality, SURPII_Building, SURPII_Road, River, IDP, ConflictEvent
from django.db.models import Count
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required


class AboutView(TemplateView):
    template_name = 'about.html'

class HomeView(TemplateView):
    template_name = 'home.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        data = (LandParcel.objects.values('land_use_type').
                annotate(count= Count('id'))
                

        )
        parcels = LandParcel.objects.values('parcel_number', 'owner', 'area', 'land_use_type')
        landmarks = LandMark.objects.all()
        admin_boundaries = AdministrativeBoundary.objects.values('name')
        district_boundaries = District.objects.values('name')

        context['admin_boundaries'] = admin_boundaries
        context['district_boundaries'] = district_boundaries
        context['municipalities'] = Municipality.objects.values('name', 'admin1_name', 'admin2_name')
        context['surpii_buildings'] = SURPII_Building.objects.values('UrbanName', 'admin1Name', 'admin2Name', 'UrbanType')
        context['surpii_roads'] = SURPII_Road.objects.values('highway', 'admin1Name', 'admin2Name')
        context['rivers'] = River.objects.values('name', 'river_class')
        context["land_use_types"] = {item["land_use_type"]: item["count"] for item in data}
        context['counts'] = sum(item['count'] for item in data)
        context['parcels'] = parcels
        context['landmarks'] = landmarks
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
        context['surpii_buildings'] = SURPII_Building.objects.values('UrbanName', 'admin1Name', 'admin2Name', 'UrbanType')
        return context

class SURPIIRoadListView(TemplateView):
    template_name = "surpii_road_list.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['surpii_roads'] = SURPII_Road.objects.values('highway', 'admin1Name', 'admin2Name')
        return context

class RiverListView(TemplateView):
    template_name = "river_list.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['rivers'] = River.objects.values('name', 'river_class')
        return context
