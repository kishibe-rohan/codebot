#!/bin/bash

set -e

# setup ssh key

mkdir ~/.ssh
touch ~/.ssh/id_rsa
echo $PRIVATE_SSH_KEY | base64 -d > ~/.ssh/id_rsa
echo "" >> ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa

# copy package files inside build folder
cp package.json yarn.lock build

scp -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa -r build ubuntu@$EC2_IP:~/

echo "Done"