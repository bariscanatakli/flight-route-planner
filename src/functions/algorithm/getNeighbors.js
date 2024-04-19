// Get neighbors of a node function
export default function getNeighbors(node, nodes) {
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





