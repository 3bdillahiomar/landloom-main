"""Recompute flood-exposure data for municipalities.

Two phases:

1. Set the ``flood_exposed`` flag on every building / road / IDP site that
   intersects the historical flood extent (one heavy spatial pass; skip with
   ``--skip-flags`` when only the summaries need refreshing).
2. Roll the flagged features up into a stored ``MunicipalityExposureSummary``
   per municipality (fast; backs the KPI cards and the comparison page).

Usage::

    python manage.py compute_exposure                          # flags + all summaries
    python manage.py compute_exposure --municipality "Belet Weyne"
    python manage.py compute_exposure --skip-flags             # summaries only
"""

from django.core.management.base import BaseCommand

from manager.exposure import (
    SUMMARY_FIELDS,
    exposure_metrics,
    refresh_flood_exposed_flags,
)
from manager.models import Municipality, MunicipalityExposureSummary


class Command(BaseCommand):
    help = "Recompute flood-exposure flags and per-municipality summaries."

    def add_arguments(self, parser):
        parser.add_argument(
            "--municipality",
            dest="municipality",
            default=None,
            help="Only refresh this municipality's summary. Omit to do all.",
        )
        parser.add_argument(
            "--skip-flags",
            dest="skip_flags",
            action="store_true",
            help="Skip the flood_exposed recompute; refresh summaries only.",
        )

    def handle(self, *args, **options):
        if not options["skip_flags"]:
            self.stdout.write("Recomputing flood_exposed flags...")
            counts = refresh_flood_exposed_flags()
            for model_name, count in counts.items():
                self.stdout.write(
                    self.style.SUCCESS(f"  {model_name}: {count:,} flood-exposed")
                )

        name = options["municipality"]
        if name:
            municipalities = Municipality.objects.filter(name__iexact=name.strip())
            if not municipalities.exists():
                self.stderr.write(
                    self.style.ERROR(f'No municipality named "{name}".')
                )
                return
        else:
            municipalities = Municipality.objects.all()

        if not municipalities:
            self.stdout.write(self.style.WARNING("No municipalities found."))
            return

        for muni in municipalities:
            metrics = exposure_metrics(muni)
            defaults = {field: metrics[field] for field in SUMMARY_FIELDS}
            MunicipalityExposureSummary.objects.update_or_create(
                municipality=muni,
                defaults=defaults,
            )
            self.stdout.write(
                self.style.SUCCESS(
                    "{name}: {b:,} buildings ({a:,.0f} m2), "
                    "{r:,} roads ({length:,.0f} m), "
                    "{s} IDP sites / {i:,} individuals, "
                    "{c:,} conflict events ({recent} in last 3y)".format(
                        name=muni.name,
                        b=metrics["flood_buildings_count"],
                        a=metrics["flood_buildings_area_sqm"],
                        r=metrics["flood_roads_count"],
                        length=metrics["flood_roads_length_m"],
                        s=metrics["flood_idp_sites"],
                        i=metrics["flood_idp_individuals"],
                        c=metrics["conflict_events_total"],
                        recent=metrics["conflict_events_recent"],
                    )
                )
            )
