# Import statements
import picamera
import RPi.GPIO as GPIO
from datetime import datetime
import gpsd
import os

# Set up and create file path
filename = '%s.h264' % (datetime.now().strftime("%Y%m%d%H%M%S"))
file_path = "/media/pi/dashcam/" + (str(datetime.now().strftime("%Y/%m/%d/")))
directory = os.path.dirname(file_path)
if not os.path.exists(directory):
    os.makedirs(directory)

# Set gpsConnected to False so it will try to connect below
gpsConnected = False

# TODO: Move this to a config file
carOnInput = 17
recLight = 21
recordSeconds = 300

# GPIO Setup
GPIO.setmode(GPIO.BCM)
GPIO.setup(carOnInput, GPIO.IN)
GPIO.setup(recLight, GPIO.OUT)

carIsRunning = GPIO.input(carOnInput)

# Camera setup and initialization
camera = picamera.PiCamera()
camera.resolution = (1920, 1080)
fullFilename = os.path.join(file_path, filename)
camera.start_recording(fullFilename)
GPIO.output(recLight, 1)

# Main loop - continues until appropriate GPIO pin is activated
while carIsRunning == False: # this is False only for dev purposes. Switch to True when actually using

    # If not currently connected, try to connect GPS. If it doesn't work, carry on
    if gpsConnected == False:

        try:
            gpsd.connect()
            gpsConnected = True

        except:
            gpsConnected = False
            print("Failed to connect gpsd")

    # Set filename and then split recording
    filename = '%s.h264' % datetime.now().strftime("%Y-%m-%d-%H%M%S")
    fullFilename = os.path.join(file_path, filename)
    camera.split_recording(fullFilename)

    # Every second, check if car is still running (if not, stop recording)
    # Update timestamp to current time
    # If GPS is connected, update speed
    for second in range(0, recordSeconds):

        carIsRunning = GPIO.input(carOnInput)
        
        if carIsRunning == False:

            try:
                packet = gpsd.get_current()
                speed = "| {}mph".format(int(round(packet.speed())))

            except:
                speed = ""
                gpsConnected = False

            camera.annotate_text = "{} {}".format(datetime.now().strftime("%m/%d/%Y %H:%M:%S"), speed)
            camera.wait_recording(1)

        else:
            break

    carIsRunning = GPIO.input(carOnInput)

# When car turns off, stop recording, turn off rec light
camera.stop_recording
GPIO.output(recLight, 0)
GPIO.cleanup()
print("Recording stopped")
