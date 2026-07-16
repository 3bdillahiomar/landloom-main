from django.db import models
from django.contrib.gis.db import models as geomodels
from django.contrib.auth.models import User


land_use_choices = [
    ('residential', 'Residential'),
    ('commercial', 'Commercial'),
    ('agricultural', 'Agricultural'),
    ('industrial', 'Industrial'),
    ('recreational', 'Recreational'),
]


owner_gender = [
    ('male', 'Male'),
    ('female', 'Female'),
]


class Owner(models.Model):
    full_name = models.CharField(max_length=255)
    id_number = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(
        max_length=20,
        choices=owner_gender,
        default='male'
    )
    user = models.OneToOneField(
        'auth.User',
        on_delete=models.CASCADE,
        related_name='owner_profile',
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name


class LandParcel(models.Model):
    parcel_number = models.CharField(max_length=100, unique=True)
    area = models.FloatField(null=True, blank=True)
    land_use_type = models.CharField(
        max_length=20,
        choices=land_use_choices,
        default='residential'
    )
    owner = models.ForeignKey(
        Owner,
        on_delete=models.SET_NULL,
        related_name='land_parcels',
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    geom = geomodels.PolygonField(srid=4326)

    def __str__(self):
        return f"Parcel {self.parcel_number} - {self.land_use_type} ({self.area} m²)"

class LandMark(models.Model):
    name = models.CharField(max_length=255)
    landmark_type = models.CharField(
        max_length=100,
        choices=[
            ('school', 'School'),
            ('hospital', 'Hospital'),
            ('park', 'Park'),
            ('market', 'Market'),
            ('religious', 'Religious Place'),
            ('monument', 'Monument'),
            ('other', 'Other'),
        ],
        default='other'
    )
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    geom = geomodels.PointField(srid=4326)

    def __str__(self):
        return self.name


class Road(models.Model):
    name = models.CharField(max_length=255)
    road_type = models.CharField(
        max_length=100,
        choices=[
            ('asphalt', 'Asphalt'),
            ('gravel', 'Gravel'),
            ('dirt', 'Dirt'),
            ('paved', 'Paved'),
        ],
        default='asphalt'
    )
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    geom = geomodels.LineStringField(srid=4326)

    def __str__(self):
        return self.name


class Building(models.Model):
    name = models.CharField(max_length=255)
    building_type = models.CharField(
        max_length=100,
        choices=[
            ('residential', 'Residential'),
            ('commercial', 'Commercial'),
            ('industrial', 'Industrial'),
            ('institutional', 'Institutional'),
        ],
        default='residential'
    )
    parcel = models.ForeignKey(
        LandParcel,
        on_delete=models.SET_NULL,
        related_name='buildings',
        null=True,
        blank=True,
    )
    owner = models.ForeignKey(
        Owner,
        on_delete=models.SET_NULL,
        related_name='building_ownership',
        null=True,
        blank=True,
    )
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    geom = geomodels.PolygonField(srid=4326)

    def __str__(self):
        return self.name

class AdministrativeBoundary(models.Model):
    name = models.CharField(max_length=255)

    boundary_type = models.CharField(
        max_length=100,
        choices=[
            ('region', 'Region'),
        ],
        default='region'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    geom = geomodels.MultiPolygonField(srid=4326)

    def __str__(self):
        return f"{self.name} ({self.boundary_type})"
    class Meta:
        verbose_name = "Administrative Boundary"
        verbose_name_plural = "Administrative Boundaries"


class District(models.Model):
    name = models.CharField(max_length=255)
    boundary_type = models.CharField(
            max_length=100,
            choices=[
                ('district', 'District'),
            ],
            default='district'
        )

    code = models.CharField(
        max_length=50,
        unique=True,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    geom = geomodels.MultiPolygonField(srid=4326)

    def __str__(self):
        return f"{self.name} ({self.code})"

    class Meta:
        verbose_name = "District"
        verbose_name_plural = "Districts"
        ordering = ["name"]


class Municipality(models.Model):
    name = models.CharField(max_length=150)
    urban_type = models.CharField(max_length=100)
    admin1_name = models.CharField(max_length=100)
    admin2_name = models.CharField(max_length=100)
    admin2_pcode = models.CharField(max_length=30)
    geom = geomodels.MultiPolygonField(srid=4326)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    boundary_type = models.CharField(
            max_length=100,
            choices=[
                ('mun', 'Municipality'),
            ],
            default='municipality'
        )
    class Meta:
        ordering = ["name"]
        verbose_name = "Municipality"
        verbose_name_plural = "Municipalities"

    def __str__(self):
        return self.name


# SURPII Buildings model
class SURPII_Building(models.Model):
    admin2Name = models.CharField(max_length=100)
    admin2Pcod = models.CharField(max_length=30)
    admin1Name = models.CharField(max_length=100)
    UrbanName = models.CharField(max_length=100)
    UrbanType = models.CharField(max_length=100)

    geom = geomodels.MultiPolygonField(srid=4326)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["admin2Name"]
        verbose_name = "SURPII Building"
        verbose_name_plural = "SURPII Buildings"

    def __str__(self):
        return self.UrbanName


# SURPII Roads model

class SURPII_Road(models.Model):
    highway = models.CharField(max_length=50)
    admin2Name = models.CharField(max_length=100)
    admin1Name = models.CharField(max_length=100)

    geom = geomodels.MultiLineStringField(srid=4326)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["admin2Name", "highway"]
        verbose_name = "SURPII Road"
        verbose_name_plural = "SURPII Roads"

    def __str__(self):
        return f"{self.highway} - {self.admin2Name}"


# Rivers model
class River(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)

    code = models.CharField(max_length=10)

    source = models.CharField(max_length=100)

    river_class = models.IntegerField()

    length_m = models.FloatField()

    geom = geomodels.LineStringField(srid=4326)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "River"
        verbose_name_plural = "Rivers"

    def __str__(self):
        return self.name if self.name else f"Unnamed River ({self.code})"


# IDP Settlement model
class IDP(models.Model):
    urbanName = models.CharField(max_length=100, blank=True, null=True)
    urbanType = models.CharField(max_length=100, blank=True, null=True)

    admin1Name = models.CharField(max_length=100, blank=True, null=True)
    admin2Name = models.CharField(max_length=100, blank=True, null=True)

    settlementName = models.CharField(max_length=150, blank=True, null=True)
    settlementDTMId = models.CharField(max_length=100, blank=True, null=True)
    settlementClass = models.CharField(max_length=100, blank=True, null=True)

    idpHouseholds = models.IntegerField(blank=True, null=True)
    idpIndividuals = models.IntegerField(blank=True, null=True)

    populationCategory = models.CharField(max_length=50, blank=True, null=True)

    geom = geomodels.PointField(srid=4326)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["urbanName", "settlementName"]
        verbose_name = "IDP Settlement"
        verbose_name_plural = "IDP Settlements"

    def __str__(self):
        return self.settlementName or "Unnamed IDP Settlement"

# Conflict/Insurgency model
class ConflictEvent(models.Model):
    event_id = models.CharField(max_length=254, unique=True)
    event_date = models.DateField()
    year = models.IntegerField(db_index=True)

    disorder_type = models.CharField(max_length=254, blank=True, null=True)
    event_type = models.CharField(max_length=254, blank=True, null=True)
    sub_event_type = models.CharField(max_length=254, blank=True, null=True)

    actor1 = models.CharField(max_length=254, blank=True, null=True)
    associated_actor1 = models.CharField(max_length=254, blank=True, null=True)
    actor2 = models.CharField(max_length=254, blank=True, null=True)
    associated_actor2 = models.CharField(max_length=254, blank=True, null=True)

    civilian_targeting = models.CharField(
        max_length=254,
        blank=True,
        null=True,
    )

    region = models.CharField(max_length=254, blank=True, null=True)
    country = models.CharField(max_length=254, blank=True, null=True)

    admin1 = models.CharField(max_length=254, blank=True, null=True)
    admin2 = models.CharField(max_length=254, blank=True, null=True)
    admin3 = models.CharField(max_length=254, blank=True, null=True)

    location = models.CharField(max_length=254, blank=True, null=True)

    source = models.CharField(max_length=254, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    fatalities = models.IntegerField(default=0)

    geom = geomodels.PointField(srid=4326)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-event_date"]
        verbose_name = "Conflict Event"
        verbose_name_plural = "Conflict Events"
        indexes = [
            models.Index(fields=["year"]),
            models.Index(fields=["admin1"]),
            models.Index(fields=["admin2"]),
            models.Index(fields=["event_type"]),
        ]

    def __str__(self):
        return f"{self.event_type} - {self.location} - {self.event_date}"


# Flood model
# Historical Flood Extent model
class FloodExtent(models.Model):
    geom = geomodels.MultiPolygonField(srid=4326)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Historical Flood Extent"
        verbose_name_plural = "Historical Flood Extents"

    def __str__(self):
        return "Historical Flood Extent"
    

