#!/usr/bin/env bash
rm -rf ./dist

python3 -m venv .venv
source .venv/bin/activate
cd ./src/backend
pip install -r requirements.txt
pyinstaller main.py -y
chmod +x ./dist/main/main
cd ../../
cp -R ./src/backend/dist/main ./dist

cd ./src/frontend
npm install
npm run build
cd ../../

cp -R ./src/frontend/build ./dist/frontend