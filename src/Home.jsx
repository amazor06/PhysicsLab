import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Ensure Tailwind CSS is loaded via the CDN
const tailwindScript = document.createElement("script");
tailwindScript.src = "https://cdn.tailwindcss.com";
document.head.appendChild(tailwindScript);

// Replaced react-icons with inline SVG components to remove external dependencies
const Icons = ({ name, className = "" }) => {
  const svgs = {
    Cog: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 .33 1.82zM4.6 15a1.65 1.65 0 0 1-1.82.33l-.06.06a2 2 0 0 0 0 2.83l.06.06a1.65 1.65 0 0 1 .33 1.82l-.06.06a2 2 0 0 0 0 2.83l.06.06a1.65 1.65 0 0 0 1.82.33l.06-.06a2 2 0 0 0 2.83 0l.06.06a1.65 1.65 0 0 0 .33-1.82l-.06-.06a2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 1 1.82-.33l.06.06a2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 1 .33 1.82l-.06-.06a2 2 0 0 0 0 2.83l.06.06a1.65 1.65 0 0 0 1.82.33l.06-.06a2 2 0 0 0 2.83 0l.06.06a1.65 1.65 0 0 0 .33 1.82z" />
      </svg>
    ),
    Radio: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    Eye: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    Zap: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    Star: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    Play: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    TrendingUp: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    Sparkles: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
        <path d="M12.5 1.5l-2 4L8 7l-4 2.5l4 2.5l2 4l2.5-4l4-2.5l-4-2.5zM19 13l-1.5 3l-1.5-3l1.5-3zM5.5 17.5l-1.5 3l-1.5-3l1.5-3z" />
      </svg>
    ),
    ArrowRight: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    ),
  };
  return svgs[name] || null;
};

// Simple mock data - replace with your actual data source
const mockSimulations = [
  {
    id: 1,
    title: "Pendulum Motion",
    description: "Explore simple harmonic motion with an interactive pendulum",
    category: "mechanics",
    difficulty: "beginner",
    is_featured: true,
  },
  {
    id: 2,
    title: "Wave Interference",
    description: "Visualize constructive and destructive wave interference",
    category: "waves",
    difficulty: "intermediate",
    is_featured: true,
  },
  {
    id: 3,
    title: "Electric Field Lines",
    description: "See how electric fields behave around charged objects",
    category: "electricity",
    difficulty: "advanced",
    is_featured: true,
  },
  {
    id: 4,
    title: "Projectile Motion",
    description: "Study the path of objects under gravity",
    category: "mechanics",
    difficulty: "beginner",
    is_featured: false,
  },
];

// Rebuilt Card Component with Framer Motion and Tailwind CSS
const Card = ({ children, className = "", onClick }) => (
  <motion.div
    className={`card bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-md transition-all duration-300 ${className}`}
    onClick={onClick}
    whileHover={{
      borderColor: "rgb(59, 130, 246)",
      boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.1)",
      scale: 1.02,
    }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    {children}
  </motion.div>
);

// Rebuilt Badge Component with Tailwind CSS
const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    beginner: "bg-green-500/20 text-green-300 border border-green-500/30",
    intermediate: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
    advanced: "bg-red-500/20 text-red-300 border border-red-500/30",
    outline: "bg-white/10 text-white/70 border border-white/20",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variants[variant]}`}
    >
      {children}
    </span>
  );
};

// Rebuilt Button Component with Framer Motion and Tailwind CSS
const Button = ({ children, variant = "default", size = "default", onClick, className = "" }) => {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-300 cursor-pointer rounded-xl";
  const variants = {
    default: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700",
    outline: "bg-transparent border border-blue-400/30 text-blue-200 hover:bg-blue-600/20 hover:border-blue-500/50",
  };
  const sizes = {
    default: "px-4 py-2 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <motion.button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

const topicCategories = [
  {
    id: "mechanics",
    title: "Classical Mechanics",
    page: "Classical",
    description: "Motion, forces, energy, and momentum",
    icon: "Cog",
    color: "from-blue-500 to-cyan-500",
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

const BackgroundAnimation = () => (
  <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
    <div className="absolute h-96 w-96 rounded-full bg-blue-500/30 blur-3xl" style={{ top: '10%', left: '20%', animation: 'float1 15s ease-in-out infinite' }} />
    <div className="absolute h-96 w-96 rounded-full bg-purple-500/30 blur-3xl" style={{ bottom: '15%', right: '25%', animation: 'float2 18s ease-in-out infinite' }} />
    <div className="absolute h-96 w-96 rounded-full bg-cyan-500/30 blur-3xl" style={{ top: '50%', right: '10%', animation: 'float3 12s ease-in-out infinite' }} />
  </div>
);

// Keyframes for the background animation
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes float1 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-50px) rotate(10deg); }
}
@keyframes float2 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(60px) rotate(-15deg); }
}
@keyframes float3 {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  50% { transform: translateX(50px) rotate(20deg); }
}
`;
document.head.appendChild(styleSheet);


