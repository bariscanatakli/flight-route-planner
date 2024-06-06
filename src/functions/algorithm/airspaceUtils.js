import haversine from "../getHaversine";
import axios from 'axios'; // Import Axios for making HTTP requests

// Function to fetch weather observation data from Weatherbit API by latitude and longitude
async function fetchWeatherData(lat, lon) {
  const apiKey = '13ff5463b4c14c69ad73138812ecb78b'; // Replace 'YOUR_WEATHERBIT_API_KEY' with your actual API key
  const apiUrl = `https://api.weatherbit.io/v2.0/current?key=${apiKey}&lat=${lat}&lon=${lon}`;

  try {
    // Make a GET request to Weatherbit API
    const response = await axios.get(apiUrl);
    // Return the weather observation data
    return response.data;
  } catch (error) {
    // Handle any errors
    console.error('Error fetching weather data:', error);
    return null;
  }
}

// Function to calculate weather impact based on weather observation data
function calculateWeatherImpact(weatherData) {
  // Extract relevant weather parameters from the weather observation data
  const windSpeed = weatherData.data[0].wind_spd; // Wind speed in meters per second
  const visibility = weatherData.data[0].vis; // Visibility in meters
  const weatherDescriptions = weatherData.data[0].weather.description.toLowerCase(); // Weather description
  
  // Initialize weather impact
  let weatherImpact = 0;

  // Check for critical weather conditions and assign impact values accordingly
  if (windSpeed > 20) {
    weatherImpact += 30; // High impact for strong winds (above 20 m/s)
  }
  if (visibility < 5000) {
    weatherImpact += 20; // Moderate impact for low visibility (below 5000 meters)
  }
  if (weatherDescriptions.includes('thunderstorm') || weatherDescriptions.includes('tornado') || weatherDescriptions.includes('hail')) {
    weatherImpact += 50; // High impact for thunderstorms, tornadoes, or hail
  }
  // Add conditions for other critical weather factors such as icing, turbulence, etc.

  return weatherImpact;
}

// Get neighbors of a node function
export default async function getNeighbors(node, nodes, maxDistance) {
  console.log("Getting neighbors for node:", node.name);
  let neighbors = [];
  for (let i = 0; i < nodes.length; i++) {
    const neighbor = nodes[i];
    if (node !== neighbor) {
      const distance = haversine(node.lat, node.lon, neighbor.lat, neighbor.lon);
      if (distance <= maxDistance && !isRestrictedAirspace(node, neighbor)) {
        const weatherData = await fetchWeatherData(neighbor.lat, neighbor.lon);
        if (weatherData) {
          const weatherImpact = calculateWeatherImpact(weatherData);
          if (weatherImpact !== Infinity) {
            // Adjust cost based on weather conditions
            neighbor.cost += weatherImpact;
            neighbors.push(neighbor);
          }
        }
      }
    }
  }
  
  console.log("Neighbors within", maxDistance, "meters:", neighbors);
  return neighbors;
}

// Function to check if a node is in restricted airspace
export function isRestrictedAirspace(node) {
  // Implement logic to check if a node is in restricted airspace
  // This function can be further developed based on your specific requirements
  // For demonstration purposes, return false to indicate that the node is not in restricted airspace
  return false;
}
