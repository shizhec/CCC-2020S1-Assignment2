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
    region = request.args.get("region", type=str)
    date_begin = request.args.get("date_start", type=str)
    date_end = request.args.get("date_end", type=str)

    if date_begin is not None:
        date_b = datetime.strptime(date_begin, "%Y-%m-%d")

    if date_end is not None:
        date_e = datetime.strptime(date_end, "%Y-%m-%d")


@app.route('/hashtag')
def hashtag():
    region = request.args.get("region", type=str)
    date_begin = request.args.get("date_start", type=str)
    date_end = request.args.get("date_end", type=str)

    if date_begin is not None:
        date_b = datetime.strptime(date_begin, "%Y-%m-%d")

    if date_end is not None:
        date_e = datetime.strptime(date_end, "%Y-%m-%d")


@app.route('/corona')
def corona_related():
    region = request.args.get("region", type=str)
    date_begin = request.args.get("date_start", type=str)
    date_end = request.args.get("date_end", type=str)

    if date_begin is not None:
        date_b = datetime.strptime(date_begin, "%Y-%m-%d")

    if date_end is not None:
        date_e = datetime.strptime(date_end, "%Y-%m-%d")
