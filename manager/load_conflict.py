import os

from django.contrib.gis.gdal import DataSource
from django.contrib.gis.geos import GEOSGeometry

from .models import ConflictEvent

conflict_shp = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "data",
        "som_conflicts",
        "SURPII_city_insurgency.shp",
    )
)


def run(verbose=True):
    ds = DataSource(conflict_shp)
    layer = ds[0]

    imported = 0

    for feat in layer:
        ConflictEvent.objects.create(
            event_id=feat.get("event_id_c"),
            event_date=feat.get("event_date"),
            year=feat.get("year"),
            disorder_type=feat.get("disorder_t"),
            event_type=feat.get("event_type"),
            sub_event_type=feat.get("sub_event_"),
            actor1=feat.get("actor1"),
            associated_actor1=feat.get("assoc_acto"),
            actor2=feat.get("actor2"),
            associated_actor2=feat.get("assoc_ac_1"),
            civilian_targeting=feat.get("civilian_t"),
            region=feat.get("region"),
            country=feat.get("country"),
            admin1=feat.get("admin1"),
            admin2=feat.get("admin2"),
            admin3=feat.get("admin3"),
            location=feat.get("location"),
            source=feat.get("source"),
            notes=feat.get("notes"),
            fatalities=feat.get("fatalities"),
            geom=GEOSGeometry(feat.geom.wkt, srid=4326),
        )

        imported += 1

        if verbose and imported % 1000 == 0:
            print(f"Imported {imported} conflict events...")

    print("\nImport complete.")
    print(f"Imported: {imported}")
