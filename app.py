from flask import Flask, render_template, request, send_from_directory
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from streetlevel import streetview
import os
import json

app = Flask(__name__)
limiter = Limiter(
    get_remote_address,
    app = app,
    storage_uri="memory://",
)

workdir = os.path.dirname(os.path.abspath(__file__))
panos_dir = os.path.join(workdir, 'panos')
# create panos directory if it doesn't exist
if not os.path.exists(panos_dir):
    os.makedirs(panos_dir)

panos_db = os.path.join(panos_dir, 'panos.json')
# create panos database if it doesn't exist
if not os.path.exists(panos_db):
    with open(panos_db, 'w') as f:
        f.write('[]')

# load panos
panos = []
with open(panos_db, 'r') as f:
    panos = json.load(f)


@app.route('/')
def index():
    return render_template('index.html')

@app.route("/download")
@limiter.limit("2/second;30/minute")
def download():
    latStr = request.args.get('lat')
    lonStr = request.args.get('lng')
    if latStr is None or lonStr is None:
        return {'error': 'Please provide lat and lng'}
    # get lat and long from form
    lat = float(latStr)
    lon = float(lonStr)
    
    pano = streetview.find_panorama(
        lat = lat,
        lon = lon,
        locale='de',
    )
    if pano is None:
        print(f"Panorama not found for lat={lat} and lon={lon}")
        return {'error': 'Panorama not found'}
    target_file = os.path.join(panos_dir, pano.id + '.jpg')
    if os.path.exists(target_file):
        print(f"Panorama {pano.id} already exists at {target_file}")
        return {'file': pano.id + '.jpg', 'id': pano.id}
    id = pano.id
    if streetview.is_third_party_panoid(id):
        return {'error': 'Third party panorama'}
    print(f"Downloading panorama {id} to {target_file}...")
    streetview.download_panorama(pano, target_file)
    print(f"Downloaded panorama {id} to {target_file}")
    address = pano.address
    if address:
        address_json = [{
            'value': address.value,
            'language': address.language,
        } for address in address]
    panos.append({
        'id': id,
        'lat': pano.lat,
        'lon': pano.lon,
        'address': address_json if address else None,
        'month': pano.month,
        'year': pano.year,
        'heading': pano.heading,
        'pitch': pano.pitch,
        'roll': pano.roll,
        'source': pano.source,
    })
    with open(panos_db, 'w') as f:
        json.dump(panos, f)
    return {'file': id + '.jpg', 'id': id}

@app.route("/view/<pano_id>")
def view(pano_id):
    server_url = request.host_url
    pano_url = server_url + 'static/panos/' + pano_id + '.jpg'
    return render_template('viewpano.html', pano_url=pano_url)

@app.route("/static/panos/<pano_id>.jpg")
def pano(pano_id):
    return send_from_directory(panos_dir, pano_id + '.jpg')

@app.route("/static/panos/panos.json")
def panos_json():
    return send_from_directory(panos_dir, 'panos.json')

if __name__ == '__main__':
    app.run(debug=True)