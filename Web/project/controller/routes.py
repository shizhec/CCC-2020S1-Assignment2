from project import app, scheduler
from flask import render_template, request, jsonify
from project.model.couch import DB
from project import client
import os

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

    region = region.strip().lower().replace(' ', '_') \
        .replace('(unincorporated)', '(uninc)')
    return jsonify(db.get_sentiment(region, date_begin, date_end))


@app.route('/api/hashtag')
def hashtag():
    region = request.args.get("region", type=str)
    date_begin = request.args.get("date_start", type=str)
    date_end = request.args.get("date_end", type=str)

    region = region.strip().lower().replace(' ', '_') \
        .replace('(unincorporated)', '(uninc)')
    return jsonify(db.get_hashtag(region, date_begin, date_end))


@app.route('/api/corona')
def corona_related():
    region = request.args.get("region", type=str)
    date_begin = request.args.get("date_start", type=str)
    date_end = request.args.get("date_end", type=str)

    region = region.strip().lower().replace(' ', '_') \
        .replace('(unincorporated)', '(uninc)')
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

    region = region.strip().lower().replace(' ', '_') \
        .replace('(unincorporated)', '(uninc)')
    return jsonify(db.get_tweet_count(region, date_begin, date_end))


@app.route('/api/hashtag_overview')
def hashtag_overview():
    region = request.args.get("region", type=str)
    date_begin = request.args.get("date_start", type=str)
    date_end = request.args.get("date_end", type=str)

    region = region.strip().lower().replace(' ', '_') \
        .replace('(unincorporated)', '(uninc)')
    return jsonify(db.get_hashtag_overview(region, date_begin, date_end))


@app.route('/api/covid_19_vic_lga_overview')
def overview_lga():
    date_begin = request.args.get("date_start", type=str)
    date_end = request.args.get("date_end", type=str)

    if date_begin is None:
        return jsonify(db.get_all_overview_lga())
    else:
        return jsonify(db.get_overview_lga(date_begin, date_end))


@app.route('/api/sentiment_user')
def sentiment_user():
    user = request.args.get("user", type=str)
    date_begin = request.args.get("date_start", type=str)
    date_end = request.args.get("date_end", type=str)

    os.system('python3 ' + ' searching/getFromUsername.py ' +
              ' --address ' + '172.26.130.251' +
              ' --database username_' + user.strip().lower() +
              ' --Tusername ' + user.strip() +
              ' --startdate ' + date_begin +
              ' --enddate ' + date_end +
              ' --filename ' + user.strip() + '.json')

    return jsonify(db.get_sentiment_user('username_' + user.strip().lower(),
                                         date_begin, date_end))


@app.route('/api/aurin')
def aurin():
    region = request.args.get("region", type=str)
    types = request.args.get("type", type=str)

    return jsonify(db.get_aurin(region.strip(), types.lower() if types else 'all'))


@scheduler.task('interval', id='refresh_data', hours=6, misfire_grace_time=900)
def refresh_data():
    os.system('python3 ' + ' steaming/getTweetStream.py ')
    everyday_tweet = db.get_tweet_count_today()

    return everyday_tweet
