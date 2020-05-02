from collections import Counter
from datetime import datetime
import calendar

from flask import jsonify

from bs4 import BeautifulSoup


from project import app, db


def __cols(pairs=[]):
    return map(lambda x: {'id': '', 'label': x[0], 'type': x[1]}, pairs)


@app.route('/device_data')
def device_data():
    rows = []
    for row in list(db.view('mapviews/devices', group=True)):
        if row.value >= 100:
            rows.append({'c': [{'v': BeautifulSoup(row.key).a.text}, {'v': row.value}]})

    response = {
        'cols': __cols([('Device', 'string'), ('Tweets', 'number')]),
        'rows': rows
    }

    return jsonify(response)


@app.route('/bar_data')
def follower_data():
    rows = []
    for r in list(db.list('mapviews/sortMax', 'mapviews/followers', group=True))[1]['rows']:
        rows.append({'c': [{'v': r['key']}, {'v': r['value']['max']}]})

    response = {
        'cols': __cols([('Name', 'string'), ('Followers', 'number')]),
        'rows': rows
    }

    return jsonify(response)


@app.route('/topic_data')
def topic_data():
    rows = []
    for r in list(db.list('mapviews/sort', 'mapviews/topics', group=True))[1]['rows']:
        rows.append({'c': [{'v': r['key']}, {'v': r['value']}]})

    response = {
        'cols': __cols([('Topic', 'string'), ('Tweets', 'number')]),
        'rows': rows
    }

    return jsonify(response)


@app.route('/sentiment_data')
def sentiment_data():
    counter = Counter()
    for row in list(db.view('mapviews/c2e2')):
        if row.value:
            counter[row.value['sentiScore']] += 1

    counter.pop(0)  # exclude neu(0)

    data = {
        'cols': __cols([('Score', 'number'), ('Count', 'number')]),
        'rows': [{'c': [{'v': key}, {'v': val}]} for (key, val) in counter.iteritems()]
    }
    return jsonify(data)


@app.route('/google_map_data')
def google_map_data():
    geo_list = []
    for row in list(db.view('mapviews/latestTweets', descending=True, limit=200)):
        geo_list.append([row.value['geo'][1], row.value['geo'][0], row.value['text']])

    data = {
        'geo': geo_list
    }
    return jsonify(data)


@app.route('/time_line_data')
def time_line_data():
    pos_counter, neg_counter, neu_counter = Counter(), Counter(), Counter()
    for row in list(db.view('chicago/chicagoBulls')):
        sentiment = row.value['senti']
        time_stamp = calendar.timegm(
            (datetime.fromtimestamp(row.key)).replace(hour=0, minute=0, second=0, microsecond=0).timetuple()) * 1000
        if sentiment == 'pos':
            pos_counter[time_stamp] += 1
        elif sentiment == 'neg':
            neg_counter[time_stamp] += 1
        else:
            neu_counter[time_stamp] += 1

    return jsonify({
        "positive": pos_counter.items(),
        "negative": neg_counter.items(),
        "neutral": neu_counter.items()
    })