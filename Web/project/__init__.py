from flask import Flask
# from couchdb import Server
from cloudant.client import CouchDB

app = Flask(__name__)
client = CouchDB('admin', 'password', url='http://172.26.130.251:5984', connect=True)

from project import controller
from project import model
