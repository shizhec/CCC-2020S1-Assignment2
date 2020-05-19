from project import app
from flask import render_template, request, jsonify
from datetime import datetime
from project.model.couch import DB



@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/sentiment')
def sentiment():
    region = request.form.get("region", type=str)
    date_begin = request.form.get("date_begin", type=str)
    date_end = request.form.get("date_end", type=str)


@app.route('/hashtag')
def hashtag():
    region = request.form.get("region", type=str)
    date_begin = request.form.get("date_begin", type=str)
    date_end = request.form.get("date_end", type=str)


@app.route('/corona')
def corona_related():
    region = request.form.get("region", type=str)
    date_begin = request.form.get("date_begin", type=str)
    date_end = request.form.get("date_end", type=str)
