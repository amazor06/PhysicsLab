import { motion } from "framer-motion";
import { Badge, Button, Card, Icons } from "./components/ui.jsx";
import { topicCategories } from "./data/simulations.js";

const TAILWIND_SCRIPT_ID = "tailwind-cdn";
const STYLE_ID = "physicslab-bg-animations";

if (typeof document !== "undefined" && !document.getElementById(TAILWIND_SCRIPT_ID)) {
  const tailwindScript = document.createElement("script");
  tailwindScript.id = TAILWIND_SCRIPT_ID;
  tailwindScript.src = "https://cdn.tailwindcss.com";
  document.head.appendChild(tailwindScript);
}

if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const styleSheet = document.createElement("style");
  styleSheet.id = STYLE_ID;
  styleSheet.innerText = [
    "@keyframes float1 {",
    "  0%, 100% { transform: translateY(0) rotate(0deg); }",
    "  50% { transform: translateY(-50px) rotate(10deg); }",
    "}",
    "@keyframes float2 {",
    "  0%, 100% { transform: translateY(0) rotate(0deg); }",
    "  50% { transform: translateY(60px) rotate(-15deg); }",
    "}",
    "@keyframes float3 {",
    "  0%, 100% { transform: translateX(0) rotate(0deg); }",
    "  50% { transform: translateX(50px) rotate(20deg); }",
    "}",
    "html, body {",
    "  margin: 0;",
    "  padding: 0;",
    "  height: 100%;",
    "  overflow-x: hidden;",
    "  overflow-y: auto;",
    "}",
  ].join("\n");
  document.head.appendChild(styleSheet);
}

const BackgroundAnimation = () => (
  <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
    <div
      className="absolute h-96 w-96 rounded-full bg-blue-500/30 blur-3xl"
      style={{ top: "10%", left: "20%", animation: "float1 15s ease-in-out infinite" }}
    />
    <div
      className="absolute h-96 w-96 rounded-full bg-purple-500/30 blur-3xl"
      style={{ bottom: "15%", right: "25%", animation: "float2 18s ease-in-out infinite" }}
    />
    <div
      className="absolute h-96 w-96 rounded-full bg-cyan-500/30 blur-3xl"
      style={{ top: "50%", right: "10%", animation: "float3 12s ease-in-out infinite" }}
    />
  </div>
);

const getCategoryCount = (simulations, categoryId) =>
  simulations.filter((sim) => sim.category === categoryId).length;

export default function Home({ simulations = [], featuredSims = [], onNavigate }) {
  const handleNavigation = (page) => {
    if (typeof onNavigate === "function") {
      onNavigate(page);
    }
  };

  return (
    <div className="h-screen w-screen relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-auto font-[Inter]">
      <BackgroundAnimation />
      <div className="relative z-10 h-full">
        {/* Hero Section */}
        <section className="h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-6xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6"
            >
              <Badge variant="outline">
                <Icons name="Sparkles" className="mr-2" /> Interactive Physics Simulations
              </Badge>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-5xl md:text-8xl font-bold mb-6 tracking-tight"
            >
              Physics
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                {" "}Lab
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8"
            >
              Explore the fundamental laws of nature through interactive simulations.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {/* Scroll-to-section button */}
              <Button
                size="lg"
                onClick={() =>
                  document.getElementById("topics")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
              >
                <Icons name="Play" className="mr-2" /> Start Exploring
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Physics Topics Section */}
        <section
          id="topics"
          className="h-screen flex items-center justify-center px-4"
        >
          <div className="w-full max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
                Physics Topics
              </h2>
              <p className="text-slate-400 text-lg">Choose your area of exploration</p>
            </div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {topicCategories.map((topic) => {
                const tileClasses = [topic.color].filter(Boolean).join(" ");

                return (
                  <motion.div
                    key={topic.id}
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  >
                    <Card onClick={() => handleNavigation(topic.page)}>
                      <div className="flex items-start justify-between mb-4">
                        <div className={tileClasses}>
                          <div className="text-white text-3xl">
                            <Icons name={topic.icon} />
                          </div>
                        </div>
                        <Badge variant="outline">{getCategoryCount(simulations, topic.id)} sims</Badge>
                      </div>
                      <h3 className="text-2xl font-semibold text-white mb-2">{topic.title}</h3>
                      <p className="text-slate-400 text-base mb-4">{topic.description}</p>
                      <div className="flex items-center text-blue-300 font-semibold">
                        <span>Explore simulations</span>
                        <Icons name="ArrowRight" className="ml-2 transition-transform duration-300" />
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Featured Simulations */}
        {featuredSims.length > 0 && (
          <section className="h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-7xl">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
                  Featured Simulations
                </h2>
                <p className="text-slate-400 text-lg">Popular physics concepts to get you started</p>
              </div>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {featuredSims.map((sim) => (
                  <motion.div
                    key={sim.id}
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  >
                    <Card onClick={() => handleNavigation(sim.category)}>
                      <h3 className="text-xl font-semibold text-white mb-2">{sim.title}</h3>
                      <p className="text-slate-400 text-sm mb-4">{sim.description}</p>
                      <Button variant="outline" className="w-full">
                        Explore Simulation <Icons name="ArrowRight" className="ml-2" />
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* Stats Section */}
        <section className="h-screen flex items-center justify-center px-4 border-t border-slate-700/50">
          <div className="w-full max-w-5xl text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <div className="text-5xl md:text-6xl font-bold text-white mb-1">{simulations.length}</div>
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
