import "./App.css";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Home from "./Home.jsx";
import ReactGA from "react-ga4";

// Pages for each topic/category of simulations
import ClassicalPhysics from "./Pages/classicalPhysics.jsx";
import FluidDynamics from "./Pages/fluidDynamics.jsx";
import Waves from "./Pages/Waves.jsx";
import Electricity from "./Pages/Electricity.jsx";
import Thermodynamics from "./Pages/Thermodynamics.jsx";
import Optics from "./Pages/Optics.jsx";


import { Simulations, topicCategories } from "./data/simulations.js";
import { Button, Icons } from "./components/ui.jsx";
import { pageview } from "./lib/ga";   

// Initialize GA once (outside component)
ReactGA.initialize("G-6VBCEJ7FZ3"); 

const LoadingScreen = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white text-xl">
    <motion.div
      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      Loading simulations...
    </motion.div>
  </div>
);

const NotFoundPage = ({ onBack }) => (
  <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white font-[Inter]">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
      <Button onClick={onBack}>
        <Icons name="ArrowRight" className="mr-2 rotate-180" /> Back to Home
      </Button>
    </motion.div>
  </div>
);

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [simulations, setSimulations] = useState([]);
  const [featuredSims, setFeaturedSims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const categoryToPage = useMemo(() => {
    const mapping = {};
    topicCategories.forEach((topic) => {
      mapping[topic.id] = topic.page;
    });
    return mapping;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSimulations(Simulations);
      setFeaturedSims(Simulations.filter((sim) => sim.is_featured).slice(0, 3));
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Track page views
  useEffect(() => {
    pageview("/" + currentPage.toLowerCase());
  }, [currentPage]);

  const handleNavigation = (page) => {
    const resolvedPage = categoryToPage[page] || page;
    setCurrentPage(resolvedPage);
  };

  if (isLoading) return <LoadingScreen />;

  if (currentPage === "home") {
    return (
      <Home
        simulations={simulations}
        featuredSims={featuredSims}
        onNavigate={handleNavigation}
      />
    );
  }

  if (currentPage === "Classical") {
    return (
      <ClassicalPhysics
        onBack={() => handleNavigation("home")}
        simulations={simulations}
      />
    );
  }

  if (currentPage === "Fluids") {
    return (
      <FluidDynamics
        onBack={() => handleNavigation("home")}
        simulations={simulations}
      />
    );
  }

  if (currentPage === "Waves") {
    return (
      <Waves
        onBack={() => handleNavigation("home")}
        simulations={simulations}
      />
    );
  }
  
  if (currentPage === "Electricity") {
    return (
      <Electricity
        onBack={() => handleNavigation("home")}
        simulations={simulations}
      />
    );
  }

  if (currentPage === "Thermodynamics") {
    return (
      <Thermodynamics
        onBack={() => handleNavigation("home")}
        simulations={simulations}
      />
    );
  }

  if (currentPage === "Optics") {
    return (
      <Optics
        onBack={() => handleNavigation("home")}
        simulations={simulations}
      />
    );
  } 

  return <NotFoundPage onBack={() => handleNavigation("home")} />;
}

export default App;
