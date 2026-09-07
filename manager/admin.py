from django.contrib import admin
from .models import FloodExtent, ConflictEvent, IDP, River, SURPII_Road, SURPII_Building, Owner, LandParcel, LandMark, Road, Building, AdministrativeBoundary, District, Municipality, MunicipalityExposureSummary
from leaflet.admin import LeafletGeoAdmin

class OwnerAdmin(LeafletGeoAdmin):
    list_display = ('full_name', 'email', 'phone_number', 'created_at', 'updated_at')
    search_fields = ('full_name', 'email', 'phone_number', 'id_number')
    list_filter = ('created_at', 'updated_at')
    ordering = ('-created_at',)

class LandParcelAdmin(LeafletGeoAdmin):
    list_display = ('parcel_number', 'area', 'land_use_type', 'created_at', 'updated_at')
    search_fields = ('parcel_number',)
    list_filter = ('land_use_type', 'created_at', 'updated_at')
    ordering = ("-created_at",)

class LandMarkAdmin(LeafletGeoAdmin):
    list_display = ('name', 'landmark_type', 'created_at', 'updated_at')
    search_fields = ('name',)
    list_filter = ('landmark_type', 'created_at', 'updated_at')
    ordering = ("-created_at",)

class RoadAdmin(LeafletGeoAdmin):
    list_display = ('name', 'road_type', 'created_at', 'updated_at')
    search_fields = ('name',)
    list_filter = ('road_type', 'created_at', 'updated_at')
    ordering = ("-created_at",)

class BuildingAdmin(LeafletGeoAdmin):
    list_display = ('name', 'building_type', 'created_at', 'updated_at')
    search_fields = ('name',)
    list_filter = ('building_type', 'created_at', 'updated_at')
    ordering = ("-created_at",)

class AdministrativeBoundaryAdmin(LeafletGeoAdmin):
    list_display = ('name', 'boundary_type', 'created_at', 'updated_at')
    search_fields = ('name',)
    list_filter = ('boundary_type', 'created_at', 'updated_at')
    ordering = ("-created_at",)

class DistrictAdmin(LeafletGeoAdmin):
    list_display = ('name', 'boundary_type', 'created_at', 'updated_at')
    search_fields = ('name',)
    list_filter = ('boundary_type', 'created_at', 'updated_at')
    ordering = ("-created_at",)

class MunicipalityAdmin(LeafletGeoAdmin):
    list_display = ('name', 'admin1_name', 'admin2_name', 'created_at', 'updated_at')
    search_fields = ('name',)
    list_filter = ('admin1_name', 'admin2_name', 'created_at', 'updated_at')
    ordering = ("-created_at",)


class SURPIIBuildingAdmin(LeafletGeoAdmin):
    list_display = ("UrbanName",
        "admin2Name",
        "admin1Name",
        "UrbanType",
        "created_at",
        "updated_at",
    )

    search_fields = (
        "UrbanName",
        "admin2Name",
        "admin1Name",
    )

    list_filter = (
        "admin1Name",
        "UrbanType",
        "created_at",
        "updated_at",
    )

    ordering = ("UrbanName",)

class SURPIIRoadAdmin(LeafletGeoAdmin):
    list_display = ("highway", "admin2Name", "admin1Name", "created_at", "updated_at")
    search_fields = ("highway", "admin2Name", "admin1Name")
    list_filter = ("admin1Name", "highway", "created_at", "updated_at")
    ordering = ("highway",)

class RiverAdmin(LeafletGeoAdmin):
    list_display = ("name", "river_class", "created_at", "updated_at")
    search_fields = ("name",)
    list_filter = ("river_class", "created_at", "updated_at")
    ordering = ("name",)

class IDPAdmin(LeafletGeoAdmin):
    list_display = ("settlementName","urbanName", "admin1Name", "admin2Name", "settlementClass", "idpIndividuals", "populationCategory", "created_at", "updated_at")
    search_fields = ("settlementName", "urbanName", "admin1Name", "admin2Name")
    list_filter = ("admin1Name", "urbanName", "settlementClass")
    ordering = ("urbanName", "admin1Name", "admin2Name")

class ConflictEventAdmin(LeafletGeoAdmin):
    list_display = ("event_type", "admin1", "admin2", "event_date", "created_at", "updated_at")
    search_fields = ("event_type", "admin1", "admin2Name")
    list_filter = ("event_type", "admin1", "admin2", "event_date")
    ordering = ("-year",)


class FloodExtentAdmin(LeafletGeoAdmin):
    list_display = ("id", "created_at", "updated_at")
    list_filter = ("created_at", "updated_at")
    ordering = ("-created_at",)


class MunicipalityExposureSummaryAdmin(admin.ModelAdmin):
    list_display = (
        "municipality",
        "flood_buildings_count",
        "flood_roads_length_m",
        "flood_idp_individuals",
        "conflict_events_recent",
        "computed_at",
    )
    search_fields = ("municipality__name",)
    ordering = ("municipality__name",)

    def get_readonly_fields(self, request, obj=None):
        return [field.name for field in self.model._meta.fields]


admin.site.register(Owner, OwnerAdmin)
admin.site.register(LandParcel, LandParcelAdmin)
admin.site.register(LandMark, LandMarkAdmin)
admin.site.register(Road, RoadAdmin)
admin.site.register(SURPII_Building, SURPIIBuildingAdmin)
admin.site.register(Building, BuildingAdmin)
admin.site.register(AdministrativeBoundary, AdministrativeBoundaryAdmin)
admin.site.register(District, DistrictAdmin)
admin.site.register(Municipality, MunicipalityAdmin)
admin.site.register(SURPII_Road, SURPIIRoadAdmin)
admin.site.register(River, RiverAdmin)
admin.site.register(IDP, IDPAdmin)
admin.site.register(ConflictEvent, ConflictEventAdmin)
admin.site.register(MunicipalityExposureSummary, MunicipalityExposureSummaryAdmin)
