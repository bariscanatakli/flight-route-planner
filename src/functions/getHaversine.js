

// Haversine formula function to calculate real-world distance between two points
export default function haversine(lat1, lon1, lat2, lon2) {
    // console.log("Calculating haversine distance.");
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180; // Convert latitude 1 degree to radians
    const φ2 = (lat2 * Math.PI) / 180; // Convert latitude 2 degree to radians
    const Δφ = ((lat2 - lat1) * Math.PI) / 180; // Latitude difference in radians
    const Δλ = ((lon2 - lon1) * Math.PI) / 180; // Longitude difference in radians

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Calculate distance

    // console.log("Haversine distance:", distance);
    return distance;
}