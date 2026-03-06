from typing import Dict, Any
import math


class CoordinateConverter:
    """
    Converts spatial coordinates into a unified reference system.

    Supported inputs:
    - Latitude / Longitude
    - Right Ascension (RA) / Declination (Dec)

    Output format:
    - Normalized equatorial coordinates (ra_deg, dec_deg)
    """

    def convert_coordinates(self, record: Dict[str, Any]) -> Dict[str, Any]:
        """
        Detect coordinate format and normalize it.
        """

        # Case 1: Already RA / Dec
        if "ra" in record and "dec" in record:
            record["ra_deg"] = self._to_float(record["ra"])
            record["dec_deg"] = self._to_float(record["dec"])
            return record

        # Case 2: Latitude / Longitude
        if "latitude" in record and "longitude" in record:
            ra, dec = self._latlon_to_equatorial(
                record["latitude"],
                record["longitude"]
            )

            record["ra_deg"] = ra
            record["dec_deg"] = dec

        return record

    def _latlon_to_equatorial(self, lat: Any, lon: Any):
        """
        Convert lat/lon to equatorial approximation.
        """

        lat = self._to_float(lat)
        lon = self._to_float(lon)

        # simple placeholder conversion
        ra = (lon % 360)
        dec = lat

        return ra, dec

    def _to_float(self, value: Any) -> float:
        """
        Safely convert value to float.
        """

        try:
            return float(value)
        except Exception:
            return 0.0