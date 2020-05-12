import json
import couchdb
from ast import literal_eval

couch = couchdb.Server('http://90024_12:90024_12@localhost:5984')
db = couch.create('perth_april')

with open('Perth_April.txt','r',encoding="utf-8") as f:
    for i , line in enumerate(f):
        try:
            line = literal_eval(line.strip())
            db.save(line)
        except Exception as e:
            print(line)
            pass




