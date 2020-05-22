from flask import Flask
# from couchdb import Server
from cloudant.client import CouchDB
import os

env = os.environ

app = Flask(__name__)
client = CouchDB(env.get('COUCHDB_USER', 'admin'), env.get('COUCHDB_PASSWORD', 9588),
                 url='http://'+env.get('COUCHDB_IP', '127.0.0.1')+':5984', connect=True)

from project import controller
from project import model
