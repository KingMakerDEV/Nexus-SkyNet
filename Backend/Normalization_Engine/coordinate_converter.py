

import math
from typing import Tuple


class CoordinateConverter:
    """
    Handles coordinate system conversions.
    """

    @staticmethod
    def latlon_to_cartesian(lat: float, lon: float, radius: float = 6371.0) -> Tuple[float, float, float]:
        """
        Convert latitude/longitude (degrees) to Cartesian coordinates (x, y, z).
        Default radius = Earth's radius in km.
        """
        lat_rad = math.radians(lat)
        lon_rad = math.radians(lon)

        x = radius * math.cos(lat_rad) * math.cos(lon_rad)
        y = radius * math.cos(lat_rad) * math.sin(lon_rad)
        z = radius * math.sin(lat_rad)

        return x, y, z

    @staticmethod
    def cartesian_to_latlon(x: float, y: float, z: float) -> Tuple[float, float]:
        """
        Convert Cartesian coordinates back to latitude/longitude (degrees).
        """
        radius = math.sqrt(x**2 + y**2 + z**2)
        lat = math.degrees(math.asin(z / radius))
        lon = math.degrees(math.atan2(y, x))
        return lat, lon
