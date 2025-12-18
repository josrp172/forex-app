from flask import Blueprint, render_template

christmas_bp = Blueprint('christmas', __name__, 
                         template_folder='templates',
                         static_folder='static',
                         static_url_path='/static')

@christmas_bp.route('/')
def greeting():
    return render_template('greeting.html')
