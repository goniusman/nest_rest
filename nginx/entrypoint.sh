#!/bin/sh
# : "${ACTIVE_APP:=rest_bazar_green}"  # fallback to rest_bazar_green if not set 
envsubst '${ACTIVE_APP}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
exec nginx -g 'daemon off;'

