import os
from django.contrib.gis.utils import LayerMapping
from .models import AdministrativeBoundary

adminboundary_mapping = {
    'name': 'adm1_name',
    'geom': 'MULTIPOLYGON',
}

adminboundary_shp = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        'data',
        'som_admin1.shp'
    )
)

def run(verbose=True):
    lm = LayerMapping(
        AdministrativeBoundary,
        adminboundary_shp,
        adminboundary_mapping,
        transform=False,
    )
    lm.save(strict=True, verbose=verbose)


