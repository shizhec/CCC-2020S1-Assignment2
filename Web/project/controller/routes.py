from project import app
from flask import render_template, request, jsonify
from project.model.couch import DB

from project import client

db = DB(client)


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/sentiment')
def sentiment():
    region = request.args.get("region", type=str)
    date_begin = request.args.get("date_start", type=str)
    date_end = request.args.get("date_end", type=str)

    if region is None:
        print("fucK!!")
    else:
        return jsonify(db.get_sentiment(region, date_begin, date_end))


@app.route('/hashtag')
def hashtag():
    region = request.args.get("region", type=str)
    date_begin = request.args.get("date_start", type=str)
    date_end = request.args.get("date_end", type=str)

    return jsonify(db.get_hashtag(region, date_begin, date_end))


@app.route('/corona')
def corona_related():
    region = request.args.get("region", type=str)
    date_begin = request.args.get("date_start", type=str)
    date_end = request.args.get("date_end", type=str)

    return jsonify(db.get_corona(region, date_begin, date_end))


@app.route('/overview')
def overview():
    date_begin = request.args.get("date_start", type=str)
    date_end = request.args.get("date_end", type=str)

    if date_begin is None:
        return jsonify(db.get_all_overview())
    else:
        return jsonify(db.get_overview(date_begin, date_end))
