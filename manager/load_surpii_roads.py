import os

from django.contrib.gis.gdal import DataSource
from django.contrib.gis.geos import GEOSGeometry, MultiLineString
from django.db import transaction

from .models import SURPII_Road


surpii_road_shp = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "data",
        "SURPII_roads",
        "SURPII_city_roads.shp",
    )
)


def run(verbose=True):
    ds = DataSource(surpii_road_shp)
    layer = ds[0]

    imported = 0
    skipped = 0
    roads = []

    for feat in layer:
        highway = feat.get("highway")
        admin2_name = feat.get("adm2_name")
        admin1_name = feat.get("adm1_name")

        # Skip features with missing required attributes
        if not highway or not admin2_name or not admin1_name:
            skipped += 1

            if verbose:
                print(
                    f"Skipped feature {feat.fid}: "
                    "missing highway or administrative attributes"
                )

            continue

        # Convert shapefile geometry to GEOS geometry
        geometry = GEOSGeometry(feat.geom.wkt, srid=4326)

        # Convert LineString to MultiLineString
        if geometry.geom_type == "LineString":
            geometry = MultiLineString(geometry, srid=4326)

        # Skip unsupported geometry types
        elif geometry.geom_type != "MultiLineString":
            skipped += 1

            if verbose:
                print(
                    f"Skipped feature {feat.fid}: "
                    f"unsupported geometry type {geometry.geom_type}"
                )

            continue

        roads.append(
            SURPII_Road(
                highway=str(highway),
                admin2Name=str(admin2_name),
                admin1Name=str(admin1_name),
                geom=geometry,
            )
        )

        # Insert records in batches of 1,000
        if len(roads) >= 1000:
            with transaction.atomic():
                SURPII_Road.objects.bulk_create(roads)

            imported += len(roads)
            roads.clear()

            if verbose:
                print(f"Imported {imported} roads...")

    # Insert remaining records
    if roads:
        with transaction.atomic():
            SURPII_Road.objects.bulk_create(roads)

        imported += len(roads)

    print("\nImport complete.")
    print(f"Imported: {imported}")
    print(f"Skipped : {skipped}")

