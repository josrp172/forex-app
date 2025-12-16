from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def welcome():
    return render_template('welcome.html')

@app.route('/index.html')
def index():
    return render_template('index.html')

@app.route('/chapter1.html')
def chapter1():
    return render_template('chapter1.html')

@app.route('/chapter2.html')
def chapter2():
    return render_template('chapter2.html')

@app.route('/chapter3.html')
def chapter3():
    return render_template('chapter3.html')

@app.route('/chapter4.html')
def chapter4():
    return render_template('chapter4.html')

@app.route('/chapter5.html')
def chapter5():
    return render_template('chapter5.html')

if __name__ == '__main__':
    # host='0.0.0.0' allows access from other devices on the same network
    app.run(debug=True, host='0.0.0.0', port=5000)
