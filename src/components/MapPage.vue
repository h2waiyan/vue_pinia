<template>
    <div class="flex flex-col items-center">
        <h1 class="font-bold underline my-5">Basic Map With Marker</h1>
        <div class="relative w-full flex flex-row items-center">
            <div id="map" class="mazemap"></div>
        </div>
    </div>
</template>

<script>
import { onMounted } from 'vue';

export default {
    setup() {
        onMounted(() => {

            var map = new Mazemap.Map({
                container: 'map',
                campuses: 49,
                center: { lng: 17.629396524328058, lat: 59.857611651927755 },
                zoom: 18,
                zLevel: 1,
                scrollZoom: true,
                doubleClickZoom: false,
                touchZoomRotate: false
            });

            function readExcelFile(url) {
                return fetch(url).then(function (res) {
                    if (!res.ok) throw new Error("fetch failed");
                    return res.blob();
                }).then(function (blob) {
                    return new Promise((resolve) => {
                        var reader = new FileReader();
                        reader.addEventListener("loadend", function () {
                            var data = new Uint8Array(this.result);
                            var wb = XLSX.read(data, { type: "array" });
                            //process_wb(wb);
                            resolve(wb);
                        });
                        reader.readAsArrayBuffer(blob);
                    });
                });
            }
            class ExcelSheet {
                constructor(sheet) {
                    this.sheet = sheet;
                }


                // Input: range like "A1:F5"
                // makes an object of each row, with values corresponding to each column
                // If headers is false or Array, use entire range as data values.
                // If not, default to using first row as header keys

                getRangeAsJSON(range, headers = true) {
                    var customHeaderKeys = false;

                    if (headers instanceof Array) {
                        customHeaderKeys = headers;
                    }

                    /* Create a json like:
                    [
                      [A1, A2, A3],
                      [B1, B2, B3],
                      [C1, C2, C3],
                    ]
                    */
                    var json = XLSX.utils.sheet_to_json(this.sheet, { range: range, blankrows: true, header: 1, defVal: null });

                    /* Now transform this into json objects, using the first row as keys or use custom headers
                        [
                            {A1: B1, A2: B2, A3: B3},
                            {A1: C1, A2: C2, A3: C3},
                        ]
                    */

                    let headerKeys = false;
                    if (headers && !customHeaderKeys) {
                        headerKeys = json.splice(0, 1)[0];
                    } else {
                        headerKeys = customHeaderKeys;
                    }

                    // Remove the first item and keep it as keys or use an array if specified

                    var resultArray = json.map((rowValues) => {
                        var obj = {};

                        rowValues.map((value, index) => {
                            let key = headerKeys && headerKeys[index] || "value" + index;
                            obj[key] = value;
                        });

                        return obj;
                    })

                    return resultArray;

                }

            }


            function readExcelAndDraw() {

                readExcelFile("./example-room-list.xlsx").then((workbook) => {
                    var sheet = window.sheet = new ExcelSheet(workbook.Sheets[workbook.SheetNames[0]]);

                    var jsonRows = sheet.getRangeAsJSON("A1:D3");

                    // For every row, fetch the room from the "MazeMap Identifier" column and when complete, draw all rooms
                    fetchIdentifiers(jsonRows, "MazeMap Identifier")
                        .then((features) => { console.log('Got features', features); return features; })
                        .then(drawFeatures)
                        .catch(e => console.warn)
                });

            }

            // Take an identifier array and return the data results for all
            function fetchIdentifiers(poisArray, identifierKey) {

                // Take the identifiers array and transform to new array of actual poi requests
                var roomRequests = poisArray.map((poiObject) => {
                    var reqest = Mazemap.Data.getPois({ campusid: 49, identifier: poiObject[identifierKey] })
                        .then((arr) => {
                            // Only return the FIRST result of an identifier search
                            return arr[0];
                        })
                        .catch((e) => {
                        }).then((feature) => { return feature || false })
                        .then((feature) => {
                            Object.assign(feature.properties, poiObject);
                            return feature;
                        });

                    return reqest;
                });

                // When all the requests are processed, do filter the results and return them
                return Promise.all(roomRequests).then((results) => {
                    // If some results was FALSE, filter out those
                    return results.filter(f => f);
                });
            }

            // Take an array of maemap features and draw them on the map
            function drawFeatures(featuresArray) {
                map.getSource("geojsonPOIs").setData({ type: "FeatureCollection", features: featuresArray });
            }

            function addClickEvents() {

                map.layerEventHandler.on('click', 'geojsonPOIs', (e, features) => {
                    console.log('Clicked layer geojsonPOIs', e, features);
                    var feature = features && features[0];
                    showPopupOnPoi(feature, e.lngLat);
                })

                map.layerEventHandler.on('click', null, (e) => {
                    Mazemap.Data.getPoiAt(e.lngLat, map.getZLevel())
                        .then((poi) => {
                            console.log('Clicked on the base map, poi here is:', poi);
                        });
                })
            }

            function showPopupOnPoi(feature, lngLat) {
                if (!feature) { return; }
                // Make a custom popup right here on the fly
                new Mazemap.Popup({ closeOnClick: true, offset: [0, 0] })
                    .setLngLat(lngLat)
                    .setHTML(generateRoomInfoHTML(feature))
                    .addTo(map);
            }

            // Make some generic HTML for representing a room's info
            function generateRoomInfoHTML(feature) {
                var table = "<table>";
                Object.keys(feature.properties).forEach((key) => {
                    if (!feature.properties.hasOwnProperty(key)) { return; }

                    table += "<tr><td>" + key + "</td>";
                    table += "<td>" + feature.properties[key] + "</td></tr>";
                });
                table += "</table>";

                return '<h3>Info</h3><p style="max-width: 160px;">' + table + '</p>'
            }

            function addCustomLayer() {
                // Add a source layer to use with the layer for rendering geojson features
                map.addSource('geojsonPOIs', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });

                map.addLayer({
                    id: "geojsonPOIs",
                    type: "fill",
                    source: "geojsonPOIs",
                    paint: {
                        "fill-color": { type: "identity", "property": "Color Code" },
                        "fill-opacity": 0.5
                    },
                    filter: ['==', 'zLevel', 1]
                });

                map.on('zlevel', () => {
                    map.setFilter("geojsonPOIs", ['==', 'zLevel', map.getZLevel()]);
                });
            }

            // Add zoom and rotation controls to the map.
            map.addControl(new Mazemap.mapboxgl.NavigationControl());

            map.on('load', function () {
                // MazeMap ready

                var lngLat = map.getCenter();

                var marker = new Mazemap.MazeMarker({
                    color: "Red",
                    size: 36,
                    zLevel: 1
                }).setLngLat(lngLat).addTo(map);

                marker.on('click', function (e) {
                    new Mazemap.Popup({ closeOnClick: true, offset: [0, -6] })
                        .setLngLat(marker.getLngLat())
                        .setHTML('Custom click!This is a marker with a custom click handling.')
                        .addTo(map);

                });

                // Add a layer for putting room json data with custom coloring
                addCustomLayer();

                readExcelAndDraw();


            });

            // Add a new Marker.
            const marker = new map.Marker({
                color: '#F84C4C' // color it red
            });

            // Define the animation.
            function animateMarker(timestamp) {
                const radius = 20;

                /* 
                Update the data to a new position 
                based on the animation timestamp. 
                The divisor in the expression `timestamp / 1000` 
                controls the animation speed.
                 */
                marker.setLngLat([
                    Math.cos(timestamp / 1000) * radius,
                    Math.sin(timestamp / 1000) * radius
                ]);

                /* 
                Ensure the marker is added to the map. 
                This is safe to call if it's already added.
                */
                marker.addTo(map);

                // Request the next frame of the animation.
                requestAnimationFrame(animateMarker);
            }

            // Start the animation.
            requestAnimationFrame(animateMarker);

        });



        return {}
    }
}
</script>

<style scoped>
.mazemap {
    height: 400px;
    width: 60%;
    border: 1px solid #000;
}
</style>