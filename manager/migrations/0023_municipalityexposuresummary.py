import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("manager", "0022_alter_floodextent_options_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="MunicipalityExposureSummary",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("flood_buildings_count", models.IntegerField(default=0)),
                ("flood_buildings_area_sqm", models.FloatField(default=0)),
                ("flood_roads_count", models.IntegerField(default=0)),
                ("flood_roads_length_m", models.FloatField(default=0)),
                ("flood_idp_sites", models.IntegerField(default=0)),
                ("flood_idp_households", models.IntegerField(default=0)),
                ("flood_idp_individuals", models.IntegerField(default=0)),
                ("conflict_events_total", models.IntegerField(default=0)),
                ("conflict_events_recent", models.IntegerField(default=0)),
                ("conflict_fatalities_total", models.IntegerField(default=0)),
                ("computed_at", models.DateTimeField(auto_now=True)),
                (
                    "municipality",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="exposure_summary",
                        to="manager.municipality",
                    ),
                ),
            ],
            options={
                "verbose_name": "Municipality Exposure Summary",
                "verbose_name_plural": "Municipality Exposure Summaries",
                "ordering": ["municipality__name"],
            },
        ),
    ]
