<template>
    <div class="flex flex-col items-center">
        <h1 class="font-bold underline my-5">AnimateMarker Map With Marker</h1>
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

            var startLngLat = { lng: -78.49890300323919, lat: 38.03140865387675 };
            var destLngLat = { lng: -78.4985511896671, lat: 38.03148740262034 };

            // Just the same way to initialize as always...
            var myMap = new Mazemap.Map({
                container: 'map',
                campuses: 50,
                center: startLngLat,
                zoom: 18.837,
                zLevel: 1,
                zLevelControl: false,
                scrollZoom: true,
                doubleClickZoom: false,
                touchZoomRotate: false,
                interactive: true
            });

            var zoomInOutBool = false;
            var mapZoom = 18.837;

            myMap.on('load', function () {
                var blueDot = window.blueDot = new Mazemap.BlueDot({
                    map: myMap
                })
                    .setZLevel(1)
                    .setAccuracy(5)
                    .setLngLat(startLngLat)
                    .setBearing(60)
                    .setBearingAccuracy(60)
                    .showBearingHint()
                    .show();

                function setNewPosition() {

                    const [newLngLat, direction] = calcLinearLatLng(startLngLat, destLngLat, 5);

                    blueDot.setLngLatAnimated(newLngLat);
                    // blueDot.setLngLat(newLngLat, {animate: false});
                    if (direction) {
                        blueDot.setBearing(60 + 180);
                    } else {
                        blueDot.setBearing(60);
                    }
                    myMap.flyTo({
                        zoom: mapZoom, center: newLngLat, duration: 400, easing: function (a) {
                            return a;
                        }
                    });
                }

                function setNewAccuracy() {
                    var accuracy = Math.random() * 3 + 10;
                    blueDot.setAccuracy(accuracy);
                }

                setInterval(setNewPosition, 250);
                setInterval(setNewAccuracy, 2000);

                setInterval(toggleZoomInOut, 5000);
            });

            function toggleZoomInOut() {
                zoomInOutBool = !zoomInOutBool;

                if (zoomInOutBool) {
                    mapZoom = 20.5;
                } else {
                    mapZoom = 18.837;
                };
            }

            // Returns a linear moving point along the line between startLatLng and endLatLng given a speed factor
            function calcLinearLatLng(startLatLng, endLatLng, speed) {

                var startPoint = myMap.project(startLatLng);
                var endPoint = myMap.project(endLatLng);

                var dX = endPoint.x - startPoint.x;
                var dY = endPoint.y - startPoint.y;

                var now = performance.now();

                var lengthTime = speed * 1000;

                var timeFraction = (now % lengthTime) / lengthTime;

                var fractionX = dX * timeFraction;
                var fractionY = dY * timeFraction;

                var fractionPoint = new Mazemap.mapboxgl.Point(fractionX, fractionY);


                //Alternate the direction
                var direction = Math.floor(now / lengthTime) % 2;

                var calcPoint;
                if (direction) {
                    calcPoint = endPoint.sub(fractionPoint);
                } else {
                    calcPoint = startPoint.add(fractionPoint);
                }
                var calcLatLng = myMap.unproject(calcPoint);

                return [calcLatLng, direction];
            }

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