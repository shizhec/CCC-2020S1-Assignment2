from datetime import datetime
from project import app
import datetime

from cloudant.database import CloudantDatabase


def get_days(date_begin, date_end):
    date_list = []
    if date_begin is not None:
        begin_date = datetime.datetime.strptime(date_begin, "%Y-%m-%d")
    else:
        begin_date = datetime.datetime.strptime('2020-01-01', "%Y-%m-%d")

    if date_end is not None:
        end_date = datetime.datetime.strptime(date_end, "%Y-%m-%d")
    else:
        end_date = datetime.datetime.today()

    while begin_date <= end_date:
        date_str = begin_date.strftime("%Y-%m-%d")
        date_list.append(date_str)
        begin_date += datetime.timedelta(days=1)
    return date_list


class DB:
    def __init__(self, client):
        self.client = client

    def get_sentiment(self, region, date_begin='2020-01-01', date_end=datetime.datetime.today()):
        db = CloudantDatabase(self.client, 'melbourne_test_part', partitioned=True)
        days = get_days(date_begin, date_end)

        counts = {'negative': 0, 'neutral': 0, 'positive': 0}
        for day in days:
            for re in db.get_partitioned_view_result(day, '_design/sentiment_count', 'new-view', group_level=1):
                counts[re['key']] += re['value']
        return counts

    def get_hashtag(self, region, date_begin='2020-01-01', date_end=datetime.datetime.today()):
        db = CloudantDatabase(self.client, 'melbourne_test_part', partitioned=True)
        days = get_days(date_begin, date_end)

        counts = 0
        for day in days:
            for re in db.get_partitioned_view_result(day, '_design/hashtag_count', 'new-view'):
                counts += re['value']
        return {'count': counts}

    def get_corona(self, region, date_begin='2020-01-01', date_end=datetime.datetime.today()):
        db = CloudantDatabase(self.client, 'melbourne_test_part', partitioned=True)
        days = get_days(date_begin, date_end)

        counts = 0
        for day in days:
            for re in db.get_partitioned_view_result(day, '_design/coronavirus_related', 'new-view'):
                counts += re['value']
        return {'count': counts}
