import os

from django.contrib.gis.gdal import DataSource
from django.contrib.gis.geos import GEOSGeometry

from .models import FloodExtent

flood_shp = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "data",
        "som_floods",
        "flood_historical",
        "flood_extent_historical_dissolved.shp",
    )
)


def run(verbose=True):
    ds = DataSource(flood_shp)
    layer = ds[0]

    FloodExtent.objects.all().delete()

    imported = 0

    for feat in layer:
        FloodExtent.objects.create(
            geom=GEOSGeometry(feat.geom.wkt, srid=4326),
        )

        imported += 1

    print("\nImport complete.")
    print(f"Imported: {imported}")
