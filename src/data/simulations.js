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
    is_featured: true,
  },
  {
    id: 3,
    title: "Electric Field Lines",
    description: "See how electric fields behave around charged objects",
    category: "electricity",
    is_featured: true,
  },
  {
    id: 4,
    title: "Projectile Motion",
    description: "Study the path of objects under gravity",
    category: "mechanics",
    is_featured: false,
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
    is_featured: false,
  }

  /* Add more simulations as needed */

];

export const topicCategories = [
  {
    id: "mechanics",
    title: "Classical Mechanics",
    page: "Classical",
    description: "Motion, forces, energy, and momentum",
    icon: "Gear",
    color: "from-blue-500 to-cyan-500",
  },
  
  { 
    id: "fluids",
    title: "Fluid Dynamics",
    page: "Fluids",
    description: "Oscillations, interference, and wave propagation",
    icon: "Droplet",
    color: "from-blue-600 to-white-500",
  }, 

  {
    id: "waves",
    title: "Wave Physics",
    page: "Waves",
    description: "Oscillations, interference, and wave propagation",
    icon: "Radio",
    color: "from-purple-600 to-pink-500",
  },
  {
    id: "optics",
    title: "Optics & Light",
    page: "Optics",
    description: "Reflection, refraction, and optical phenomena",
    icon: "Eye",
    color: "from-amber-400 to-orange-500",
  },
  {
    id: "electricity",
    title: "Electricity & Magnetism",
    page: "Electricity",
    description: "Electric fields, circuits, and electromagnetic effects",
    icon: "Zap",
    color: "from-green-500 to-emerald-500",
  },
];
