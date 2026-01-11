

class UnitConverter:
    """
    Handles unit conversions for terrestrial and space-related units.
    """

    # --- Distance ---
    @staticmethod
    def miles_to_km(miles: float) -> float:
        return miles * 1.60934

    @staticmethod
    def km_to_miles(km: float) -> float:
        return km / 1.60934

    @staticmethod
    def km_to_au(km: float) -> float:
        return km / 149_597_870.7  # 1 AU in km

    @staticmethod
    def au_to_km(au: float) -> float:
        return au * 149_597_870.7

    @staticmethod
    def km_to_lightyears(km: float) -> float:
        return km / 9.461e12  # 1 ly in km

    @staticmethod
    def lightyears_to_km(ly: float) -> float:
        return ly * 9.461e12

    @staticmethod
    def km_to_parsecs(km: float) -> float:
        return km / 3.086e13  # 1 parsec in km

    @staticmethod
    def parsecs_to_km(pc: float) -> float:
        return pc * 3.086e13

    # --- Mass ---
    @staticmethod
    def kg_to_solar_masses(kg: float) -> float:
        return kg / 1.989e30  # 1 solar mass in kg

    @staticmethod
    def solar_masses_to_kg(msun: float) -> float:
        return msun * 1.989e30

    @staticmethod
    def kg_to_earth_masses(kg: float) -> float:
        return kg / 5.972e24  # 1 Earth mass in kg

    @staticmethod
    def earth_masses_to_kg(mearth: float) -> float:
        return mearth * 5.972e24

    # --- Temperature ---
    @staticmethod
    def fahrenheit_to_celsius(f: float) -> float:
        return (f - 32) * 5.0 / 9.0

    @staticmethod
    def celsius_to_fahrenheit(c: float) -> float:
        return (c * 9.0 / 5.0) + 32

    @staticmethod
    def celsius_to_kelvin(c: float) -> float:
        return c + 273.15

    @staticmethod
    def kelvin_to_celsius(k: float) -> float:
        return k - 273.15

    # --- Energy ---
    @staticmethod
    def joules_to_ev(j: float) -> float:
        return j / 1.602e-19

    @staticmethod
    def ev_to_joules(ev: float) -> float:
        return ev * 1.602e-19
