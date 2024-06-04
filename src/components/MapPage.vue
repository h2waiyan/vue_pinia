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

            var myMap = new Mazemap.Map({
                container: 'map',
                campuses: 49,
                center: { lng: 17.629996594328058, lat: 59.857310651927755 },
                zoom: 18,
                zLevel: 1,
                zLevelControl: false,
                scrollZoom: true,
                doubleClickZoom: false,
                touchZoomRotate: false,
                interactive: true
            });

            var globalMarkerFeatures = [];
            var globalPopup = null;

            myMap.on('load', function () {
                // MazeMap ready

                addMarkerLayer();

                // First floor markers
                placeNewMarker({ lng: -78.49858990312386, lat: 38.031039074605786 }, { zLevel: 1, color: randomColor() });
                placeNewMarker({ lng: -78.4986567724052, lat: 38.03102736985389 }, { zLevel: 1, color: randomColor() });
                placeNewMarker({ lng: -78.49864108701857, lat: 38.03099030477844 }, { zLevel: 1, color: randomColor() });
                placeNewMarker({ lng: -78.49844047917823, lat: 38.03102346826756 }, { zLevel: 1, color: randomColor() });

                // Second floor markers
                placeNewMarker({ lng: -78.49860228632478, lat: 38.031001359272636 }, { zLevel: 2, color: randomColor() });
                placeNewMarker({ lng: -78.49853211485772, lat: 38.03102151747149 }, { zLevel: 2, color: randomColor() });


                myMap.on('click', function (e) {
                    var lngLat = e.lngLat;
                    var zLevel = myMap.zLevel;

                    console.log('@ e', lngLat);

                    var features = myMap.queryRenderedFeatures(e.point, { layers: ['geojsonMarkers'] });
                    if (!features || features.length < 1) {
                        // Did not click on an existing marker in the marker layer
                        // Place a new one here
                        placeNewMarker(lngLat, { zLevel: zLevel, color: randomColor() });
                        return;
                    } else {
                        // We clicked on an existing marker feature
                        // Show a popup here
                        globalPopup = new Mazemap.Popup({ closeOnClick: true, offset: [0, -6] })
                            .setLngLat(features[0].geometry.coordinates)
                            .setHTML('<p style="white-space: pre;">' + JSON.stringify(features[0].properties, null, 2) + '</p>')
                            .addTo(myMap);
                    }

                });

                myMap.on('zlevel', redrawMarkerLayer);


                var customZLevelBar = new Mazemap.ZLevelBarControl({
                    className: 'custom-zlevel-bar static',
                    autoUpdate: false,
                    zLevels: { '1': '1st Floor', '2': '2nd Floor' }
                });
                myMap.addControl(customZLevelBar, 'bottom-left');
            });

            function placeNewMarker(lngLat, properties) {
                var feature = { type: 'Feature', geometry: { type: 'Point', coordinates: [lngLat.lng, lngLat.lat] }, properties: properties || {} };

                globalMarkerFeatures.push(feature);

                redrawMarkerLayer();

            };

            function addMarkerLayer() {
                // Add a source layer to use with the layer for rendering geojson features
                myMap.addSource('geojsonMarkers', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });

                myMap.addLayer({
                    id: "geojsonMarkers",
                    type: "circle",
                    source: "geojsonMarkers",
                    paint: {
                        "circle-color": { type: "identity", "property": "color" },
                        "circle-radius": 7,
                        "circle-stroke-width": 2,
                        "circle-stroke-color": "#fff"
                    },
                    filter: ['==', 'zLevel', 1]
                }, 'mm-building-label'); // Optional - Add this layer UNDER the buildingsLabel layer
            }

            function redrawMarkerLayer() {
                if (globalPopup) {
                    globalPopup.remove();
                }

                // Update the visibility filter for the layer to match the current map zLevel
                myMap.setFilter('geojsonMarkers', ['==', 'zLevel', myMap.zLevel]);

                // Set the actual GeoJSON data to be drawn
                myMap.getSource('geojsonMarkers').setData({ type: 'FeatureCollection', features: globalMarkerFeatures });
            }

            function randomColor() {
                var colors = ["#FF7B00", "#FF37A9", "#219CC4", "#66DC7A", "#B953FC", "#1FAFFC", "#CC14DE"];
                var random = Math.round(Math.random() * 6);
                return colors[random];
            }

            return {}
        });
    }
}
</script>

<style scoped>
.mazemap {
    height: 80vh;
    width: 60%;
    border: 1px solid #000;
}
</style>