import os

from django.contrib.gis.utils import LayerMapping
from .models import SURPII_Building

surpii_building_mapping = {
    "admin2Name": "admin2Name",
    "admin2Pcod": "admin2Pcod",
    "admin1Name": "admin1Name",
    "UrbanName": "UrbanName",
    "UrbanType": "UrbanType",
    "geom": "MULTIPOLYGON",
}

surpii_building_shp = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "data",
        "SURPII_buildings",
        "SURPII_buildings_with_municipality.shp",
    )
)


def run(verbose=True):
    lm = LayerMapping(
        SURPII_Building,
        surpii_building_shp,
        surpii_building_mapping,
        transform=False,
    )

    lm.save(
        strict=False,
        verbose=verbose,
    )
