from project import app, scheduler
from flask import render_template, request, jsonify
from project.model.couch import DB
from flask_apscheduler import APScheduler
from project import client

db = DB(client)


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/api/sentiment')
def sentiment():
    region = request.args.get("region", type=str)
    date_begin = request.args.get("date_start", type=str)
    date_end = request.args.get("date_end", type=str)

    region.strip().lower().replace(' ', '_')
    return jsonify(db.get_sentiment(region, date_begin, date_end))


@app.route('/api/hashtag')
def hashtag():
    region = request.args.get("region", type=str)
    date_begin = request.args.get("date_start", type=str)
    date_end = request.args.get("date_end", type=str)

    region.strip().lower().replace(' ', '_')
    return jsonify(db.get_hashtag(region, date_begin, date_end))


@app.route('/api/corona')
def corona_related():
    region = request.args.get("region", type=str)
    date_begin = request.args.get("date_start", type=str)
    date_end = request.args.get("date_end", type=str)

    region.strip().lower().replace(' ', '_')
    return jsonify(db.get_corona(region, date_begin, date_end))


@app.route('/api/overview')
def overview():
    date_begin = request.args.get("date_start", type=str)
    date_end = request.args.get("date_end", type=str)

    if date_begin is None:
        return jsonify(db.get_all_overview())
    else:
        return jsonify(db.get_overview(date_begin, date_end))


@app.route('/api/tweet_count')
def tweet_count():
    region = request.args.get("region", type=str)
    date_begin = request.args.get("date_start", type=str)
    date_end = request.args.get("date_end", type=str)

    region.strip().lower().replace(' ', '_')
    return jsonify(db.get_tweet_count(region, date_begin, date_end))


@app.route('/api/hashtag_overview')
def hashtag_overview():
    region = request.args.get("region", type=str)
    date_begin = request.args.get("date_start", type=str)
    date_end = request.args.get("date_end", type=str)

    region.strip().lower().replace(' ', '_')
    return jsonify(db.get_hashtag_overview(region, date_begin, date_end))


@app.route('/api/covid_19_vic_lga_overview')
def overview_lga():
    date_begin = request.args.get("date_start", type=str)
    date_end = request.args.get("date_end", type=str)

    if date_begin is None:
        return jsonify(db.get_all_overview_lga())
    else:
        return jsonify(db.get_overview_lga(date_begin, date_end))
#
# @scheduler.task('interval', id='refresh_data', hours=6, misfire_grace_time=900)
# def refresh_data():
#     return 0
