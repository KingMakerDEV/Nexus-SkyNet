from app.main import create_app

# use factory app (VERY IMPORTANT)
app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
