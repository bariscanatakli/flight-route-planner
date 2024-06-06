import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
// import markers
import LTogglableMarker from './LTogglableMarker';
import { handleMarkerClick } from '..';

export default function createMarkers(L, map, nodes, airports) {
    const airportClusterGroup = L.markerClusterGroup();
    map.addLayer(airportClusterGroup);

    const airportKeys = Object.keys(airports);
    const airportMarkers = new Array(airportKeys.length);

    for (let i = 0; i < airportKeys.length; i++) {
        const airport = airports[airportKeys[i]];
        const airportMarker = new LTogglableMarker([airport.lat, airport.lon], {
            title: `${airport.name} (${airport.code})`,
            itemId: airport.code,
            toggledIconClassName: 'toggled-airport'
        });
        airportMarker.on("click", function (event) {
            handleMarkerClick(event.target, L, nodes, map);
        }); // Add click event listener to each marker
        airportMarkers[i] = airportMarker;
    }

    airportClusterGroup.addLayers(airportMarkers);
}
