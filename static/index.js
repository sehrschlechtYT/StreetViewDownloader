$(document).ready(function () {
    const panosJson = $.ajax({
        url: "/static/panos/panos.json",
        dataType: "json",
        async: false
    }).responseJSON;
    console.log(panosJson);
    var viewer = new PhotoSphereViewer.Viewer({
        container: document.querySelector('#panorama'),
        panorama: 'https://philemon.dev/STATIC/default_panorama.jpeg',
        minFov: 15,
        plugins: [
            [PhotoSphereViewer.CompassPlugin, {
                hotspots: [
                    { yaw: '0deg' },
                    { yaw: '90deg' },
                    { yaw: '180deg' },
                    { yaw: '270deg' },
                ],
            }],
        ],
    });

    var center = localStorage.getItem("center") ? JSON.parse(localStorage.getItem("center")) : [49.48, 8.47];
    var zoom = localStorage.getItem("zoom") ? localStorage.getItem("zoom") : 13;

    var osmTiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    var streetViewTiles = L.tileLayer('https://www.google.com/maps/vt?pb=!1m7!8m6!1m3!1i{z}!2i{x}!3i{y}!2i9!3x1!2m8!1e2!2ssvv!4m2!1scc!2s*211m3*211e2*212b1*213e2*212b1*214b1!4m2!1ssvl!2s*211b0*212b1!3m8!2sen!3sus!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m4!1e0!8m2!1e1!1e1!6m6!1e12!2i2!11e0!39b0!44e0!50e0', {
        maxZoom: 19,
        minZoom: 6,
        attribution: '&copy; Google Maps',
    });
    var panoramaGroup = L.markerClusterGroup();
    var map = L.map('map', {
        center: center,
        zoom: zoom,
        layers: [osmTiles, streetViewTiles, panoramaGroup]
    });

    var baseMaps = {
        "OpenStreetMap": osmTiles,
    };
    var overlayMaps = {
        "Street View Coverage": streetViewTiles,
        "Panoramas": panoramaGroup,
    };
    var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

    L.Control.geocoder({
        defaultMarkGeocode: false,
    })
        .on('markgeocode', function (e) {
            var latlng = e.geocode.center;
            var zoom = 17;
            map.setView(latlng, zoom);
        })
        .addTo(map);

    var markersMap = {};
    for (var i = 0; i < panosJson.length; i++) {
        var pano = panosJson[i];
        var lat = pano.lat;
        var lng = pano.lon;
        var marker = L.marker([lat, lng]).addTo(panoramaGroup);
        var address = pano.address;
        var addressString = "Address: ";
        if (address) {
            for (var j = 0; j < address.length; j++) {
                addressString += address[j].value + ", ";
            }
            addressString = addressString.substring(0, addressString.length - 2);
        } else {
            addressString += "Unknown";
        }
        var sourceString = "Unknown";
        if (pano.source == "launch") {
            sourceString = "Car coverage";
        } else if (pano.source == "scout") {
            sourceString = "Trekker or tripod coverage";
        }

        marker.bindPopup(`
            <b>${pano.id}</b><br>
            ${lat}, ${lng}<br>
            ${addressString}<br>
            Coverage type: ${sourceString}<br>
            Date: ${pano.month}/${pano.year}
        `)
        marker.on('click', function (e) {
            // get id from marker by looking up in markersMap
            var id;
            for (var key in markersMap) {
                if (markersMap[key] == e.target) {
                    id = key;
                    break;
                }
            }
            handleMarkerClick(e, id, viewer);
        });
        if (i == 0) {
            if (marker._icon != null) {
                marker._icon.classList.add("marker-active");
            }
        }
        markersMap[pano.id] = marker;
    }

    map.on('click', function (e) {
        var holdingShift = e.originalEvent.shiftKey;
        var lat = e.latlng.lat;
        var lng = e.latlng.lng;
        // show toast for loading state
        var toastText = holdingShift ? "Downloading in background..." : "Downloading...";
        var toast = Toastify({
            text: toastText,
            duration: 10000,
            gravity: "top",
            position: "center",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            stopOnFocus: true
        });
        toast.showToast();
        $.ajax({
            url: '/download',
            data: {
                lat: lat,
                lng: lng,
            },
            success: function (response) {
                // close toast
                toast.hideToast();
                console.log(response);
                if (response.error) {
                    Toastify({
                        text: response.error,
                        duration: 3000,
                        gravity: "top",
                        position: "center",
                        style: {
                            background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                        },
                        stopOnFocus: true
                    }).showToast();
                    return;
                }

                var downloadedId = response.id;
                $(".marker-active").removeClass("marker-active");
                // add marker
                var marker = L.marker([lat, lng]).addTo(panoramaGroup);
                marker.bindPopup("<b>" + downloadedId + "</b><br>" + lat + ", " + lng);
                marker.on('click', function (e) {
                    handleMarkerClick(e, downloadedId, viewer);
                });

                if (holdingShift) {
                    return;
                }

                if (marker._icon != null) {
                    marker._icon.classList.add("marker-active");
                }

                // add panorama
                var currentUrl = window.location.href;
                var url = currentUrl + "static/panos/" + downloadedId + ".jpg";
                displayPanorama(url, viewer);
            },
            error: function (error) {
                toast.hideToast();
                if (error.status == 429) {
                    Toastify({
                        text: "You have reached the download limit. Please wait a few seconds (or up to a minute) and try again.",
                        duration: 5000,
                        gravity: "top",
                        position: "center",
                        style: {
                            background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                        },
                        stopOnFocus: true
                    }).showToast();
                } else {
                    Toastify({
                        text: "There seems to be a problem with the server. Please try again later.",
                        duration: 3000,
                        gravity: "top",
                        position: "center",
                        style: {
                            background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                        },
                        stopOnFocus: true
                    }).showToast();
                }
            }
        });
    });

    // listen to pressing "TAB" key
    $(document).keydown(function (e) {
        if (e.keyCode == 9) {
            e.preventDefault();
            var mapElement = document.getElementById("map");
            if (mapElement.classList.contains("map-hidden")) {
                mapElement.classList.remove("map-hidden");
            } else {
                mapElement.classList.add("map-hidden");
            }
        }
    });

    // every 5 seconds, save map position to local storage
    setInterval(function () {
        var center = map.getCenter();
        var zoom = map.getZoom();
        localStorage.setItem("center", JSON.stringify(center));
        localStorage.setItem("zoom", zoom);
    }, 5000);
});

function displayPanorama(url, viewer) {
    console.log("displaying panorama at " + url);
    viewer.setPanorama(url);
}

function handleMarkerClick(e, id, viewer) {
    var toast = Toastify({
        text: "Loading panorama...",
        duration: 10000,
        gravity: "top",
        position: "center",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        stopOnFocus: true
    });
    toast.showToast();
    $(".marker-active").removeClass("marker-active");
    e.target._icon.classList.add("marker-active");
    var currentUrl = window.location.href;
    var url = currentUrl + "static/panos/" + id + ".jpg";
    displayPanorama(url, viewer);
    toast.hideToast();
}