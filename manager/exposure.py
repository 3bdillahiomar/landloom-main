"""Shared queries for municipality flood-exposure analysis.

A feature is *flood-exposed* when its geometry intersects the historical flood
extent (the dissolved "maximum observed" footprint -- no year or return-period
dimension, so membership is binary).

Testing ~1M building footprints against that ~2.5M-vertex polygon per request is
far too slow, so exposure is precomputed:

* ``refresh_flood_exposed_flags()`` does one heavy spatial pass (subdivided
  flood tiles + an indexed ``EXISTS`` test) and sets ``flood_exposed`` on
  ``SURPII_Building`` / ``SURPII_Road`` / ``IDP``.
* Everything else here just filters that indexed boolean, which is fast.

Run via ``python manage.py compute_exposure`` after loading or refreshing the
building / road / IDP / flood layers.
"""

from datetime import date

from django.contrib.gis.db.models.functions import Area, Length, Transform
from django.db import connection
from django.db.models import Count, Sum

from manager.models import (
    ConflictEvent,
    IDP,
    Municipality,
    SURPII_Building,
    SURPII_Road,
)

# CRS used only for area / length maths. Web Mercator distorts area by roughly
# 1 / cos(lat)**2; at Somalia's urban latitudes (~2-10 N) that stays under ~2%,
# immaterial for planning-grade figures. Faithful geometry is still in the
# GeoJSON download.
METRIC_SRID = 3857

RECENT_CONFLICT_YEARS = 3

BASIS = "maximum observed historical flood extent"

# Common name spellings mapped to the value stored in the Municipality table.
MUNICIPALITY_ALIASES = {
    "beledweyne": "Belet Weyne",
    "beled weyne": "Belet Weyne",
    "belet weyne": "Belet Weyne",
}

SUMMARY_FIELDS = (
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
)

# Models carrying a flood_exposed flag, in the order compute_exposure reports them.
FLAGGED_MODELS = (SURPII_Road, IDP, SURPII_Building)


def _normalize(name):
    return " ".join((name or "").split()).casefold()


def resolve_municipality(name):
    """Look up a :class:`Municipality` by name, tolerating spelling variants."""
    if not name:
        return None

    name = name.strip()
    match = Municipality.objects.filter(name__iexact=name).first()
    if match is not None:
        return match

    aliased = MUNICIPALITY_ALIASES.get(_normalize(name))
    if aliased:
        match = Municipality.objects.filter(name__iexact=aliased).first()
        if match is not None:
            return match

    target = _normalize(name)
    for municipality in Municipality.objects.all():
        if _normalize(municipality.name) == target:
            return municipality
    return None


def refresh_flood_exposed_flags():
    """Recompute ``flood_exposed`` on buildings, roads and IDP sites.

    Builds a subdivided, spatially indexed copy of the flood-extent union so the
    per-row test hits small tiles instead of one enormous polygon, then flips the
    flag with a single ``EXISTS`` UPDATE per table. Returns ``{model: count}``.
    """
    results = {}
    with connection.cursor() as cursor:
        cursor.execute("DROP TABLE IF EXISTS _flood_tiles;")
        cursor.execute(
            """
            CREATE TEMP TABLE _flood_tiles AS
            SELECT ST_Subdivide(u.geom, 256) AS geom
            FROM (
                SELECT ST_Union(geom) AS geom FROM manager_floodextent
            ) u
            WHERE u.geom IS NOT NULL;
            """
        )
        cursor.execute(
            "CREATE INDEX _flood_tiles_gix ON _flood_tiles USING gist (geom);"
        )
        cursor.execute("ANALYZE _flood_tiles;")

        cursor.execute("SELECT count(*) FROM _flood_tiles;")
        tile_count = cursor.fetchone()[0]

        for model in FLAGGED_MODELS:
            table = model._meta.db_table
            if tile_count == 0:
                cursor.execute(f'UPDATE "{table}" SET flood_exposed = FALSE;')
            else:
                cursor.execute(
                    f'''
                    UPDATE "{table}" AS f
                    SET flood_exposed = EXISTS (
                        SELECT 1 FROM _flood_tiles t
                        WHERE f.geom && t.geom AND ST_Intersects(f.geom, t.geom)
                    );
                    '''
                )
            results[model.__name__] = model.objects.filter(
                flood_exposed=True
            ).count()

        cursor.execute("DROP TABLE IF EXISTS _flood_tiles;")

    return results


def exposed_buildings_qs(muni):
    return SURPII_Building.objects.filter(
        flood_exposed=True, geom__intersects=muni.geom
    )


def exposed_roads_qs(muni):
    return SURPII_Road.objects.filter(
        flood_exposed=True, geom__intersects=muni.geom
    )


def exposed_idps_qs(muni):
    return IDP.objects.filter(
        flood_exposed=True, geom__intersects=muni.geom
    )


def municipality_conflicts_qs(muni):
    """Conflict events whose point falls inside the municipality boundary."""
    return ConflictEvent.objects.filter(geom__intersects=muni.geom)


def exposure_metrics(muni):
    """Compute the stored-summary numbers for one municipality."""
    metrics = {
        "municipality": muni.name,
        "basis": BASIS,
        "flood_buildings_count": 0,
        "flood_buildings_area_sqm": 0.0,
        "flood_roads_count": 0,
        "flood_roads_length_m": 0.0,
        "flood_idp_sites": 0,
        "flood_idp_households": 0,
        "flood_idp_individuals": 0,
        "conflict_events_total": 0,
        "conflict_events_recent": 0,
        "conflict_fatalities_total": 0,
    }

    building_stats = exposed_buildings_qs(muni).aggregate(
        n=Count("id"),
        area=Sum(Area(Transform("geom", METRIC_SRID))),
    )
    metrics["flood_buildings_count"] = building_stats["n"] or 0
    metrics["flood_buildings_area_sqm"] = float(
        getattr(building_stats["area"], "sq_m", 0.0) or 0.0
    )

    road_stats = exposed_roads_qs(muni).aggregate(
        n=Count("id"),
        length=Sum(Length(Transform("geom", METRIC_SRID))),
    )
    metrics["flood_roads_count"] = road_stats["n"] or 0
    metrics["flood_roads_length_m"] = float(
        getattr(road_stats["length"], "m", 0.0) or 0.0
    )

    idp_stats = exposed_idps_qs(muni).aggregate(
        n=Count("id"),
        households=Sum("idpHouseholds"),
        individuals=Sum("idpIndividuals"),
    )
    metrics["flood_idp_sites"] = idp_stats["n"] or 0
    metrics["flood_idp_households"] = idp_stats["households"] or 0
    metrics["flood_idp_individuals"] = idp_stats["individuals"] or 0

    conflicts = municipality_conflicts_qs(muni)
    conflict_stats = conflicts.aggregate(
        total=Count("id"),
        fatalities=Sum("fatalities"),
    )
    metrics["conflict_events_total"] = conflict_stats["total"] or 0
    metrics["conflict_fatalities_total"] = conflict_stats["fatalities"] or 0

    recent_cutoff = date.today().year - RECENT_CONFLICT_YEARS
    metrics["conflict_events_recent"] = conflicts.filter(
        year__gte=recent_cutoff
    ).count()

    return metrics
