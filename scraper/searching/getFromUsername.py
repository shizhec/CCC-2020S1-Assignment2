import GetOldTweets3 as got 
import couchdb

import argparse

parser = argparse.ArgumentParser(description='COMP90024 / get tweet via coordinate location')
parser.add_argument('--username', type=str, default="realDonaldTrump")
parser.add_argument('--startdate', type=str, default="2020-01-01")
parser.add_argument('--enddate', type=str, default="2020-04-29")
parser.add_argument('--within', type=str, default="50mi")
parser.add_argument('--filename', type=str, default="Trump.txt")
args = parser.parse_args()

output = open(args.filename, "w",encoding = "utf-8")

tweetCriteria = got.manager.TweetCriteria()\
                .setUsername(args.username)\
                .setSince(args.startdate)\
                .setUntil(args.enddate)\
              

got.manager.TweetManager.getTweets(tweetCriteria,file = output)


