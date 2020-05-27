# COMP90024 Cluster and Cloud Computing Team 12
# @Author：Haoyu Zhang
# @Email: haoyu1@student.unimelb.edu.au

from project import app, scheduler
from flask import render_template, request, jsonify
from project.model.couch import DB
from project import client
import os
from searching.getFromUsername import user_ana

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
    date_begin = request.args.get("date_start", type=str, default='2020-01-01')
    date_end = request.args.get("date_end", type=str, default='2020-05-26')

    region = region.strip().lower().replace(' ', '_') \
        .replace('(unincorporated)', '(uninc)')
    return jsonify(db.get_sentiment(region, date_begin, date_end))


@app.route('/api/hashtag')
def hashtag():
    region = request.args.get("region", type=str, default='melbourne')
    date_begin = request.args.get("date_start", type=str, default='2020-01-01')
    date_end = request.args.get("date_end", type=str, default='2020-05-26')

    region = region.strip().lower().replace(' ', '_') \
        .replace('(unincorporated)', '(uninc)')
    return jsonify(db.get_hashtag(region, date_begin, date_end))


@app.route('/api/corona')
def corona_related():
    region = request.args.get("region", type=str, default='melbourne')
    date_begin = request.args.get("date_start", type=str, default='2020-01-01')
    date_end = request.args.get("date_end", type=str, default='2020-05-26')

    region = region.strip().lower().replace(' ', '_') \
        .replace('(unincorporated)', '(uninc)')
    return jsonify(db.get_corona(region, date_begin, date_end))


@app.route('/api/overview')
def overview():
    date_begin = request.args.get("date_start", type=str, default='2020-01-01')
    date_end = request.args.get("date_end", type=str, default='2020-05-26')

    if date_begin is None:
        return jsonify(db.get_all_overview())
    else:
        return jsonify(db.get_overview(date_begin, date_end))


@app.route('/api/tweet_count')
def tweet_count():
    region = request.args.get("region", type=str, default='melbourne')
    date_begin = request.args.get("date_start", type=str, default='2020-01-01')
    date_end = request.args.get("date_end", type=str, default='2020-05-26')

    region = region.strip().lower().replace(' ', '_') \
        .replace('(unincorporated)', '(uninc)')
    return jsonify(db.get_tweet_count(region, date_begin, date_end))


@app.route('/api/hashtag_overview')
def hashtag_overview():
    region = request.args.get("region", type=str, default='melbourne')
    date_begin = request.args.get("date_start", type=str, default='2020-01-01')
    date_end = request.args.get("date_end", type=str, default='2020-05-26')
    top = request.args.get("top", type=int)

    region = region.strip().lower().replace(' ', '_') \
        .replace('(unincorporated)', '(uninc)')
    return jsonify(db.get_hashtag_overview(region, date_begin, date_end, top))


@app.route('/api/covid_19_vic_lga_overview')
def overview_lga():
    date_begin = request.args.get("date_start", type=str)
    date_end = request.args.get("date_end", type=str, default='2020-05-26')

    if date_begin is None:
        return jsonify(db.get_all_overview_lga())
    else:
        return jsonify(db.get_overview_lga(date_begin, date_end))


@app.route('/api/sentiment_user')
def sentiment_user():
    user = request.args.get("user", type=str, default='healthgovau')
    date_begin = request.args.get("date_start", type=str, default='2020-05-01')
    date_end = request.args.get("date_end", type=str, default='2020-05-26')

    results = {'negative': 0, 'neutral': 0, 'positive': 0}
    cou = 0
    hash_count = {}
    related = 0
    hash_cou = 0

    for res in user_ana(user, date_begin, date_end):
        results[res['simple_sentiment_label']] += 1
        cou += 1
        flag = 0
        for hash in res['hashtags']:
            hash_cou += 1
            hash = hash.lower()
            if 'covid' in hash or 'corona' in hash or ('19' in hash and 'co' in hash) \
                    or 'home' in hash or 'lock' in hash or 'safe' in hash:
                flag = 1

            hash_count[hash] = hash_count.get(hash, 0) + 1

        related += flag

    results['count'] = cou
    results['hashtags'] = sorted(hash_count.items(), key=lambda item: item[1], reverse=True)
    results['coronavirus_related'] = related
    results['hashtag_count'] = hash_cou

    return jsonify(results)


@app.route('/api/aurin')
def aurin():
    region = request.args.get("region", type=str, default='melbourne')
    types = request.args.get("type", type=str, default='all')

    return jsonify(db.get_aurin(region.strip(), types.lower()))


# scheduled tasks
@scheduler.task('interval', id='refresh_data', hours=6, misfire_grace_time=900)
def refresh_data():
    os.system('python3 ' + ' steaming/getTweetStream.py ')
    everyday_tweet = db.get_tweet_count_today()

    return everyday_tweet
