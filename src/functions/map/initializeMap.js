//import leaflet
import L from 'leaflet'
import 'leaflet.markercluster'
import 'leaflet-lasso'
import 'leaflet/dist/leaflet.css'
import createMarkers from './mapFunctions/createMarkers/createMarkers';
import { createNodes } from './mapFunctions';
import axios from 'axios';
const getAirports = async () => {
    try {
        const startTime = performance.now(); // Start timer

        const response = await axios.get('http://localhost:5000/airports');
        const airports = response.data.shift();
        delete airports[Object.keys(airports)[0]]
        const endTime = performance.now(); // End timer
        const executionTime = endTime - startTime; // Calculate execution time
        console.log("Fetching time:", executionTime, "ms");
        return airports;
    } catch (error) {
        console.error("Error fetching airports:", error);
        console.log("Fetching from local storage.");
        return import('../../data/airports.json').then(airports => airports.default);
    }
};


export default async function initializeMap() {
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
    const airports = await getAirports();
    const startTime = performance.now(); // Start timer
    const nodes = createNodes(airports);
    createMarkers(L, map, nodes, airports);
    const endTime = performance.now(); // End timer
    const executionTime = endTime - startTime; // Calculate execution time
    console.log("nodes created in:", executionTime.toFixed(5), "milliseconds");

}





