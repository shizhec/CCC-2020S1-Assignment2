from flask import Flask
from cloudant.client import CouchDB
import os

env = os.environ


class Config(object):  # 创建配置，用类
    # 任务列表
    JOBS = [
        # {  # 第一个任务
        #     'id': 'job1',
        #     'func': '__main__:job_1',
        #     'args': (1, 2),
        #     'trigger': 'cron', # cron表示定时任务
        #     'hour': 19,
        #     'minute': 27
        # },
        {  # 第二个任务，每隔5S执行一次
            'id': 'job2',
            'func': '__main__:method_test',  # 方法名
            'args': (1, 2),  # 入参
            'trigger': 'interval',  # interval表示循环任务
            'seconds': 5,
        }
    ]


def method_test(a, b):
    print(a + b)


app = Flask(__name__, static_folder=os.path.abspath("../frontend/build/static"),
            template_folder=os.path.abspath('../frontend/build'))
app.config.from_object(Config())
# app = Flask(__name__)

client = CouchDB(env.get('COUCHDB_USER', 'admin'), env.get('COUCHDB_PASSWORD', 'password'),
                 url='http://' + env.get('COUCHDB_IP', '172.26.130.251') + ':5984', connect=True)

from project import controller
from project import model
