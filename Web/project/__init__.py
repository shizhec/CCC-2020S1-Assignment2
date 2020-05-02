from flask import Flask
# from couchdb import Server

app = Flask(__name__)
# server = Server('http://115.146.95.246:5984')
# db = server['twitter_rest']

# server = Server('http://172.26.38.7:5984')
# db = server['city_resultdb']


# import view_db.couchdb
# from app import model
from project import controller
