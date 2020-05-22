import json
import couchdb
from ast import literal_eval

import argparse

parser = argparse.ArgumentParser(description='COMP90024 /upload the tweets to the couchdb')
# parser.add_argument('--filename', type=str, default="Melbourne_April.txt")
parser.add_argument('--address',type = str,default="172.26.130.162")
parser.add_argument('--username',type = str,default= "admin")
parser.add_argument('--password',type = str,default = "password")
parser.add_argument('--database',type = str, default= "melbourne_test")
parser.add_argument('--filename',type = str,default = "processed_melbourne_april.json")
args = parser.parse_args()

# output = open(args.filename, "r+",encoding = "utf-8")

PATH = "http://"+args.username+":"+args.password+"@"+args.address+":5984"


couch = couchdb.Server(PATH)
try:
    db = couch[args.database]
except:
    db = couch.create(args.database)

print("done")



with open(args.filename,'r',encoding="utf-8") as f:
    bulk = json.loads(f.read())
    processed_tweets = bulk['docs']
    for processed_tweet in processed_tweets:
        try:
            db.save(processed_tweet)
        except:
            print(processed_tweet)
    # for i , line in enumerate(f):
    #     try:
    #         line = literal_eval(line.strip())
    #         db.save(line)
    #     except Exception as e:
    #         print(line)
