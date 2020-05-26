import GetOldTweets3 as getter 

import argparse
import json

parser = argparse.ArgumentParser(description='COMP90024 / get tweet via coordinate location')
parser.add_argument('--coordinates', type=str, default="-37.814413,144.93163")
parser.add_argument('--startdate', type=str, default="2020-01-01")
parser.add_argument('--enddate', type=str, default="2020-05-01")
parser.add_argument('--within', type=str, default="3.363945833km")
parser.add_argument('--filename', type=str, default="MELBOURNE.json")
args = parser.parse_args()


output = open(args.filename, "w+",encoding = "utf-8")

# couch = couchdb.Server('http://90024_12:90024_12@localhost:5984')
# db = couch['twitter_sample']

# tweet within 50mil of Melbourne central located 
tweetCriteria = getter.manager.TweetCriteria()\
                .setNear(args.coordinates)\
                .setWithin(args.within)\
                .setSince(args.startdate)\
                .setUntil(args.enddate)\

tweetlist = getter.manager.TweetManager.getTweets(tweetCriteria)

tweet_json_list = []




for tweet in tweetlist:
    if not tweet.text.startswith('RT'):
        temp = {}
        temp['_id'] = tweet.date.strftime('%Y-%m-%d')+":"+str(tweet.id)
        temp['permalink'] = tweet.permalink
        temp['username']=tweet.username
        temp["date"] = tweet.date.strftime('%Y-%m-%d %H:%M:%S%z')
        temp['text']= tweet.text
        temp['hashtags'] = tweet.hashtags.split()
        temp['geo'] = [tweet.geo]
        tweet_json_list.append(temp)

tweets = {"docs":tweet_json_list}
json.dump(tweets,output)

output.close()
    
