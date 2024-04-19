import { calculateBearing, calculateCurvePoints } from "./index";
import L from 'leaflet'
let pathLayer = null;
export default function drawPath(path, map) {
    if (pathLayer) {
        map.removeLayer(pathLayer);
    }

    const pathLatLngs = [];
    path.map((node) => {
        const startLatLng = L.latLng(node.lat, node.lon);
        const endLatLng = L.latLng(node.parent.lat, node.parent.lon);

        // Calculate bearing
        const angle = calculateBearing(startLatLng, endLatLng);

        // Create elliptical flight path
        const curvePoints = calculateCurvePoints(startLatLng, endLatLng, angle);
        pathLatLngs.push(...curvePoints);
        console.log(pathLatLngs)
    });
    pathLayer = L.polyline(pathLatLngs, {
        color: "blue",
        weight: 3,
        opacity: 0.7,
    }).addTo(map);
}