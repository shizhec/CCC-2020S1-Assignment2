import tweepy
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
import json as js
import argparse
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
        tweetdict["id"] = tweet["id_str"]
        tweetdict["user"] = tweet["user"]["screen_name"]
        tweetdict["text"] = tweet["text"]

        if tweet["created_at"] is not None:
            stringTime = tweet["created_at"]
            tweetdict["date"] = datetime.strptime(stringTime,'%a %b %d %H:%M:%S %z %Y').strftime('%Y-%m-%d %H:%M:%S%z')
        else:
            tweetdict["date"] =""

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
                 tweetdict["hashtags"].append(hashtag["text"])


        
        if tweet["coordinates"] is not None and tweet["coordinates"]["coordinates"] is not None:
            tweetdict["geo"] = ["coordinates"]["coordinates"]

        elif tweet["geo"] is not None and  tweet["geo"]["coordinates"] is not None:
            try:
                (X,Y) = tweet["geo"]["coordinates"]
                tweetdict["geo"] = [X,Y]
            except:
                tweetdict["geo"] = []
        
        else:
            tweetdict["geo"] = []

        pack = js.dumps(tweetdict)
        print(pack.geo)

    except Exception as e:

        print(e)
        
class TweetListener(StreamListener):

    def on_data(self, data):

        tweet = js.loads(data,encoding = 'utf-8')
    
    	# need to filter out the retweets
        if not tweet["text"].startswith('RT') and tweet["retweeted"] == False:
            # file.write(data)
            handler(tweet)
        return True

    def on_error(self, status):
        print (status)


if __name__ == '__main__':


    #This handles Twitter authetification and the connection to Twitter Streaming API
    listener = TweetListener()
    auth = getAuth(access)
    stream = Stream(auth, listener)

    #This line filter Twitter Streams to capture data around Victoria state
    stream.filter(track=['Melbourne']) 
