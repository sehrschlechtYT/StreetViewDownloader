# StreetViewDownloader

Web app that allows you to download and view google street view panoramas  
<br>
![image](https://github.com/sehrschlechtYT/StreetViewDownloader/assets/66412605/05bef95f-f881-4ac6-8ae0-46ad55eece42)

### Information

### About this project
On July 21, 2021, Google removed the old street view images from 2008/2009 for Germany.
Before that, this tool was used to download panoramas from germany to preserve them. 

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

#### Read-only mode

If you want to run the server in read-only mode (no panoramas can be downloaded, could be useful for freezing a public instance), you can set the environment variable `VIEWONLY_MODE` to `true`.  
To do this, copy the `.env.example` file to `.env` and change the value of `VIEWONLY_MODE` to `true`.  
You can also configure your own error message by setting a value for `VIEWONLY_MESSAGE`.

### Libraries
- [Flask](https://flask.palletsprojects.com) for the web server
- [Flask-limiter](https://flask-limiter.readthedocs.io) for rate limiting
- [Streetlevel](https://github.com/sk-zk/streetlevel) for downloading the panoramas
- [python-dotenv](https://pypi.org/project/python-dotenv/) for loading the environment variables from the .env file

### Legal notice
This project is not affiliated with Google LLC. It is a private project and is not intended for commercial use. I do not take any responsibility for the use of this project. I do not own any of the imagery that can be downloaded using this project. All imagery belongs to Google LLC.