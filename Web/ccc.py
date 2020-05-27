from project import app


class Config(object):
    JOBS = [
        {
            'id': 'job1',
            'func': 'ccc:job1',
            'args': (1, 2),
            'trigger': 'interval',
            'seconds': 10
        }
    ]

    SCHEDULER_API_ENABLED = True





if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, threaded=True)


