import os

from django.contrib.gis.gdal import DataSource
from django.contrib.gis.geos import GEOSGeometry

from .models import IDP

idp_shp = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "data",
        "SURPII_idps",
        "SURPII_city_idps.shp",
    )
)


def run(verbose=True):
    ds = DataSource(idp_shp)
    layer = ds[0]

    imported = 0

    for feat in layer:
        IDP.objects.create(
            urbanName=feat.get("UrbanName"),
            urbanType=feat.get("UrbanType"),
            admin1Name=feat.get("ADM1_EN"),
            admin2Name=feat.get("ADM2_EN"),
            settlementName=feat.get("Sett_Name"),
            settlementDTMId=feat.get("SettDTM_ID"),
            settlementClass=feat.get("Sett_class"),
            idpHouseholds=feat.get("IDP_HHs"),
            idpIndividuals=feat.get("IDP_Ind"),
            populationCategory=feat.get("POPCAT"),
            geom=GEOSGeometry(feat.geom.wkt, srid=4326),
        )

        imported += 1

        if verbose and imported % 500 == 0:
            print(f"Imported {imported} IDP settlements...")

    print("\nImport complete.")
    print(f"Imported: {imported}")
