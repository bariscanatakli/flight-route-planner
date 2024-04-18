
import L from 'leaflet'
import 'leaflet.markercluster'
import 'leaflet-lasso'

import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import LTogglableMarker from './LTogglableMarker'


// script.js
console.log("Script loaded.");

// Node class for A* algorithm
class Node {
  constructor(name, lat, lon, cost) {
    this.name = name; // Airport name
    this.lat = lat; // Latitude
    this.lon = lon; // Longitude
    this.cost = cost || 0; // Cost of traversing to this node
    this.g = 0; // Real cost from start node to this node
    this.h = 0; // Estimated cost from this node to target node
    this.f = 0; // Total cost (g + h)
    this.parent = null; // Parent node
    this.wall = false; // Is this node a wall?
  }
}

// A* algorithm function
function astar(startNode, endNode, nodes) {
  console.log("Running A* algorithm.");
  let openSet = []; // Open list
  let closedSet = []; // Closed list
  openSet.push(startNode); // Add start node to open list

  while (openSet.length > 0) {
    // Find the node with the lowest f cost
    let currentNode = openSet[0];
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < currentNode.f) {
        currentNode = openSet[i];
      }
    }

    // If target node is reached, path found
    if (currentNode === endNode) {
      console.log("Path found.");
      let path = [];
      let current = currentNode;
      while (current !== startNode) {
        path.push(current);
        current = current.parent;
      }
      return path.reverse();
    }

    // Move current node from open list to closed list
    let index = openSet.indexOf(currentNode);
    openSet.splice(index, 1);
    closedSet.push(currentNode);

    // Check neighbors
    let neighbors = getNeighbors(currentNode, nodes);
    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];
      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        let tempG = currentNode.g + neighbor.cost; // Temporary g cost including neighbor's cost
        let newPath = false;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbor);
        }

        if (newPath) {
          neighbor.h = haversine(
            neighbor.lat,
            neighbor.lon,
            endNode.lat,
            endNode.lon
          ); // Estimate h cost using real distance to target
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.parent = currentNode;
        }
      }
    }
  }

  // No path found to target
  console.log("No path found.");
  return [];
}

// Get neighbors of a node function
function getNeighbors(node, nodes) {
  console.log("Getting neighbors for node:", node.name);
  let neighbors = [];
  for (let i = 0; i < nodes.length; i++) {
    if (node !== nodes[i]) {
      neighbors.push(nodes[i]);
    }
  }
  console.log("Neighbors:", neighbors);
  return neighbors;
}

// Haversine formula function to calculate real-world distance between two points
function haversine(lat1, lon1, lat2, lon2) {
  console.log("Calculating haversine distance.");
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

  console.log("Haversine distance:", distance);
  return distance;
}

import airports from "../data/airports.json"

// Initialize the map
export default function initMap() {
  console.log("Initializing map.");
  // Create the map
  const map = L.map("map").setView([36, 42], 3);
  let airportMarkers = []
  // Add the OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    minZoom: 1,
    maxZoom: 12,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
  }).addTo(map);
  L.control.scale().addTo(map)
  // Define nodes array based on airports data
  const nodes = Object.values(airports).map(
    (airport) => new Node(airport.name, airport.lat, airport.lon, airport.elevation)
  );
  console.log(nodes)
  const airportClusterGroup = L.markerClusterGroup()
  map.addLayer(airportClusterGroup)
  L.control.lasso({ position: 'topleft' }).addTo(map)
  // Display flight data on the map
  Object.values(airports).forEach((airport) => {
    const airportMarker = new LTogglableMarker([airport.lat, airport.lon], {
      title: `${airport.name} (${airport.code})`,
      itemId: airport.code,
      toggledIconClassName: 'toggled-airport'
    })
    airportMarker.on("click", handleMarkerClick); // Add click event listener to each marker
    airportMarkers.push(airportMarker)
    airportClusterGroup.addLayer(airportMarker)
    // const marker = L.marker([airport.lat, airport.lon]).addTo(map);
    // marker.bindPopup(`<b>${airport.name}</b><br>${airport.city}, ${airport.state}`);
  });

  // Function to find a node by its coordinates
  function findNodeByCoordinates(lat, lon) {
    for (const node of nodes) {
      if (node.lat === lat && node.lon === lon) {
        return node;
      }
    }
    return null;
  }

  // Function to handle marker click events
  let startMarker = null; // Variable to store the start marker
  let endMarker = null; // Variable to store the end marker
  let pathLayer = null; // Variable to store the path layer

  function handleMarkerClick(event) {
    console.log("Marker clicked.");
    const marker = event.target;

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
        startMarker.getLatLng().lng
      );
      const endNode = findNodeByCoordinates(
        endMarker.getLatLng().lat,
        endMarker.getLatLng().lng
      );
      console.log("Start Node:", startNode);
      console.log("End Node:", endNode);
      const path = astar(startNode, endNode, nodes);
      console.log(path);
      // Draw path on map
      drawPath(path);
    }
  }
  function drawPath(nodes) {
    if (pathLayer) {
      map.removeLayer(pathLayer);
    }

    const pathLatLngs = [];
    nodes.map((node) => {
      const startLatLng = L.latLng(node.lat, node.lon);
      const endLatLng = L.latLng(node.parent.lat, node.parent.lon);

      // Calculate bearing
      const angle = calculateBearing(startLatLng, endLatLng);

      // Create elliptical flight path
      const curvePoints = calculateCurvePoints(startLatLng, endLatLng, angle);
      pathLatLngs.push(...curvePoints);
    });

    pathLayer = L.polyline(pathLatLngs, {
      color: "blue",
      weight: 3,
      opacity: 0.7,
    }).addTo(map);
  }

  function calculateBearing(startLatLng, endLatLng) {
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

  function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  function radiansToDegrees(radians) {
    return (radians * 180) / Math.PI;
  }
  function calculateCurvePoints(startLatLng, endLatLng) {
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
}

// Run initMap function when the page loads
window.addEventListener("load", initMap);

