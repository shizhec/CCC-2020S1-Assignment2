import tweepy
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
import json
import couchdb
import argparse
from label import label_sentiment
from datetime import datetime
import time

# My keys and tokens
consumer_key = 'FL6PxqocvM3OnHFrz8SJEKret'
consumer_secret = 'y72wusAqRXEZYGZZnNUHHzOXowIhD5aSR7u1njFkOdZN0eF7uT'
access_token = '1252506800076673024-ylDpbH85q88I6NDk98QgK7j2dwRyWa'
access_token_secret = 'CSTF47fgsIV8FSw8ql7gOxeC7w3H9fkWxjNHCQp6JhRco'

access = {"consumer_key": consumer_key,
            "consumer_secret": consumer_secret,
            "access_token": access_token,
            "access_secret": access_token_secret}

# Get the authentication
def getAuth(access):
    auth = tweepy.OAuthHandler(access['consumer_key'], access['consumer_secret'])
    auth.set_access_token(access['access_token'], access['access_secret'])
    return auth

def handler(tweet):
    try:
        tweetdict = {}
        tweetdict["user"] = tweet["user"]["screen_name"]
        tweetdict["text"] = tweet["text"]

        if tweet["created_at"] is not None:
            stringTime = tweet["created_at"]
            tweetdict["date"] = datetime.strptime(stringTime,'%a %b %d %H:%M:%S %z %Y').strftime('%Y-%m-%d %H:%M:%S%z')
        else:
            tweetdict["date"] =""
        
        tweetdict["_id"] =datetime.strptime(stringTime,'%a %b %d %H:%M:%S %z %Y').strftime('%Y-%m-%d')+":"+tweet["id_str"]

        tweetdict["hashtags"] = []

        if tweet["entities"]["hashtags"] is not None:
            
            List = tweet["entities"]["hashtags"]
            for hashtag in List:
                tweetdict["hashtags"].append(hashtag["text"])
        
        elif tweet["extended_tweet"] is not None and\
             tweet["extended_tweet"]["entitites"] is not None and \
             tweet["extended_tweet"]["entitites"]["hashtags"] is not None:

            List = tweet["extended_tweet"]["entities"]["hashtags"]
            for hashtag in List:
                 tweetdict["hashtags"].append("#"+hashtag["text"])


        
        if tweet["coordinates"] is not None and tweet["coordinates"]["coordinates"] is not None:
            tweetdict["geo"] = tweet["coordinates"]["coordinates"]

        elif tweet["geo"] is not None and  tweet["geo"]["coordinates"] is not None:
            try:
                (X,Y) = tweet["geo"]["coordinates"]
                tweetdict["geo"] = [Y,X]
            except:
                tweetdict["geo"] = [""]
        
        else:
            tweetdict["geo"] = [""]
        
        tweetdict_labelled = label_sentiment(tweetdict)

        pack = json.dumps(tweetdict_labelled)
        print(pack)
        return pack

    except Exception as e:

        print(e)
        print("ahhh, maybe a rate limit")
        time.sleep(100)


parser = argparse.ArgumentParser(description='COMP90024 Twitter Streamer')
parser.add_argument('--filename', type=str, default="streamlog.txt")
parser.add_argument('--address',type = str,default="127.0.0.1")
parser.add_argument('--username',type = str,default= "admin")
parser.add_argument('--password',type = str,default = "password")
parser.add_argument('--database',type = str, default= "just_in_vic")
args = parser.parse_args()

PATH = "http://"+args.username+":"+args.password+"@"+args.address+":5984"


couch = couchdb.Server(PATH)
try:
    db = couch[args.database]
except:
    db = couch.create(args.database)

streamlog = open(args.filename, "w+",encoding= "utf-8")
        
class TweetListener(StreamListener):

    def on_data(self, data):

        tweet = json.loads(data,encoding = 'utf-8')
        print(tweet)
    	# need to filter out the retweets
        if not tweet["text"].startswith('RT') and tweet["retweeted"] == False:
            tweetjson = handler(tweet)
            if(tweetjson is not None):
                uploadable_tweet = json.loads(tweetjson)
                db.save(uploadable_tweet)
                streamlog.write(tweetjson+"\n")
        return True

    def on_error(self, status):
        print (status)


if __name__ == '__main__':


    #This handles Twitter authetification and the connection to Twitter Streaming API
    listener = TweetListener()
    auth = getAuth(access)
    stream = Stream(auth, listener)

    #This line filter Twitter Streams to capture data around Victoria state
    stream.filter(locations=[141, -38, 150, -34]) 

    streamlog.close()
