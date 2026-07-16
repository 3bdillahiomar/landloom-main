import os

from django.contrib.gis.gdal import DataSource
from django.contrib.gis.geos import GEOSGeometry

from .models import River

river_shp = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "data",
        "som_rivers",
        "SOM_Rivers_Juba_shabelle.shp",
    )
)


def run(verbose=True):
    ds = DataSource(river_shp)
    layer = ds[0]

    imported = 0

    for feat in layer:
        River.objects.create(
            name=feat.get("NAME"),
            code=feat.get("CODE"),
            source=feat.get("SOURCE"),
            river_class=feat.get("CLASS"),
            length_m=feat.get("Length_M"),
            geom=GEOSGeometry(feat.geom.wkt, srid=4326),
        )

        imported += 1

        if verbose:
            print(f"Imported: {feat.get('NAME') or 'Unnamed River'}")

    print("\nImport complete.")
    print(f"Imported: {imported}")
