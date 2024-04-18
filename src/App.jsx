import {
  Routes,
  Route,
  BrowserRouter as Router,
} from "react-router-dom";
import Home from "./pages/Home";
import RoutesPage from "./pages/RoutesPage";
import AlgorithmsPage from "./pages/AlgorithmsPage";
import AboutUsPage from "./pages/AboutUsPage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <a href="/">
              <span className="tooltip">Home</span>
            </a>
          </li>
          <li>
            <a href="/routes">
              <span className="tooltip">Routes</span>
            </a>
          </li>
          <li>
            <a href="/algorithms">
              <span className="tooltip">Algorithms Used</span>
            </a>
          </li>
          <li>
            <a href="/about">
              <span className="tooltip">About Us</span>
            </a>
          </li>
        </ul>
      </nav>
      <Router>
        <Routes>
          <Route path="/" element={<Home />}>
          </Route>
          <Route path="/routes" element={<RoutesPage />}>
          </Route>
          <Route path="/algorithms" element={<AlgorithmsPage />}>
          </Route>
          <Route path="/about" element={<AboutUsPage />}>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
