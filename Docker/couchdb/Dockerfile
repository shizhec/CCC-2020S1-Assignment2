# pull official base image
FROM couchdb:3.1.0

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# set CouchDB account
RUN sed -i '/\[chttpd\]/a\bind_address = 0.0.0.0' /opt/couchdb/etc/local.ini
RUN sed -i '/\[admins\]/a\admin = ccc' /opt/couchdb/etc/local.ini
RUN echo "couchdb@${COUCHDB_IP}" >> /opt/couchdb/etc/vm.args

RUN rm /opt/couchdb/releases/3.1.0/sys.config
COPY sys.config /opt/couchdb/releases/3.1.0

# run entrypoint.sh
# ENTRYPOINT ["/usr/src/app/entrypoint.sh"]