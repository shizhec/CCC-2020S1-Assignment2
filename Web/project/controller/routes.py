from project import app
from flask import render_template


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/team')
def team():
    return render_template('team.html')


@app.route('/works')
def works():
    return render_template('works.html')


@app.route('/works01')
def works01():
    return render_template('works01.html')


@app.route('/works02')
def works02():
    return render_template('works02.html')


@app.route('/works03')
def works03():
    return render_template('works03.html')


@app.route('/contact')
def contact():
    return render_template('contact.html')
