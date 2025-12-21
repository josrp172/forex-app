from flask import Flask
from riri import riri_bp
from christmas import christmas_bp

app = Flask(__name__)

# Register Blueprints
app.register_blueprint(riri_bp, url_prefix='/riri_x7z9q')
app.register_blueprint(christmas_bp, url_prefix='/christmas')

@app.route('/')
def home():
    return """
    <div style="height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: #0f172a; color: white; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; padding: 20px;">
        <h1 style="font-size: 2.5rem; margin-bottom: 1rem; background: linear-gradient(to right, #fbbf24, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">🎄 A Christmas Dedication 🎁</h1>
        <p style="font-size: 1.2rem; color: #94a3b8; max-width: 600px; line-height: 1.6;">
            A space built to celebrate the season, cherish the memories, 
            and share the magic of Christmas through personalized greetings and stories.
        </p>
    </div>
    """

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
