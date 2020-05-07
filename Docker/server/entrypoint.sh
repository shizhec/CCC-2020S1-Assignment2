#!/bin/bash

if [ "$DATABASE" = "postgres" ]
then
   echo "Waiting for postgres..."

   while ! nc -z $SQL_HOST $SQL_PORT; do
     sleep 0.1
   done

   echo "PostgreSQL started"
fi

python manage.py create_db

sed -i '/\[chttpd\]/a\bind_address = 0.0.0.0' local.ini
sed -i '/\[admins\]/a\admin = ccc' local.ini

echo "couchdb@${IPADD}" >> vm.args
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