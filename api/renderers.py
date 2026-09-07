"""CSV rendering for the flood-exposure endpoints.

Flattens a GeoJSON ``FeatureCollection`` (as produced by the DRF-GIS
``GeoFeatureModelSerializer``) into one row per feature: every ``properties``
key becomes a column, plus ``geometry_type`` / ``geometry_coordinates`` columns
holding the raw GeoJSON geometry. Uses only the standard library.
"""

import csv
import io

from rest_framework.renderers import BaseRenderer


class ExposureCSVRenderer(BaseRenderer):
    media_type = "text/csv"
    format = "csv"
    charset = "utf-8"

    def render(self, data, accepted_media_type=None, renderer_context=None):
        if data is None:
            return b""

        buffer = io.StringIO()
        writer = csv.writer(buffer)

        # Non-collection payloads (errors, summary hints) -> key/value dump.
        if not isinstance(data, dict) or "features" not in data:
            writer.writerow(["key", "value"])
            if isinstance(data, dict):
                for key, value in data.items():
                    writer.writerow([key, value])
            else:
                writer.writerow(["detail", data])
            return buffer.getvalue().encode(self.charset)

        features = data.get("features") or []

        property_keys = []
        for feature in features:
            for key in (feature.get("properties") or {}):
                if key not in property_keys:
                    property_keys.append(key)

        writer.writerow(
            list(property_keys) + ["geometry_type", "geometry_coordinates"]
        )

        for feature in features:
            props = feature.get("properties") or {}
            geometry = feature.get("geometry") or {}
            writer.writerow(
                [props.get(key, "") for key in property_keys]
                + [geometry.get("type", ""), geometry.get("coordinates", "")]
            )

        return buffer.getvalue().encode(self.charset)
