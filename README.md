# StreetViewDownloader

Web app that allows you to download and view google street view panoramas  
<br>
![image](https://github.com/sehrschlechtYT/StreetViewDownloader/assets/66412605/05bef95f-f881-4ac6-8ae0-46ad55eece42)


### Reason for creation
According to an [announcement by google](https://blog.google/intl/de-de/produkte/suchen-entdecken/google-street-view-aktualisierung-deutschland/), they will be updating their street view images in Germany in mid July 2023. However, the old images from 2008/2009 will be deleted. I wanted to make it possible to download some panoramas before they are gone forever.

### How to run

#### Run using the terminal

Prequisites: Python 3
The following commands are for Windows and Linux. The program was not tested on MacOS.
1. Clone the repository using `git clone https://github.com/sehrschlechtYT/StreetViewDownloader.git`
2. Go into the directory using `cd StreetViewDownloader`
3. Install the dependencies using `pip install -r requirements.txt`
4. Execute the command `flask run` to start the server
5. Visit `localhost:5000` in your browser
6. 
To download a panorama, just click on a blue line or dot on the map. The panorama will be downloaded and then shown in the browser automatically. If you want to download multiple panoramas in the background without having them displayed in the browser (the browser lags every time a panorama is loaded), you can hold shift while clicking on the map.  
Press [Tab] to toggle the map.

### Libraries
- [Flask](https://flask.palletsprojects.com) for the web server
- [Flask-limiter](https://flask-limiter.readthedocs.io) for rate limiting
- [Streetlevel](https://github.com/sk-zk/streetlevel) for downloading the panoramas

### Public instance

There (probably) won't be a public instance of this app. You can run it yourself using the instructions above. The reason for this is that the panoramas take up a lot of disk space (3-4 mb per panorama) and the google street view api may block the ip address if too many requests are made.