#!/bin/bash
set -e # exit on non-zero status
set -x # show commands
source /etc/profile
nvm use 18

# build, since we already have .npmrc defined, no need to npm i --registry
npm i -g pnpm
pnpm i
pnpm build

echo 'Build success.'
