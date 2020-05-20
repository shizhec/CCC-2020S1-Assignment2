#!/bin/bash


echo "Waiting for CouchDB..."

while ! nc -z $COUCHDB_IP 5984; do
    sleep 0.1
done

echo "CouchDB started"



sed -i '/\[chttpd\]/a\bind_address = 0.0.0.0' local.ini
sed -i '/\[admins\]/a\admin = ccc' local.ini

echo "couchdb@${COUCHDB_IP}" >> vm.args
sed -i '/^\[\]\./d' sys.config
echo '[
    {lager, [
        {error_logger_hwm, 1000},
        {error_logger_redirect, true},
        {handlers, [
            {lager_console_backend, [debug, {
                lager_default_formatter,
                [
                    date, " ", time,
                    " [", severity, "] ",
                    node, " ", pid, " ",
                    message,
                    "\n"
                ]
            }]}
        ]},
        {inet_dist_listen_min, 9100},
        {inet_dist_listen_max, 9200}
    ]}
].' >> sys.config


exec "$@"