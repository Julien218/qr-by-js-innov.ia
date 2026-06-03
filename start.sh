#!/bin/sh
PORT=${PORT:-8080}
sed -i "s/PORT_PLACEHOLDER/$PORT/g" /etc/nginx/conf.d/default.conf
echo "Starting nginx on port $PORT"
nginx -g "daemon off;"
