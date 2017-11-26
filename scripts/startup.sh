#!/bin/bash
python3.5 /home/pi/carputer/scripts/dashcam.py &
node /home/pi/carputer/app.js &
chromium-browser --noerrdialogs --disable-session-crashed-bubble --disable-infobars --kiosk http://localhost:8000
