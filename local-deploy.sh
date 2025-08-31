#!/bin/bash

set -e

# Fix line endings if needed
sed -i 's/\r$//' ./prometheus/entrypoint.sh
sed -i 's/\r$//' ./nginx/entrypoint.sh

PROJECT_NAME="rest_bazar"
STAGING_COMPOSE="docker-compose.production.yml" # docker-compose.staging.yml
INFRA_COMPOSE="docker-compose.infra.yml"
ACTIVE_APP="rest_bazar_green"

# function render_nginx_conf() {
#   echo "Rendering nginx.conf from template with ACTIVE_APP=${ACTIVE_APP}..."
#   envsubst '${ACTIVE_APP}' < ./nginx/nginx.conf.template > ./nginx/nginx.conf
# }

function up() {
  echo "Starting deployment..."

  

  echo "Starting nginx service..."
  ACTIVE_APP=$ACTIVE_APP docker compose -f $STAGING_COMPOSE -p $PROJECT_NAME up -d nginx

  echo "Starting $ACTIVE_APP service..."
  ACTIVE_APP=$ACTIVE_APP docker compose -f $STAGING_COMPOSE -p $PROJECT_NAME up -d $ACTIVE_APP

  echo "Starting infra services..."
  ACTIVE_APP=$ACTIVE_APP docker compose -f $INFRA_COMPOSE -p $PROJECT_NAME up -d
  
  # render_nginx_conf
  echo "Deployment completed."
}

function down() {
  echo "Stopping all services..."

  echo "Stopping infra services..."
  docker compose -f $INFRA_COMPOSE -p $PROJECT_NAME down

  echo "Stopping staging services..."
  docker compose -f $STAGING_COMPOSE -p $PROJECT_NAME down

  echo "All services stopped."
}

function usage() {
  echo "Usage: $0 {up|down}"
  exit 1
}

if [ $# -ne 1 ]; then
  usage
fi

case "$1" in
  up)
    up
    ;;
  down)
    down
    ;;
  *)
    usage
    ;;
esac
