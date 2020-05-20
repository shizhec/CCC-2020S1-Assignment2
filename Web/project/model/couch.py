from collections import Counter
from datetime import datetime
import calendar
from project import app

from project import client
from cloudant.database import CloudantDatabase


class DB(client):
    def __init__(self, url, ):
        self.client = client


    @staticmethod
    def get_sentimnet(self, start_date, end_date):
        db = CloudantDatabase(client, 'canberra_april', fetch_limit=100, partitioned=False)
        result = db.get_view_result('_design/coronavirus-related', 'new-view', reduce=False)

