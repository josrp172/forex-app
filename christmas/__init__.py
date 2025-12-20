import os
from flask import Blueprint, render_template, current_app

christmas_bp = Blueprint('christmas', __name__, 
                         template_folder='templates',
                         static_folder='static',
                         static_url_path='/static')

def find_message_file(name):
    """Search for <name>.txt in static/Message subfolders."""
    message_dir = os.path.join(christmas_bp.static_folder, 'Message')
    for root, dirs, files in os.walk(message_dir):
        if f"{name}.txt" in files:
            full_path = os.path.join(root, f"{name}.txt")
            return os.path.relpath(full_path, christmas_bp.static_folder).replace('\\', '/')
    return None

def find_pics_folder(name):
    """Check if <name> folder exists in static/pics subfolders."""
    pics_dir = os.path.join(christmas_bp.static_folder, 'pics')
    for root, dirs, files in os.walk(pics_dir):
        if name in dirs:
            full_path = os.path.join(root, name)
            return os.path.relpath(full_path, christmas_bp.static_folder).replace('\\', '/')
    return None

@christmas_bp.route('/')
@christmas_bp.route('/<name>')
def greeting(name='Abhi'):
    message_path = find_message_file(name)
    pics_path = find_pics_folder(name)
    return render_template('greeting.html', 
                           recipient_name=name, 
                           message_file=message_path,
                           pics_path=pics_path)
