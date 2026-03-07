from flask import Blueprint, request, jsonify
from Services.nasa_service import NASAService

nasa_bp = Blueprint("nasa", __name__)
nasa_service = NASAService()


@nasa_bp.route("/apod", methods=["GET"])
def get_apod():
    """
    Get Astronomy Picture of the Day.
    Query params: date (YYYY-MM-DD), count (int)
    """
    try:
        date = request.args.get("date")
        count = request.args.get("count")
        result = nasa_service.get_apod(date=date, count=count)
        return jsonify({"status": "success", "data": result}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@nasa_bp.route("/asteroids", methods=["GET"])
def get_asteroids():
    """
    Get near-Earth asteroids.
    Query params: start_date, end_date (YYYY-MM-DD)
    """
    try:
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")
        result = nasa_service.get_asteroids(start_date=start_date, end_date=end_date)
        return jsonify({"status": "success", "data": result}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@nasa_bp.route("/mars-photos", methods=["GET"])
def get_mars_photos():
    """
    Get Mars Rover photos.
    Query params: rover, sol, earth_date, camera, page
    """
    try:
        rover = request.args.get("rover", "curiosity")
        sol = request.args.get("sol", type=int)
        earth_date = request.args.get("earth_date")
        camera = request.args.get("camera")
        page = request.args.get("page", 1, type=int)

        result = nasa_service.get_mars_photos(
            rover=rover, sol=sol, earth_date=earth_date,
            camera=camera, page=page
        )
        return jsonify({"status": "success", "data": result}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@nasa_bp.route("/search", methods=["GET"])
def search_images():
    """
    Search NASA Image & Video Library.
    Query params: q (required), media_type, page
    """
    try:
        query = request.args.get("q")
        if not query:
            return jsonify({"status": "error", "message": "Query parameter 'q' required"}), 400

        media_type = request.args.get("media_type", "image")
        page = request.args.get("page", 1, type=int)

        result = nasa_service.search_images(query=query, media_type=media_type, page=page)
        return jsonify({"status": "success", "data": result}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@nasa_bp.route("/space-weather", methods=["GET"])
def get_space_weather():
    """
    Get DONKI space weather events.
    Query params: event_type, start_date, end_date
    """
    try:
        event_type = request.args.get("event_type", "all")
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")

        result = nasa_service.get_space_weather(
            event_type=event_type,
            start_date=start_date,
            end_date=end_date
        )
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
