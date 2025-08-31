
#!/bin/bash
set -ex

export HOME=/home/ubuntu
export NODE_ENV=development

BASE="/home/ubuntu/app/releases"
TIMESTAMP=$(date +%Y%m%d%H%M%S)
NEW_DIR="$BASE/$TIMESTAMP"

echo "→ Creating new release dir: $NEW_DIR"
mkdir -p "$NEW_DIR"

echo "→ Downloading artifact"
aws s3 cp s3://seenyor-backend-e3-pipeline-bucket/build_output/build_output.zip "$NEW_DIR/"

echo "→ Unpacking artifact"
unzip -o "$NEW_DIR/build_output.zip" -d "$NEW_DIR"

echo "→ Fix ownership of release directory"
chown -R ubuntu:ubuntu "$NEW_DIR"

echo "→ Installing dependencies as ubuntu"
cd "$NEW_DIR"
sudo -u ubuntu npm install --omit=dev


echo "→ Switching PM2 to new release"
sudo -u ubuntu pm2 stop nestjs-app || true
sudo -u ubuntu pm2 delete nestjs-app || true
sudo -u ubuntu pm2 start "$NEW_DIR/dist/main.js" --name nestjs-app --watch

echo "→ Updating current symlink"
ln -sfn "$NEW_DIR" /home/ubuntu/app/current

echo "→ Fix ownership of PM2 runtime files"
chown -R ubuntu:ubuntu /home/ubuntu/.pm2

echo "→ Saving PM2 process list"
sudo -u ubuntu pm2 save

echo "→ Configuring PM2 to restart on boot"
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

echo "→ Cleaning up artifact ZIP"
rm -f "$NEW_DIR/build_output.zip"

echo "→ Done deploying release $TIMESTAMP"
