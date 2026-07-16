import os
from django.contrib.gis.utils import LayerMapping
from .models import Municipality

municipality_mapping = {
    "name": "UrbanName",
    "urban_type": "UrbanType",
    "admin1_name": "admin1Name",
    "admin2_name": "admin2Name",
    "admin2_pcode": "admin2Pcod",
    "geom": "MULTIPOLYGON",
}

municipality_shp = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "data/SURPII_city_polygons/SURPII_city_polygons.shp")
)

def run(verbose=True):
    layer_mapping = LayerMapping(
        Municipality,
        municipality_shp,
        municipality_mapping,
        transform=False,
    )

    layer_mapping.save(
        strict=True,
        verbose=verbose,
    )
