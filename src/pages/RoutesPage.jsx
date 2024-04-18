// Add type="module" to script tag to enable ES modules

import "leaflet/dist/leaflet.css";
// Refactored to use plain JavaScript instead of React hook
function RoutesPage() {
  const script = document.createElement("script");
  script.src = "src/functions/script.js";
  script.type = "module";
  document.body.appendChild(script);

  return (
    <>
      <h1>Flight Route Planner</h1>
      <div className="map-container">
        <div id="map"></div>
      </div>
    </>
  );
}

export default RoutesPage;
