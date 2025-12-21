import os
from flask import Blueprint, render_template, current_app, request, jsonify

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

def load_user_passwords():
    """Load users and passwords from path.txt"""
    path_file = os.path.join(christmas_bp.static_folder, 'path.txt')
    users = {}
    if os.path.exists(path_file):
        with open(path_file, 'r') as f:
            for line in f:
                if '|' in line and not line.startswith('#'):
                    parts = line.strip().split('|')
                    if len(parts) >= 2:
                        name = parts[0].strip()
                        pwd = parts[1].strip()
                        users[pwd] = name
    return users

@christmas_bp.route('/api/unlock', methods=['POST'])
def unlock():
    data = request.json
    password = data.get('password')
    users = load_user_passwords()
    
    # Localhost Testing Shortcuts
    is_local = request.host.startswith('localhost') or request.host.startswith('127.0.0.1')
    if is_local:
        if password == "tree,tree,tree,tree,tree,tree,tree,tree,tree,tree":
            name = "Bless"
        elif password == "star,star,star,star,star,star,star,star,star,star":
            name = "Abhi"
        elif password == "gift,gift,gift,gift,gift,gift,gift,gift,gift,gift":
            name = "Riri"
        else:
            name = users.get(password)
    else:
        name = users.get(password)

    if name:
        return jsonify({
            'success': True,
            'name': name,
            'message_file': find_message_file(name),
            'pics_path': find_pics_folder(name)
        })
    return jsonify({'success': False})

@christmas_bp.route('/')
@christmas_bp.route('/<name>')
def greeting(name=None):
    message_path = None
    pics_path = None
    is_locked = True
    
    if name:
        # Legacy/Direct access support
        message_path = find_message_file(name)
        pics_path = find_pics_folder(name)
        is_locked = False
    else:
        name = "Guest"

    return render_template('greeting.html', 
                           recipient_name=name, 
                           message_file=message_path,
                           pics_path=pics_path,
                           is_locked=is_locked)