export default function App() {
  const [simulations, setSimulations] = useState([]);
  const [featuredSims, setFeaturedSims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSimulations();
  }, []);

  const loadSimulations = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setSimulations(mockSimulations);
        setFeaturedSims(mockSimulations.filter((sim) => sim.is_featured).slice(0, 3));
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error loading simulations:", error);
      setIsLoading(false);
    }
  };

  const getCategoryCount = (categoryId) => {
    return simulations.filter((sim) => sim.category === categoryId).length;
  };

  const handleNavigation = (page) => {
    // Replace with your navigation logic
    console.log(`Maps to: ${page}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white text-xl">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Loading simulations...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden font-[Inter]">
      <BackgroundAnimation />
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-20 px-6 text-center">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <Badge variant="outline">
                <Icons name="Sparkles" className="mr-2" /> Interactive Physics Simulations
              </Badge>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-6xl md:text-8xl font-bold mb-6 tracking-tight"
            >
              Physics
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                {" "}
                Lab
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10"
            >
              Explore the fundamental laws of nature through interactive simulations. Visualize
              complex physics concepts with real-time parameter control.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button size="lg" onClick={() => handleNavigation("simulations")}>
                <Icons name="Play" className="mr-2" /> Start Exploring
              </Button>
              <Button size="lg" variant="outline" onClick={() => handleNavigation("theory")}>
                View Theory Guide
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Featured Simulations */}
        {featuredSims.length > 0 && (
          <section className="py-16 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
                  <Icons name="Star" className="text-yellow-400" />
                  Featured Simulations
                </h2>
                <p className="text-slate-400 text-lg">
                  Popular physics concepts to get you started
                </p>
              </div>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } },
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {featuredSims.map((sim, index) => (
                  <motion.div
                    key={sim.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <Card onClick={() => handleNavigation(sim.category)}>
                      <div className="mb-4">
                        <Badge variant={sim.difficulty}>{sim.difficulty}</Badge>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">{sim.title}</h3>
                      <p className="text-slate-400 text-sm mb-4">{sim.description}</p>
                      <Button variant="outline" className="w-full">
                        Try Simulation <Icons name="ArrowRight" className="ml-2" />
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* Topic Categories */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
                <Icons name="TrendingUp" className="text-teal-400" />
                Physics Topics
              </h2>
              <p className="text-slate-400 text-lg">Choose your area of exploration</p>
            </div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.15 } },
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
            >
              {topicCategories.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Card onClick={() => handleNavigation(topic.page)}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-4 rounded-xl shadow-lg bg-gradient-to-br ${topic.color}`}>
                        <div className="text-white text-3xl">
                          <Icons name={topic.icon} />
                        </div>
                      </div>
                      <Badge variant="outline">{getCategoryCount(topic.id)} sims</Badge>
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-2">{topic.title}</h3>
                    <p className="text-slate-400 text-base mb-4">{topic.description}</p>
                    <div className="flex items-center text-blue-300 font-semibold">
                      <span>Explore simulations</span>
                      <Icons name="ArrowRight" className="ml-2 transition-transform duration-300" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-6 border-t border-slate-700/50">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.2 } },
              }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <div className="text-5xl md:text-6xl font-bold text-white mb-1">
                  {simulations.length}
                </div>
                <div className="text-slate-400">Simulations</div>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <div className="text-5xl md:text-6xl font-bold text-white mb-1">4</div>
                <div className="text-slate-400">Categories</div>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <div className="text-5xl md:text-6xl font-bold text-white mb-1">∞</div>
                <div className="text-slate-400">Possibilities</div>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <div className="text-5xl md:text-6xl font-bold text-white mb-1">100%</div>
                <div className="text-slate-400">Interactive</div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
