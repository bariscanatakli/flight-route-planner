// Function to find a node by its coordinates
export default function findNodeByCoordinates(lat, lon, nodes) {
    for (const node of nodes) {
      if (node.lat === lat && node.lon === lon) {
        return node;
      }
    }
    return null;
  }