from flask import Flask
from cloudant.client import CouchDB
import os
from flask_apscheduler import APScheduler


env = os.environ


class Config(object):

    SCHEDULER_API_ENABLED = True


app = Flask(__name__, static_folder=os.path.abspath("../frontend/build/static"),
            template_folder=os.path.abspath('../frontend/build'))
# app = Flask(__name__)

app.config.from_object(Config())
scheduler = APScheduler()
# it is also possible to enable the API directly
# scheduler.api_enabled = True
scheduler.init_app(app)
scheduler.start()


client = CouchDB('admin', 'password',
                 url='http://' + env.get('COUCHDB_IP', '172.26.130.251') + ':5984', connect=True)

from project import controller
from project import model
