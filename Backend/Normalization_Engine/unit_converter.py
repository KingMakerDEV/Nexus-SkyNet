from typing import Dict, Any


class UnitConverter:
    """
    Converts measurement units into a standardized unit system.
    """

    # Standard unit targets
    STANDARD_UNITS = {
        "temperature": "K",   # Kelvin
        "distance": "AU",     # Astronomical Unit
        "velocity": "m/s",
    }

    # Conversion rules
    CONVERSIONS = {
        # Temperature
        ("C", "K"): lambda v: v + 273.15,
        ("F", "K"): lambda v: (v - 32) * 5 / 9 + 273.15,
        ("K", "K"): lambda v: v,

        # Distance
        ("km", "AU"): lambda v: v / 149597870.7,
        ("m", "AU"): lambda v: v / 149597870700,
        ("AU", "AU"): lambda v: v,

        # Velocity
        ("km/s", "m/s"): lambda v: v * 1000,
        ("m/s", "m/s"): lambda v: v,
    }

    def convert_units(self, record: Dict[str, Any]) -> Dict[str, Any]:
        """
        Convert units in a dataset record to standard units.
        """

        value = record.get("value")
        unit = record.get("unit")

        if value is None or unit is None:
            return record

        unit = str(unit)

        # Determine conversion category
        target_unit = None

        if unit in ["C", "F", "K"]:
            target_unit = "K"

        elif unit in ["km", "m", "AU"]:
            target_unit = "AU"

        elif unit in ["km/s", "m/s"]:
            target_unit = "m/s"

        if not target_unit:
            return record

        conversion_key = (unit, target_unit)

        if conversion_key in self.CONVERSIONS:

            try:
                value = float(value)
                converted_value = self.CONVERSIONS[conversion_key](value)

                record["value"] = converted_value
                record["unit"] = target_unit

            except Exception:
                pass

        return record