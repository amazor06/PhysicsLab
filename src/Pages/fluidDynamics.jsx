import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Card, Icons } from "../components/ui.jsx";

// Fluid Simulations
import FlowRateSim from "./fluidDynamicsSims/flowRate.jsx"; // adjust path as needed

export default function FluidDynamics({ onBack, simulations = [] }) {
  // Filter only fluid simulations
  const fluidSimulations = simulations.filter((sim) =>
    sim.category === "fluids" || sim.category === "fluid"
  );
  const [activeSimulationId, setActiveSimulationId] = useState(null);

  // Map sim IDs to components
  const simulationComponents = {
    6: FlowRateSim, // Flow Rate simulation
    // Add more fluid sims here as you build them
  };

  const ActiveSimulationComponent = simulationComponents[activeSimulationId] || null;

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white font-[Inter]">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mt-12 mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
          Fluid Dynamics
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            {" "}Sims
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
          A collection of interactive simulations to explore fluid flow, viscosity, and flow rate.
        </p>
        <Button onClick={onBack}>
          <Icons name="ArrowRight" className="mr-2 rotate-180" /> Back to Home
        </Button>
      </motion.div>

      {/* Simulation Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {fluidSimulations.map((sim) => {
          const hasInteractiveView = Boolean(simulationComponents[sim.id]);
          const isActive = activeSimulationId === sim.id;

          return (
            <motion.div
              key={sim.id}
              variants={{ hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } }}
            >
              <Card className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{sim.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{sim.description}</p>
                </div>
                <div className="mt-4">
                  {hasInteractiveView ? (
                    <Button
                      className="w-full"
                      onClick={() =>
                        setActiveSimulationId((current) => (current === sim.id ? null : sim.id))
                      }
                    >
                      {isActive ? "Hide Simulation" : "Run Simulation"}
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => {}}
                    >
                      Coming Soon
                    </Button>
                  )}
                  {hasInteractiveView && isActive && (
                    <p className="mt-3 text-xs text-slate-400 text-center">
                      Scroll to the live lab below to experiment with parameters.
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Active Simulation Display */}
      {ActiveSimulationComponent && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mt-12 w-full max-w-6xl"
        >
          <ActiveSimulationComponent key={activeSimulationId} />
        </motion.div>
      )}
    </div>
  );
}
