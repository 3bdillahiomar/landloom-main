from rest_framework_gis.serializers import GeoFeatureModelSerializer
from manager.models import FloodExtent, ConflictEvent, IDP, River, SURPII_Road, SURPII_Building, Municipality, MunicipalityExposureSummary, Owner, LandParcel, LandMark, Road, Building, AdministrativeBoundary, District
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate


class LandParcelSerializer(GeoFeatureModelSerializer):
    owner = serializers.StringRelatedField()

    class Meta:
        model = LandParcel
        geo_field = "geom"
        fields = "__all__"

# Here's a new serializer for LandParcel that excludes the geom field.
class LandParcelListSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField()

    class Meta:
        model = LandParcel
        # fields = ("id", "owner", "parcel_number", "land_use_type", "description")
        exclude = ["geom","created_at", "updated_at"] 


class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owner
        exclude = ["user"]

class LandMarkSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = LandMark
        geo_field = "geom"
        fields = "__all__"

class RoadSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Road
        geo_field = "geom"
        fields = "__all__"


class BuildingSerializer(GeoFeatureModelSerializer):
    owner = serializers.StringRelatedField()
    parcel = serializers.StringRelatedField()

    class Meta:
        model = Building
        geo_field = "geom"
        fields = "__all__"

class AdministrativeBoundarySerializer(GeoFeatureModelSerializer):
    class Meta:
        model = AdministrativeBoundary
        geo_field = "geom"
        fields = "__all__"

class DistrictSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = District
        geo_field = "geom"
        fields = "__all__"


class MunicipalitySerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Municipality
        geo_field = "geom"
        fields = "__all__"


class SURPIIBuildingSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = SURPII_Building

        geo_field = "geom"

        fields = (
            "id",
            "admin2Name",
            "admin2Pcod",
            "admin1Name",
            "UrbanName",
            "UrbanType",
        )

class SURPIIRoadSerializer(GeoFeatureModelSerializer):
    class Meta:
        model=SURPII_Road

        geo_field = "geom"

        fields = (
            "admin2Name",
            "admin1Name",
            "highway"
        )

class RiverSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = River
        geo_field = "geom"
        fields = (
            "name",
            "river_class",
        )

class IDPSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = IDP
        geo_field = "geom"
        fields = (
            "settlementName",
            "settlementDTMId",
            "urbanName",
            "admin1Name",
            "admin2Name",
            "settlementClass",
            "idpIndividuals",
            "idpHouseholds",
            "populationCategory",
        )

class ConflictEventSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = ConflictEvent
        geo_field = "geom"
        fields = (
            "event_id",
            "event_date",
            "year",
            "disorder_type",
            "event_type",
            "sub_event_type",
            "actor1",
            "associated_actor1",
            "actor2",
            "associated_actor2",
            "civilian_targeting",
            "region",
            "country",
            "admin1",
            "admin2",
            "admin3",
            "location",
            "source",
            "notes",
            "fatalities",
        )


class FloodExtentSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = FloodExtent
        geo_field = "geom"
        fields = "__all__"

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class LoginSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password')

    def validate(self, data):
        user = authenticate(
            username=data['username'],
            password=data['password']
        )

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        data['user'] = user

        return {'user': user}


class MunicipalityExposureSummarySerializer(serializers.ModelSerializer):
    municipality = serializers.CharField(
        source="municipality.name",
        read_only=True,
    )
    basis = serializers.SerializerMethodField()
    stale = serializers.SerializerMethodField()

    class Meta:
        model = MunicipalityExposureSummary
        fields = (
            "municipality",
            "basis",
            "flood_buildings_count",
            "flood_buildings_area_sqm",
            "flood_roads_count",
            "flood_roads_length_m",
            "flood_idp_sites",
            "flood_idp_households",
            "flood_idp_individuals",
            "conflict_events_total",
            "conflict_events_recent",
            "conflict_fatalities_total",
            "computed_at",
            "stale",
        )

    def get_basis(self, obj):
        return "maximum observed historical flood extent"

    def get_stale(self, obj):
        return False
