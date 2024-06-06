const AlgorithmsPage = () => {
  return (
    <>
      <h1>Our Used Algorithms</h1>
      <div className="text-container">
        <p>So far we only used A* search algorithm more to be covered.</p>
        <p>In computer science, it is an algorithm used to find the shortest path.</p>
        <p>It helps to determine the shortest path from a node to a target node through which nodes, using the "best fit" algorithm.</p>
        <p>The algorithm has a simple structure that uses the addition operation above. Using a priority queue as its data structure, the most prioritized node is the one with the lowest f(n) value.</p>
        <p> 1. At each step, the algorithm takes the node with the lowest value (and thus the most important one) and removes it from the queue.</p>
        <p> 2. Based on this visited node, the values of all neighboring nodes are updated (now there is a cost to come to this node, and it should be noted that this value is included in the f(n) function).</p>
        <p> 3. The algorithm repeats the above steps until it reaches the target (i.e., the target node becomes the first in the priority queue) or until there are no more nodes in the queue.</p>
      </div>
    </>
  );
};

export default AlgorithmsPage;
