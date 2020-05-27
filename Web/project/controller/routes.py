# COMP90024 Cluster and Cloud Computing Team 12
# @Author：Haoyu Zhang
# @Email: haoyu1@student.unimelb.edu.au

from project import app, scheduler
from flask import render_template, request, jsonify
from project.model.couch import DB
from project import client
import os

# create CouchDB class
db = DB(client)


# render the index.html
@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


# API lists
@app.route('/api/sentiment')
def sentiment():
    region = request.args.get("region", type=str, default='melbourne')
    date_begin = request.args.get("date_start", type=str, default='2020-05-01')
    date_end = request.args.get("date_end", type=str, default='2020-05-10')

    region = region.strip().lower().replace(' ', '_') \
        .replace('(unincorporated)', '(uninc)')
    return jsonify(db.get_sentiment(region, date_begin, date_end))


@app.route('/api/hashtag')
def hashtag():
    region = request.args.get("region", type=str, default='melbourne')
    date_begin = request.args.get("date_start", type=str, default='2020-05-01')
    date_end = request.args.get("date_end", type=str, default='2020-05-10')

    region = region.strip().lower().replace(' ', '_') \
        .replace('(unincorporated)', '(uninc)')
    return jsonify(db.get_hashtag(region, date_begin, date_end))


@app.route('/api/corona')
def corona_related():
    region = request.args.get("region", type=str, default='melbourne')
    date_begin = request.args.get("date_start", type=str, default='2020-05-01')
    date_end = request.args.get("date_end", type=str, default='2020-05-10')

    region = region.strip().lower().replace(' ', '_') \
        .replace('(unincorporated)', '(uninc)')
    return jsonify(db.get_corona(region, date_begin, date_end))


@app.route('/api/overview')
def overview():
    date_begin = request.args.get("date_start", type=str, default='2020-05-01')
    date_end = request.args.get("date_end", type=str, default='2020-05-10')

    if date_begin is None:
        return jsonify(db.get_all_overview())
    else:
        return jsonify(db.get_overview(date_begin, date_end))


@app.route('/api/tweet_count')
def tweet_count():
    region = request.args.get("region", type=str, default='melbourne')
    date_begin = request.args.get("date_start", type=str, default='2020-05-01')
    date_end = request.args.get("date_end", type=str, default='2020-05-10')

    region = region.strip().lower().replace(' ', '_') \
        .replace('(unincorporated)', '(uninc)')
    return jsonify(db.get_tweet_count(region, date_begin, date_end))


@app.route('/api/hashtag_overview')
def hashtag_overview():
    region = request.args.get("region", type=str, default='melbourne')
    date_begin = request.args.get("date_start", type=str, default='2020-05-01')
    date_end = request.args.get("date_end", type=str, default='2020-05-10')
    top = request.args.get("top", type=int)

    region = region.strip().lower().replace(' ', '_') \
        .replace('(unincorporated)', '(uninc)')
    return jsonify(db.get_hashtag_overview(region, date_begin, date_end, top))


@app.route('/api/covid_19_vic_lga_overview')
def overview_lga():
    date_begin = request.args.get("date_start", type=str)
    date_end = request.args.get("date_end", type=str, default='2020-05-10')

    if date_begin is None:
        return jsonify(db.get_all_overview_lga())
    else:
        return jsonify(db.get_overview_lga(date_begin, date_end))


@app.route('/api/sentiment_user')
def sentiment_user():
    user = request.args.get("user", type=str, default='healthgovau')
    date_begin = request.args.get("date_start", type=str, default='2020-05-01')
    date_end = request.args.get("date_end", type=str, default='2020-05-10')

    os.system('python3 ' + ' searching/getFromUsername.py ' +
              ' --address ' + '172.26.130.251' +
              ' --database username_' + user.strip().lower() +
              ' --Tusername ' + user.strip() +
              ' --startdate ' + date_begin +
              ' --enddate ' + date_end +
              ' --filename ' + user.strip() + '.json')

    os.system('rm ' + user.strip() + '.json')

    return jsonify(db.get_sentiment_user('username_' + user.strip().lower(),
                                         date_begin, date_end))


@app.route('/api/aurin')
def aurin():
    region = request.args.get("region", type=str, default='melbourne')
    types = request.args.get("type", type=str, default=all)

    return jsonify(db.get_aurin(region.strip(), types.lower()))


# scheduled tasks
@scheduler.task('interval', id='refresh_data', hours=6, misfire_grace_time=900)
def refresh_data():
    os.system('python3 ' + ' steaming/getTweetStream.py ')
    everyday_tweet = db.get_tweet_count_today()

    return everyday_tweet
