import haversine from "../getHaversine";
import axios from "axios";

// Get neighbors of a node function
export default async function getNeighbors(node, nodes, maxDistance) {
  console.log("Getting neighbors for node:", node.name);
  let neighbors = [];

  for (let i = 0; i < nodes.length; i++) {
    const neighbor = nodes[i];
    if (node !== neighbor) {
      const distance = haversine(node.lat, node.lon, neighbor.lat, neighbor.lon);
      if (distance <= maxDistance) {
        neighbors.push(neighbor);
      }
    }
  }
  // We disabled weather integration because of the api problems. But it works in the theory and it is if range is short. 
  // // Fetch weather data for all neighbors in batch
  // const weatherData = await fetchWeatherData(neighbors);

  // // Calculate weather impact for each neighbor and adjust cost
  // for (let i = 0; i < neighbors.length; i++) {
  //   const neighbor = neighbors[i];
  //   const weather = weatherData && weatherData[i]; // Corresponding weather data for the neighbor
  //   if (weather) {
  //     const weatherImpact = calculateWeatherImpact(weather);
  //     if (weatherImpact !== Infinity) {
  //       // Adjust cost based on weather conditions
  //       neighbor.cost += weatherImpact;
  //     }
  //   }
  // }

  console.log("Neighbors within", maxDistance, "meters:", neighbors);

  return neighbors;
}

// Function to calculate weather impact based on weather observation data
function calculateWeatherImpact(weatherData) {
  // Extract relevant weather parameters from the weather observation data
  const windSpeed = weatherData.wind_spd; // Wind speed in meters per second
  const visibility = weatherData.vis * 1000; // Visibility in meters (convert from km)
  const weatherDescriptions = weatherData.weather.description.toLowerCase(); // Weather description

  // Initialize weather impact
  let weatherImpact = 0;

  // Check for critical weather conditions and assign impact values accordingly
  if (windSpeed > 20) {
    weatherImpact += 100; // High impact for strong winds (above 20 m/s)
  } else if (windSpeed > 10) {
    weatherImpact += 50; // Moderate impact for winds between 10 and 20 m/s
  }

  if (visibility < 1000) {
    weatherImpact += 100; // High impact for very low visibility (below 1000 meters)
  } else if (visibility < 5000) {
    weatherImpact += 50; // Moderate impact for low visibility (below 5000 meters)
  }

  if (weatherDescriptions.includes('thunderstorm') || weatherDescriptions.includes('tornado') || weatherDescriptions.includes('hail')) {
    weatherImpact += 200; // Very high impact for thunderstorms, tornadoes, or hail
  } else if (weatherDescriptions.includes('snow') || weatherDescriptions.includes('ice') || weatherDescriptions.includes('sleet')) {
    weatherImpact += 150; // High impact for snow, ice, or sleet
  } else if (weatherDescriptions.includes('rain') || weatherDescriptions.includes('drizzle')) {
    weatherImpact += 50; // Moderate impact for rain or drizzle
  }

  // Add conditions for other critical weather factors such as turbulence, icing, etc.
  // Consider additional rules based on actual aviation guidelines for realism

  return weatherImpact;
}

// Function to fetch weather observation data from Weatherbit API for multiple nodes at once
async function fetchWeatherData(nodes) {
  const apiKey = 'ed3b64bc0c8941928ed4e57bc94bff5f'; // Replace 'YOUR_WEATHERBIT_API_KEY' with your actual API key
  const baseUrl = `https://api.weatherbit.io/v2.0/current`;

  // Split nodes into batches of 200
  const batchSize = 150;
  let allWeatherData = [];

  for (let i = 0; i < nodes.length; i += batchSize) {
    const batch = nodes.slice(i, i + batchSize);
    const points = batch.map(node => `${node.lat},${node.lon}`).join(',');

    try {
      // Make a GET request to Weatherbit API with batch coordinates
      const response = await axios.get(baseUrl, {
        params: {
          key: apiKey,
          points: points
        }
      });

      // Concatenate the weather observation data from each batch
      allWeatherData = allWeatherData.concat(response.data.data);
    } catch (error) {
      // Handle any errors
      console.error('Error fetching weather data:', error);
    }
  }

  return allWeatherData;
}
