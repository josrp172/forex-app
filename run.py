from flask import Flask
from riri import riri_bp
from christmas import christmas_bp

app = Flask(__name__)

# Register Blueprints
app.register_blueprint(riri_bp, url_prefix='/riri_x7z9q')
app.register_blueprint(christmas_bp, url_prefix='/christmas')

@app.route('/')
def home():
    return "<h1>Dedicated For You App</h1><p>Visit <a href='/riri_x7z9q/'>Riri App</a> or <a href='/christmas/'>Christmas App</a></p>"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
