# COMP90024 Cluster and Cloud Computing Team 12
# @Author：Haoyu Zhang
# @Email: haoyu1@student.unimelb.edu.au

from flask import Flask
from cloudant.client import CouchDB
import os
from flask_apscheduler import APScheduler


# configuration
class Config(object):
    SCHEDULER_API_ENABLED = True


# load templates and static from build of ReactJS
app = Flask(__name__, static_folder=os.path.abspath("../frontend/build/static"),
            template_folder=os.path.abspath('../frontend/build'))

# APScheduler initialization
app.config.from_object(Config())
scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()

# creat couchDB client
client = CouchDB('admin', 'password',
                 url='http://' + os.environ.get('COUCHDB_IP', '172.26.130.251') + ':5984',
                 connect=True, auto_renew=True)

from project import controller
from project import model
