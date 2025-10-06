#!/bin/bash

set -e

# Validate required IMAGE_TAG
if [ -z "$IMAGE_TAG" ]; then
  echo "❌ ERROR: IMAGE_TAG is not set. Aborting."
  exit 1
fi

# Determine active and inactive service
if docker ps | grep -q rest_bazar_blue; then
  ACTIVE="rest_bazar_blue"
  INACTIVE="rest_bazar_green"
else
  ACTIVE="rest_bazar_green"
  INACTIVE="rest_bazar_blue"
fi

echo "🔁 Active: $ACTIVE"
echo "🚀 Deploying to: $INACTIVE with image tag: $IMAGE_TAG"

# Start inactive app container (using already built image)
echo "⏳ Starting $INACTIVE with new image..."
docker compose -f docker-compose.production.yml -p rest_bazar up -d --no-deps --force-recreate \
  --scale $INACTIVE=1 $INACTIVE

# Health check
echo "🔍 Checking health on $INACTIVE.."
for i in {1..10}; do
  CONTAINER_ID=$(docker compose -f docker-compose.production.yml ps -q $INACTIVE)

  if [ -z "$CONTAINER_ID" ]; then
    echo "❌ Could not find running container for $INACTIVE (attempt $i)"
    sleep 5
    continue
  fi

  CONTAINER_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' "$CONTAINER_ID")

  if [ -z "$CONTAINER_IP" ]; then
    echo "❌ Could not resolve IP for $INACTIVE container (attempt $i)"
    sleep 5
    continue
  fi

  STATUS=$(curl -s -o /dev/null -w '%{http_code}' http://$CONTAINER_IP:5000/health || echo "000")

  if [ "$STATUS" = "200" ]; then
    echo "✅ $INACTIVE is healthy and responding (HTTP 200)."
    break
  else
    echo "⏳ $INACTIVE not healthy yet (status $STATUS)... attempt $i"
  fi

  sleep 5

  if [ "$i" -eq 10 ]; then
    echo "❌ $INACTIVE failed health check after 10 attempts."
    docker logs "$CONTAINER_ID"
    exit 1
  fi
done

echo "🔄 Ensuring infra services are running (start only if not already up)..."
PROJECT="rest_bazar"
# INFRA_SERVICES=(redis prometheus grafana loki promtail redis_exporter node_exporter nginx_exporter cadvisor alertmanager)
INFRA_SERVICES=(redis)
for SERVICE in "${INFRA_SERVICES[@]}"; do
  CONTAINER_NAME="${PROJECT}_${SERVICE}_1"
  
  STATUS=$(docker inspect -f '{{.State.Running}}' "$CONTAINER_NAME" 2>/dev/null || echo "false")
  
  if [ "$STATUS" != "true" ]; then
    echo "🔹 Starting $SERVICE..."
    ACTIVE_APP=$INACTIVE docker compose -f docker-compose.infra.yml -p "$PROJECT" up -d "$SERVICE"
  else
    echo "✅ $SERVICE already running as $CONTAINER_NAME."
  fi
done

# Switch NGINX traffic
echo "🔄 Switching NGINX to $INACTIVE "
docker compose -f docker-compose.production.yml -p rest_bazar stop nginx || true
ACTIVE_APP=$INACTIVE docker compose -f docker-compose.production.yml -p rest_bazar up -d nginx

# Stop the previous app container
echo "🛑 Stopping and removing old app $ACTIVE... "
docker compose -f docker-compose.production.yml -p rest_bazar stop $ACTIVE
docker compose -f docker-compose.production.yml -p rest_bazar rm -f $ACTIVE

# Switch Prometheus Storage
# echo "🔄 Switching Prometheus to $INACTIVE "
# docker compose -f docker-compose.infra.yml -p rest_bazar stop prometheus || true
# ACTIVE_APP=$INACTIVE docker compose -f docker-compose.infra.yml -p rest_bazar up -d prometheus

echo "✅ Blue-Green Deployment Complete. Live: $INACTIVE"
