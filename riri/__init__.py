from flask import Blueprint, render_template

riri_bp = Blueprint('riri', __name__, 
                    template_folder='templates',
                    static_folder='static',
                    static_url_path='/static')

@riri_bp.route('/')
def welcome():
    return render_template('welcome.html')

@riri_bp.route('/index.html')
def index():
    return render_template('index.html')

@riri_bp.route('/chapter1.html')
def chapter1():
    return render_template('chapter1.html')

@riri_bp.route('/chapter2.html')
def chapter2():
    return render_template('chapter2.html')

@riri_bp.route('/chapter3.html')
def chapter3():
    return render_template('chapter3.html')

@riri_bp.route('/chapter4.html')
def chapter4():
    return render_template('chapter4.html')

@riri_bp.route('/chapter5.html')
def chapter5():
    return render_template('chapter5.html')

@riri_bp.route('/reset.html')
def reset_view():
    return render_template('reset.html')
