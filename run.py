from flask import Flask, render_template

app = Flask(__name__)

@app.route('/riri_x7z9q/')
def welcome():
    return render_template('welcome.html')

@app.route('/riri_x7z9q/index.html')
def index():
    return render_template('index.html')

@app.route('/riri_x7z9q/chapter1.html')
def chapter1():
    return render_template('chapter1.html')

@app.route('/riri_x7z9q/chapter2.html')
def chapter2():
    return render_template('chapter2.html')

@app.route('/riri_x7z9q/chapter3.html')
def chapter3():
    return render_template('chapter3.html')

@app.route('/riri_x7z9q/chapter4.html')
def chapter4():
    return render_template('chapter4.html')

@app.route('/riri_x7z9q/chapter5.html')
def chapter5():
    return render_template('chapter5.html')

@app.route('/riri_x7z9q/reset.html')
def reset_view():
    return render_template('reset.html')

if __name__ == '__main__':
    # host='0.0.0.0' allows access from other devices on the same network
    app.run(debug=True, host='0.0.0.0', port=5000)
