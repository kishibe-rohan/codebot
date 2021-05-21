#!/bin/bash

set -e

# setup ssh key

mkdir ~/.ssh
touch ~/.ssh/id_rsa
echo "$PRIVATE_SSH_KEY" >> ~/.ssh/id_rsa
echo "" >> ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa

# copy env
touch build/.env
echo "BOT_TOKEN=$BOT_TOKEN" >> build/.env
echo "SHARED_SECRET=$SHARED_SECRET" >> build/.env

# copy package files inside build folder
cp package.json yarn.lock build

scp -o StrictHostKeyChecking=no -r build ubuntu@$EC2_IP:~/

ssh ubuntu@$EC2_IP <<'EOL'
	cd ~/build
    yarn install --frozen-lockfile
    yarn start:prod
EOL

echo "Done"