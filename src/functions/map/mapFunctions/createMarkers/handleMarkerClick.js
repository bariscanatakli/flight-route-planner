// Function to handle marker click events
let startMarker = null; // Variable to store the start marker
let endMarker = null; // Variable to store the end marker

import { drawPath, findNodeByCoordinates } from "../index";
import { astar } from '../../../algorithm';

export default async function handleMarkerClick(marker, L, nodes, map) {
    console.log("Marker clicked.");
    if (!startMarker) {
        console.log("Setting start marker.");
        startMarker = marker;
        startMarker.setIcon(L.divIcon({ className: "start-marker-icon" })); // Change start marker icon
    } else if (!endMarker) {
        console.log("Setting end marker.");
        endMarker = marker;
        endMarker.setIcon(L.divIcon({ className: "end-marker-icon" })); // Change end marker icon

        // Calculate best path
        const startNode = findNodeByCoordinates(
            startMarker.getLatLng().lat,
            startMarker.getLatLng().lng,
            nodes
        );
        const endNode = findNodeByCoordinates(
            endMarker.getLatLng().lat,
            endMarker.getLatLng().lng,
            nodes
        );
        console.log("Start Node:", startNode);
        console.log("End Node:", endNode);

        const startTime = performance.now(); // Start timer

        const path = await astar(startNode, endNode, nodes);

        console.log(path);
        // Draw path on map
        drawPath(path, map);
        const endTime = performance.now(); // End timer
        const executionTime = endTime - startTime; // Calculate execution time
        console.log("Execution time:", executionTime.toFixed(5), "milliseconds");
        // Reset start and end markers for future pathfinding
        startMarker = null;
        endMarker = null;
    }
}
