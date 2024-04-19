import { degreesToRadians, radiansToDegrees } from "./helper";
import L from 'leaflet'
export default function calculateCurvePoints(startLatLng, endLatLng) {
    // Calculate great circle route between start and end points
    const gcRoute = getGreatCircleRoute(startLatLng, endLatLng); // in real world shape

    // Convert great circle route to points
    const curvePoints = gcRoute.map((point) => L.latLng(point[0], point[1]));

    return curvePoints;
}


function getGreatCircleRoute(startLatLng, endLatLng) {
    const startLat = degreesToRadians(startLatLng.lat);
    const startLng = degreesToRadians(startLatLng.lng);
    const endLat = degreesToRadians(endLatLng.lat);
    const endLng = degreesToRadians(endLatLng.lng);

    const deltaLng = endLng - startLng;

    const y = Math.sin(deltaLng) * Math.cos(endLat);
    const x =
        Math.cos(startLat) * Math.sin(endLat) -
        Math.sin(startLat) * Math.cos(endLat) * Math.cos(deltaLng);

    const bearing = Math.atan2(y, x);
    const angularDistance = Math.acos(
        Math.sin(startLat) * Math.sin(endLat) +
        Math.cos(startLat) * Math.cos(endLat) * Math.cos(deltaLng)
    );

    const numPoints = 100; // Adjust the number of points for smoother curve
    const route = [];

    for (let i = 0; i <= numPoints; i++) {
        const delta = angularDistance * (i / numPoints);
        const lat = Math.asin(
            Math.sin(startLat) * Math.cos(delta) +
            Math.cos(startLat) * Math.sin(delta) * Math.cos(bearing)
        );
        const lng =
            startLng +
            Math.atan2(
                Math.sin(bearing) * Math.sin(delta) * Math.cos(startLat),
                Math.cos(delta) - Math.sin(startLat) * Math.sin(lat)
            );
        route.push([
            radiansToDegrees(lat),
            ((radiansToDegrees(lng) + 540) % 360) - 180,
        ]); // Normalize the longitude to [-180, 180)
    }

    return route;
}