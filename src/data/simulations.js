import { desc } from "framer-motion/client";

export const Simulations = [
  {
    id: 1,
    title: "Pendulum Motion",
    description: "Explore simple harmonic motion with an interactive pendulum",
    category: "mechanics",
    is_featured: true,
  },
  {
    id: 2,
    title: "Wave Interference",
    description: "Visualize constructive and destructive wave interference",
    category: "waves",
    is_featured: false,
  },

// ADD SIM WITH ID 3


  {
    id: 4,
    title: "Projectile Motion",
    description: "Study the path of objects under gravity, and be able to predict the flight of objects",
    category: "mechanics",
    is_featured: true,
  },

  {
    id: 5,
    title: "Elastic Collision Lab",
    description: "Model 1D collisions with adjustable masses, velocities, and restitution",
    category: "mechanics",
    is_featured: false,
  },

  {
    id: 6, 
    title: "Flow Rate Simulator", 
    description: "Visualize how pipe width and fluid velocity affect flow rate",
    category: "fluids",
    is_featured: true,
  },

  {
    id: 7, 
    title: "Buoyancy and Density", 
    description: "Explore how objects float or sink based on their density relative to the fluid",
    category: "fluids",
    is_featured: false,
  },

  {
    id: 8,  
    title: "Waves on a String", 
    description: "Explore the behaviour of waves on a string.", 
    category: "waves", 
    is_featured: false
  }

  /* Add more simulations as needed */
];

export const topicCategories = [
  {
    id: "mechanics",
    title: "Classical Mechanics",
    page: "Classical",
    description: "Motion, forces, energy, and momentum",
  },
  
  { 
    id: "fluids",
    title: "Fluid Dynamics",
    page: "Fluids",
    description: "Oscillations, interference, and wave propagation",
  }, 

  {
    id: "waves",
    title: "Wave Physics",
    page: "Waves",
    description: "Oscillations, interference, and wave propagation",
  },
 
 
  /* {
    id: "thermo", 
    title: "Thermodynamics (Coming Soon)", 
    page: "Thermodynamics",
    description: "Heat transfer, the ideal gas law, and particle behaviour"
  },
  */ 

  {
    id: "electricity",
    title: "Electricity & Magnetism (Coming Soon)",
    page: "Electricity",
    description: "Electric fields, circuits, and electromagnetic effects",
  },
];