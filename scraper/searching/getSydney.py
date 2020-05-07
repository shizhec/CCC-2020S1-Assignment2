import GetOldTweets3 as got 
#import couchdb
# import mpi4py
# from mpi4py import MPI

import argparse
import json

parser = argparse.ArgumentParser(description='COMP90024 / get tweet via coordinate location')
parser.add_argument('--coordinates', type=str, default="-33.865143,151.209900")
parser.add_argument('--startdate', type=str, default="2020-04-01")
parser.add_argument('--enddate', type=str, default="2020-05-01")
parser.add_argument('--within', type=str, default="50mi")
parser.add_argument('--filename', type=str, default="Sydney_April.txt")
args = parser.parse_args()

START_MSG = "1"
ENG_MSG = "0"

output = open(args.filename, "w",encoding = "utf-8")

# comm = MPI.COMM_WORLD
# comm_size = comm.Get_size()
# comm_rank = comm.Get_rank()


# couch = couchdb.Server('http://90024_12:90024_12@localhost:5984')
# db = couch['twitter_sample']

# tweet within 50mil of Melbourne central located 
tweetCriteria = got.manager.TweetCriteria()\
                .setNear(args.coordinates)\
                .setWithin(args.within)\
                .setSince(args.startdate)\
                .setUntil(args.enddate)\

got.manager.TweetManager.getTweets(tweetCriteria,file = output)

# print(len(tweetlist))

# for tweet in tweetlist:
#     temp = {}
#     temp['id'] = tweet.id
#     temp['permalink'] = tweet.permalink
#     temp['username']=tweet.username
#     temp["date"] = tweet.date.strftime('%Y-%m-%d %H:%M:%S%z')
#     temp['text']= tweet.text
#     temp['hashtags'] = tweet.hashtags.split()
#     temp['geo'] = [tweet.geo]
#     db.save(temp)

