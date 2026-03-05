import os
import requests
from datetime import datetime, timedelta


class NASAService:
    """
    Service layer for all NASA public API integrations.
    Uses the NASA API key from environment variables.

    Supported APIs:
    - APOD (Astronomy Picture of the Day)
    - NeoWs (Near Earth Object Web Service)
    - Mars Rover Photos
    - NASA Image & Video Library
    - DONKI (Space Weather)
    """

    def __init__(self):
        self.api_key = os.getenv("NASA_API_KEY", "DEMO_KEY")
        self.image_library_base = os.getenv("NASA_API_BASE_URL", "https://images-api.nasa.gov")

    # ===========================================================
    # APOD — Astronomy Picture of the Day
    # ===========================================================
    def get_apod(self, date=None, count=None):
        """
        Get the Astronomy Picture of the Day.
        Args:
            date: YYYY-MM-DD format (optional, defaults to today)
            count: Number of random APODs to return (optional)
        """
        url = "https://api.nasa.gov/planetary/apod"
        params = {"api_key": self.api_key}

        if count:
            params["count"] = min(int(count), 10)
        elif date:
            params["date"] = date

        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()

        # Normalize response to always be a list
        if isinstance(data, dict):
            data = [data]

        results = []
        for item in data:
            results.append({
                "title": item.get("title", ""),
                "explanation": item.get("explanation", ""),
                "url": item.get("url", ""),
                "hdurl": item.get("hdurl", ""),
                "media_type": item.get("media_type", "image"),
                "date": item.get("date", ""),
                "copyright": item.get("copyright", "NASA"),
            })

        return results

    # ===========================================================
    # NeoWs — Near Earth Object Web Service (Asteroids)
    # ===========================================================
    def get_asteroids(self, start_date=None, end_date=None):
        """
        Get near-Earth asteroids for a date range.
        Max 7-day range. Defaults to today → today+7.
        """
        url = "https://api.nasa.gov/neo/rest/v1/feed"

        if not start_date:
            start_date = datetime.utcnow().strftime("%Y-%m-%d")
        if not end_date:
            end_dt = datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=7)
            end_date = end_dt.strftime("%Y-%m-%d")

        params = {
            "start_date": start_date,
            "end_date": end_date,
            "api_key": self.api_key,
        }

        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()

        asteroids = []
        for date_key, neo_list in data.get("near_earth_objects", {}).items():
            for neo in neo_list:
                close_approach = neo.get("close_approach_data", [{}])[0] if neo.get("close_approach_data") else {}
                asteroids.append({
                    "id": neo.get("id"),
                    "name": neo.get("name", "Unknown"),
                    "nasa_jpl_url": neo.get("nasa_jpl_url", ""),
                    "is_potentially_hazardous": neo.get("is_potentially_hazardous_asteroid", False),
                    "estimated_diameter_km": {
                        "min": neo.get("estimated_diameter", {}).get("kilometers", {}).get("estimated_diameter_min", 0),
                        "max": neo.get("estimated_diameter", {}).get("kilometers", {}).get("estimated_diameter_max", 0),
                    },
                    "close_approach_date": close_approach.get("close_approach_date", ""),
                    "relative_velocity_kmh": close_approach.get("relative_velocity", {}).get("kilometers_per_hour", "0"),
                    "miss_distance_km": close_approach.get("miss_distance", {}).get("kilometers", "0"),
                    "orbiting_body": close_approach.get("orbiting_body", "Earth"),
                })

        # Sort by close approach date
        asteroids.sort(key=lambda x: x.get("close_approach_date", ""))

        return {
            "element_count": data.get("element_count", len(asteroids)),
            "start_date": start_date,
            "end_date": end_date,
            "asteroids": asteroids,
        }

    # ===========================================================
    # Mars Rover Photos
    # ===========================================================
    def get_mars_photos(self, rover="curiosity", sol=None, earth_date=None, camera=None, page=1):
        """
        Get Mars Rover photos.
        Args:
            rover: curiosity, opportunity, or spirit
            sol: Martian sol (day)
            earth_date: Earth date (YYYY-MM-DD)
            camera: Camera abbreviation (FHAZ, RHAZ, MAST, CHEMCAM, MAHLI, MARDI, NAVCAM)
            page: Page number
        """
        url = f"https://api.nasa.gov/mars-photos/api/v1/rovers/{rover}/photos"
        params = {"api_key": self.api_key, "page": page}

        if sol is not None:
            params["sol"] = sol
        elif earth_date:
            params["earth_date"] = earth_date
        else:
            params["sol"] = 1000  # Default sol

        if camera:
            params["camera"] = camera

        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()

        photos = []
        for photo in data.get("photos", [])[:50]:  # Limit to 50
            photos.append({
                "id": photo.get("id"),
                "sol": photo.get("sol"),
                "earth_date": photo.get("earth_date", ""),
                "img_src": photo.get("img_src", ""),
                "camera": {
                    "name": photo.get("camera", {}).get("name", ""),
                    "full_name": photo.get("camera", {}).get("full_name", ""),
                },
                "rover": {
                    "name": photo.get("rover", {}).get("name", ""),
                    "status": photo.get("rover", {}).get("status", ""),
                    "landing_date": photo.get("rover", {}).get("landing_date", ""),
                    "launch_date": photo.get("rover", {}).get("launch_date", ""),
                },
            })

        return {
            "rover": rover,
            "photo_count": len(photos),
            "photos": photos,
        }

    # ===========================================================
    # NASA Image & Video Library
    # ===========================================================
    def search_images(self, query, media_type="image", page=1):
        """
        Search the NASA Image and Video Library.
        """
        url = f"{self.image_library_base}/search"
        params = {
            "q": query,
            "media_type": media_type,
            "page": page,
        }

        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()

        items = data.get("collection", {}).get("items", [])
        results = []
        for item in items[:30]:  # Limit to 30
            item_data = item.get("data", [{}])[0]
            links = item.get("links", [{}])
            thumbnail = links[0].get("href", "") if links else ""

            results.append({
                "nasa_id": item_data.get("nasa_id", ""),
                "title": item_data.get("title", ""),
                "description": (item_data.get("description", "") or "")[:500],
                "date_created": item_data.get("date_created", ""),
                "media_type": item_data.get("media_type", ""),
                "center": item_data.get("center", ""),
                "keywords": item_data.get("keywords", [])[:5],
                "thumbnail": thumbnail,
            })

        total_hits = data.get("collection", {}).get("metadata", {}).get("total_hits", len(results))

        return {
            "query": query,
            "total_results": total_hits,
            "page": page,
            "results": results,
        }

    # ===========================================================
    # DONKI — Space Weather
    # ===========================================================
    def get_space_weather(self, event_type="all", start_date=None, end_date=None):
        """
        Get space weather data from DONKI.
        event_type: CME, GST, FLR, SEP, MPC, RBE, HSS, or all
        """
        if not start_date:
            start_dt = datetime.utcnow() - timedelta(days=30)
            start_date = start_dt.strftime("%Y-%m-%d")
        if not end_date:
            end_date = datetime.utcnow().strftime("%Y-%m-%d")

        endpoints = {
            "CME": "https://api.nasa.gov/DONKI/CME",
            "GST": "https://api.nasa.gov/DONKI/GST",
            "FLR": "https://api.nasa.gov/DONKI/FLR",
            "SEP": "https://api.nasa.gov/DONKI/SEP",
            "HSS": "https://api.nasa.gov/DONKI/HSS",
        }

        results = {}
        if event_type == "all":
            # Fetch CME and FLR for a balanced overview
            for etype in ["CME", "FLR"]:
                url = endpoints.get(etype)
                if url:
                    params = {
                        "startDate": start_date,
                        "endDate": end_date,
                        "api_key": self.api_key,
                    }
                    try:
                        resp = requests.get(url, params=params, timeout=30)
                        resp.raise_for_status()
                        data = resp.json()
                        if isinstance(data, list):
                            results[etype] = data[:20]
                        else:
                            results[etype] = []
                    except Exception:
                        results[etype] = []
        else:
            url = endpoints.get(event_type.upper())
            if not url:
                return {"status": "error", "reason": f"Unknown event type: {event_type}"}

            params = {
                "startDate": start_date,
                "endDate": end_date,
                "api_key": self.api_key,
            }
            resp = requests.get(url, params=params, timeout=30)
            resp.raise_for_status()
            data = resp.json()
            results[event_type.upper()] = data[:20] if isinstance(data, list) else []

        return {
            "status": "success",
            "start_date": start_date,
            "end_date": end_date,
            "events": results,
        }
