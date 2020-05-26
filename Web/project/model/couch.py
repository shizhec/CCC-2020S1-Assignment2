from datetime import datetime
from project import app
import datetime
import time
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
        self.dic = None

    def get_sentiment(self, region, date_begin='2020-01-01', date_end=datetime.datetime.today()):
        db = CloudantDatabase(self.client, region, partitioned=True)
        days = get_days(date_begin, date_end)

        counts = {'negative': 0, 'neutral': 0, 'positive': 0}
        for day in days:
            for re in db.get_partitioned_view_result(day, '_design/sentiment_count', 'sentiment_count', group_level=1):
                counts[re['key']] += re['value']
        return counts

    def get_hashtag(self, region, date_begin='2020-01-01', date_end=datetime.datetime.today()):
        db = CloudantDatabase(self.client, region, partitioned=True)
        days = get_days(date_begin, date_end)

        counts = 0
        for day in days:
            for re in db.get_partitioned_view_result(day, '_design/hashtag_count', 'hashtag_count'):
                counts += re['value']
        return {'count': counts}

    def get_corona(self, region, date_begin='2020-01-01', date_end=datetime.datetime.today()):
        db = CloudantDatabase(self.client, region, partitioned=True)
        days = get_days(date_begin, date_end)

        counts = 0
        for day in days:
            for re in db.get_partitioned_view_result(day, '_design/coronavirus_related', 'coronavirus_related'):
                counts += re['value']
        return {'count': counts}

    def get_overview(self, date_begin='2020-01-01', date_end=datetime.datetime.today()):
        db = CloudantDatabase(self.client, 'daily_increase', partitioned=False)
        days = get_days(date_begin, date_end)

        results = {}
        keys = db.keys(remote=True)

        for day in days:
            if day in keys:
                res = db[day]
                results[day] = {key: value for key, value in res.items() if key != '_id' and key != '_rev'}

        return results

    def get_all_overview(self):
        db = CloudantDatabase(self.client, 'daily_increase', partitioned=False)
        results = {}

        for day_data in db:
            results[day_data['_id']] = {key: value for key, value in day_data.items() if key != '_id' and key != '_rev'}

        return results

    def get_tweet_count(self, region, date_begin='2020-01-01', date_end=datetime.datetime.today()):
        db = CloudantDatabase(self.client, region, partitioned=True)
        days = get_days(date_begin, date_end)

        counts = 0
        for day in days:
            for re in db.get_partitioned_view_result(day, '_design/tweet_count', 'tweet_count'):
                counts += re['value']
        return {'count': counts}

    def get_hashtag_overview(self, region, date_begin='2020-01-01', date_end=datetime.datetime.today()):
        db = CloudantDatabase(self.client, region, partitioned=True)
        days = get_days(date_begin, date_end)

        results = {}
        for day in days:
            for re in db.get_partitioned_view_result(day, '_design/hashtag_count', 'hashtag_count', group_level=1):
                results[re['key']] = results.get(re['key'], 0) + re['value']
        return sorted(results.items(), key=lambda item: item[1], reverse=True)

    def get_overview_lga(self, date_begin='2020-01-01', date_end=datetime.datetime.today()):
        db = CloudantDatabase(self.client, 'daily_increase_lga', partitioned=False)
        days = get_days(date_begin, date_end)

        results = {}
        keys = db.keys(remote=True)

        for day in days:
            if day in keys:
                res = db[day]
                results[day] = {key: value for key, value in res.items() if key != '_id' and key != '_rev'}
        return results

    def get_all_overview_lga(self):
        db = CloudantDatabase(self.client, 'daily_increase_lga', partitioned=False)
        results = {}

        for day_data in db:
            results[day_data['_id']] = {key: value for key, value in day_data.items() if key != '_id' and key != '_rev'}

        return results

    def get_sentiment_user(self, db, date_begin='2020-04-01', date_end=datetime.datetime.today()):
        db = CloudantDatabase(self.client, db, partitioned=False)
        days = get_days(date_begin, date_end)

        while not db.exists():
            time.sleep(0.1)

        results = {'negative': 0, 'neutral': 0, 'positive': 0}
        for tweet_data in db:
            results[tweet_data['simple_sentiment_label']] += 1

        db.delete()
        return results

    def get_aurin(self, region, type):
        mapping = {'income': "income_num(aud)",
                   'labor': "labour_force_num",
                   'participation': "Participation_rate%",
                   'unemployment': "Unemployment_rate%",
                   'highedu': "higher_education_rate%",
                   'male': "Male",
                   'female': "Female"}
        db = CloudantDatabase(self.client, 'aurin', partitioned=False)

        if self.dic is None:
            self.dic = {key[:5].lower().replace(' ', '_'): key for key in db['aurin_data'].keys()}

        if region[-1] == ')':
            re = 'uninc'
        else:
            re = region[:5].lower().replace(' ', '_')

        if re in self.dic:
            return db['aurin_data'][self.dic[re]].get(mapping.get(type, ""), -1)
        else:
            return -1

    def get_tweet_count_today(self, region, date=datetime.datetime.today()):
        db = CloudantDatabase(self.client, region, partitioned=True)

        counts = 0

        for re in db.get_partitioned_view_result(date, '_design/tweet_count', 'tweet_count'):
            counts += re['value']
        return {'count': counts}