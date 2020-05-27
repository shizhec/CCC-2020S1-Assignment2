# COMP90024 Cluster and Cloud Computing Team 12
# @Author：Haoyu Zhang
# @Email: haoyu1@student.unimelb.edu.au

from datetime import datetime
import datetime
import time
from cloudant.database import CloudantDatabase


# generate day in string between given days
def get_days(date_begin, date_end):
    date_list = []

    begin_date = datetime.datetime.strptime(date_begin, "%Y-%m-%d") \
        if date_begin else datetime.datetime.strptime('2020-05-01', "%Y-%m-%d")

    end_date = datetime.datetime.strptime(date_end, "%Y-%m-%d") \
        if date_begin else datetime.datetime.today()

    while begin_date <= end_date:
        date_str = begin_date.strftime("%Y-%m-%d")
        date_list.append(date_str)
        begin_date += datetime.timedelta(days=1)
    return date_list


# CouchDB Client and related methods
class DB:
    def __init__(self, client):
        self.client = client
        self.dic = None
        self.dbnames = client.all_dbs()

    def get_region(self, re):
        if re:
            re = re.split('_')
            if re[0] == 'greater' or re[0] == 'mount':
                n = 1
            else:
                n = 0

            for region in self.dbnames:
                reg = region.split('_')
                if len(reg) > n and re[n] == reg[n]:
                    return region
        return None


    def get_sentiment(self, region, date_begin, date_end):
        db = CloudantDatabase(self.client, self.get_region(region), partitioned=True)
        days = get_days(date_begin, date_end)

        counts = {'negative': 0, 'neutral': 0, 'positive': 0}
        for day in days:
            for re in db.get_partitioned_view_result(day, '_design/sentiment_count', 'sentiment_count', group_level=1):
                counts[re['key']] += re['value']
        return counts

    def get_hashtag(self, region, date_begin, date_end):
        db = CloudantDatabase(self.client, self.get_region(region), partitioned=True)
        days = get_days(date_begin, date_end)

        counts = 0
        for day in days:
            for re in db.get_partitioned_view_result(day, '_design/hashtag_count', 'hashtag_count'):
                counts += re['value']
        return {'count': counts}

    def get_corona(self, region, date_begin, date_end):
        db = CloudantDatabase(self.client, self.get_region(region), partitioned=True)
        days = get_days(date_begin, date_end)

        counts = 0
        for day in days:
            for re in db.get_partitioned_view_result(day, '_design/coronavirus_related', 'coronavirus_related'):
                counts += re['value']
        return {'count': counts}

    def get_overview(self, date_begin, date_end):
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

    def get_tweet_count(self, region, date_begin, date_end):
        db = CloudantDatabase(self.client, self.get_region(region), partitioned=True)
        days = get_days(date_begin, date_end)

        counts = 0
        for day in days:
            for re in db.get_partitioned_view_result(day, '_design/tweet_count', 'tweet_count'):
                counts += re['value']
        return {'count': counts}

    def get_hashtag_overview(self, region, date_begin, date_end, top):
        db = CloudantDatabase(self.client, self.get_region(region), partitioned=True)
        days = get_days(date_begin, date_end)

        results = {}
        for day in days:
            tmp_re = db.get_partitioned_view_result(day, '_design/hashtag_count', 'hashtag_count',
                                                    group_level=1, limit=1000)
            for re in tmp_re[:]:
                results[re['key'].lower()] = results.get(re['key'].lower(), 0) + re['value']
        if top:
            return sorted(results.items(), key=lambda item: item[1], reverse=True)[:top]
        else:
            return sorted(results.items(), key=lambda item: item[1], reverse=True)

    def get_overview_lga(self, date_begin, date_end):
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

    def get_sentiment_user(self, db, date_begin, date_end):
        db = CloudantDatabase(self.client, db, partitioned=False)
        days = get_days(date_begin, date_end)

        while not db.exists():
            time.sleep(0.1)

        results = {'negative': 0, 'neutral': 0, 'positive': 0}
        cou = 0
        hash_count = {}
        related = 0
        hash_cou = 0
        for tweet_data in db:
            results[tweet_data['simple_sentiment_label']] += 1
            cou += 1
            flag = 0
            for hash in tweet_data['hashtags']:
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
        db.delete()
        return results

    def get_aurin(self, region, types):
        mapping = {'income': "income_num(aud)",
                   'labor': "labour_force_num",
                   'participation': "Participation_rate%",
                   'unemployment': "Unemployment_rate%",
                   'highedu': "higher_education_rate%",
                   'male': "Male",
                   'female': "Female"}
        db = CloudantDatabase(self.client, 'aurin', partitioned=False)

        if self.dic is None:
            self.dic = {'_'.join(filter(lambda x: x[0] != '(', key.split())).lower().replace('-', '_'): key
                        for key in db['aurin_data'].keys()}

        if region[-1] == ')':
            re = 'unincorporated_vic'
        else:
            re = region.lower().replace(' ', '_').replace('-', '_')

        if re in self.dic:
            if types == 'all':
                return {key: db['aurin_data'][self.dic[re]][value] for key, value in mapping.items()}
            return db['aurin_data'][self.dic[re]].get(mapping.get(types, ""), -1)
        else:
            return -1

    def get_tweet_count_today(self, region, date=datetime.datetime.today()):
        db = CloudantDatabase(self.client, self.get_region(region), partitioned=True)
        counts = 0

        for re in db.get_partitioned_view_result(date, '_design/tweet_count', 'tweet_count'):
            counts += re['value']
        return {'count': counts}
