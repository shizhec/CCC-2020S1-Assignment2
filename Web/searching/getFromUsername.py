import GetOldTweets3 as got
import json
import couchdb
from label import label_sentiment
import argparse

parser = argparse.ArgumentParser(
    description='COMP90024 / get tweet via coordinate location,upload the tweets to the couchdb')
parser.add_argument('--address', type=str, default="127.0.0.1")
parser.add_argument('--username', type=str, default="admin")
parser.add_argument('--password', type=str, default="password")
parser.add_argument('--database', type=str, default="username_realdonaldtrump")
parser.add_argument('--Tusername', type=str, default="realDonaldTrump")
parser.add_argument('--startdate', type=str, default="2020-04-15")
parser.add_argument('--enddate', type=str, default="2020-04-29")
parser.add_argument('--filename', type=str, default="realDonaldTrump.json")
args = parser.parse_args()

output = open(args.filename, "w+", encoding="utf-8")

PATH = "http://" + args.username + ":" + args.password + "@" + args.address + ":5984"

couch = couchdb.Server(PATH)
try:
    couch[args.database]
    del couch[args.database]
except:
    pass

# print("done")
db = couch.create(args.database)

tweetCriteria = got.manager.TweetCriteria() \
    .setUsername(args.Tusername) \
    .setSince(args.startdate) \
    .setUntil(args.enddate)

tweetlist = got.manager.TweetManager.getTweets(tweetCriteria)

tweet_json_list = []

for tweet in tweetlist:
    temp = {}
    temp['_id'] = tweet.id
    temp['permalink'] = tweet.permalink
    temp['username'] = tweet.username
    temp["date"] = tweet.date.strftime('%Y-%m-%d %H:%M:%S%z')
    temp['text'] = tweet.text
    temp['hashtags'] = tweet.hashtags.split()
    temp['geo'] = [tweet.geo]
    temp_labeled = label_sentiment(temp)
    tweet_json_list.append(temp_labeled)
    db.save(temp_labeled)

tweets = {"docs": tweet_json_list}
json.dump(tweets, output)

output.close()
