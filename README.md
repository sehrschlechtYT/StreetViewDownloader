# StreetViewDownloader

Web app that allows you to download and view google street view panoramas  
<br>
![image](https://github.com/sehrschlechtYT/StreetViewDownloader/assets/66412605/05bef95f-f881-4ac6-8ae0-46ad55eece42)

### Information

**Street view coverage for Germany was removed by Google on July 21! Soon, this service will be transitioned to a read-only mode for the existing data.**

### Reason for creation
According to an [announcement by google](https://blog.google/intl/de-de/produkte/suchen-entdecken/google-street-view-aktualisierung-deutschland/), they will be updating their street view images in Germany in mid July 2023. However, the old images from 2008/2009 will be deleted. I wanted to make it possible to download some panoramas before they are gone forever.

## Read before using

**If you are able to, please run your own instance (see *How to run*)!**


There is a public **demo** instance available [here](https://streetview.philemon.dev).


Demo server limitations:
- The demo instance is **rate limited** to 1 download per second, 10 per minute
- The server IP might get blocked by google after a while
- I might run out of space and **delete the panoramas**
- There may be issues with copyright which may force me to shut down the server.
- I might **shut down the server at any time**, so don't rely on it.

### How to run

#### Run using the terminal

Prequisites: Python 3
The following commands are for Windows and Linux. The program was not tested on MacOS.
1. Clone the repository using `git clone https://github.com/sehrschlechtYT/StreetViewDownloader.git`
2. Go into the directory using `cd StreetViewDownloader`
3. Install the dependencies using `pip install -r requirements.txt`
4. Execute the command `flask run` to start the server
5. Visit `localhost:5000` in your browser

To download a panorama, just click on a blue line or dot on the map. The panorama will be downloaded and then shown in the browser automatically. If you want to download multiple panoramas in the background without having them displayed in the browser (the browser lags every time a panorama is loaded), you can hold shift while clicking on the map.  
Press [Tab] to toggle the map.

### Libraries
- [Flask](https://flask.palletsprojects.com) for the web server
- [Flask-limiter](https://flask-limiter.readthedocs.io) for rate limiting
- [Streetlevel](https://github.com/sk-zk/streetlevel) for downloading the panoramas