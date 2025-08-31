#!/bin/sh
# : "${ACTIVE_APP:=nestapp_green}"  # fallback to nestapp_green if not set 
envsubst '${ACTIVE_APP}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
exec nginx -g 'daemon off;'

