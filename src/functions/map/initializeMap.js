//import leaflet
import L from 'leaflet'
import 'leaflet.markercluster'
import 'leaflet-lasso'
import 'leaflet/dist/leaflet.css'
import createMarkers from './mapFunctions/createMarkers/createMarkers';
import {createNodes} from './mapFunctions';
import airports from '../../data/airports.json'
export default function initializeMap() {
    // Initialize the map
    console.log("Initializing map.");


    // Create the map
    const map = L.map("map").setView([36, 42], 3);
    // Add the OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        minZoom: 1,
        maxZoom: 12,
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
    }).addTo(map);
    L.control.scale().addTo(map)


    L.control.lasso({ position: 'topleft' }).addTo(map)

    const nodes = createNodes(airports);
    createMarkers(L, map, nodes, airports);


}





