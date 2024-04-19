import { degreesToRadians, radiansToDegrees } from "./helper";

export default function calculateBearing(startLatLng, endLatLng) {
    const startLat = degreesToRadians(startLatLng.lat);
    const startLng = degreesToRadians(startLatLng.lng);
    const endLat = degreesToRadians(endLatLng.lat);
    const endLng = degreesToRadians(endLatLng.lng);

    const y = Math.sin(endLng - startLng) * Math.cos(endLat);
    const x =
        Math.cos(startLat) * Math.sin(endLat) -
        Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);

    let bearing = Math.atan2(y, x);
    bearing = radiansToDegrees(bearing);
    bearing = (bearing + 360) % 360; // Normalize to range [0, 360)
    return bearing;
}


