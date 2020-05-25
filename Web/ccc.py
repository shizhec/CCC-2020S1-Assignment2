from project import app
from flask_apscheduler import APScheduler

if __name__ == '__main__':
    scheduler = APScheduler()
    scheduler.init_app(app)
    scheduler.start()
    app.run(host='0.0.0.0', debug=True, threaded=True)
