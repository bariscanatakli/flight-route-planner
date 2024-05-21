// Node class for A* algorithm
class Node {
    constructor(name, lat, lon, cost = 0) {
        this.name = name; // Airport name
        this.lat = lat; // Latitude
        this.lon = lon; // Longitude
        this.cost = cost; // Cost of traversing to this node
        this.g = 0; // Real cost from start node to this node
        this.h = 0; // Estimated cost from this node to target node
        this.f = 0; // Total cost (g + h)
        this.parent = null; // Parent node
        this.wall = false; // Is this node a wall?
    }
}


function createNodes(airports) {
    const nodes = Object.values(airports).map(
        (airport) => new Node(airport.name, airport.lat, airport.lon, airport.elevation)
    );
    return nodes;
}




export default createNodes;
