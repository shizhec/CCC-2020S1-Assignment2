import GetOldTweets3 as got 
import couchdb

import argparse

parser = argparse.ArgumentParser(description='COMP90024 / get tweet via coordinate location')
parser.add_argument('--username', type=str, default="realDonaldTrump")
parser.add_argument('--startdate', type=str, default="2020-01-01")
parser.add_argument('--enddate', type=str, default="2020-04-29")
parser.add_argument('--within', type=str, default="50mi")
parser.add_argument('--max', type=int, default=500)
args = parser.parse_args()

tweetCriteria = got.manager.TweetCriteria()\
                .setUsername(args.username)\
                .setSince(args.startdate)\
                .setUntil(args.enddate)\
                .setMaxTweets(args.max)

tweetlist = got.manager.TweetManager.getTweets(tweetCriteria)

print(len(tweetlist))

couch = couchdb.Server('http://90024_12:90024_12@localhost:5984')
db = couch.create('trump_sample')

# for tweet in tweetlist:
#     temp = {}
#     temp['id'] = tweet.id
#     temp['permalink'] = tweet.permalink
#     temp['username']=tweet.username
#     temp['text']= tweet.text
#     temp['hashtags'] = tweet.hashtags
#     temp['geo'] = tweet.geo
#     db.save(temp)