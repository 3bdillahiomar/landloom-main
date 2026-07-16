import os
from django.contrib.gis.utils import LayerMapping
from .models import District


district_mapping = {
    'name': 'adm2_name',
    'code': 'adm2_pcode',
    'geom': 'MULTIPOLYGON',
}


district_shp = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        'data',
        'som_admin2.shp'
    )
)


def run(verbose=True):
    layer_mapping = LayerMapping(
        District,
        district_shp,
        district_mapping,
        transform=False,
    )

    layer_mapping.save(
        strict=True,
        verbose=verbose,
    )