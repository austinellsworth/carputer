#! /bin/bash
cd /home/pi/carputer
screen -d -m node app.js
cd /home/pi/carputer/scripts
screen -d -m python3.5 dashcam.py
exit 0