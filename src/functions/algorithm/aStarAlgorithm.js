import haversine from "../getHaversine";
import getNeighbors from "./getNeighbors";

// A* algorithm function
export default async function astar(startNode, endNode, nodes) {
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
    if (currentNode.lat === endNode.lat && currentNode.lon === endNode.lon) {
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

    // Find distance between start and end nodes
    let distance = haversine(
      startNode.lat,
      startNode.lon,
      endNode.lat,
      endNode.lon
    );

    // Check neighbors
    let neighbors = await getNeighbors(currentNode, nodes, distance);
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
