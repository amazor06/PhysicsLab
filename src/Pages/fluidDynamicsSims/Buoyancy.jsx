import { motion } from "framer-motion";
import { Hourglass } from "lucide-react";

export default function PlinkoGame() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center border border-slate-700/50 bg-slate-900/70 backdrop-blur-md rounded-2xl shadow-lg p-10 max-w-lg"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="flex justify-center mb-6"
        >
          <Hourglass className="w-14 h-14 text-blue-400 drop-shadow-[0_0_8px_#60a5fa]" />
        </motion.div>

        <h1 className="text-3xl font-semibold text-white mb-2">
          Buoyancy Simulator
        </h1>
        <p className="text-slate-400 mb-6">
          This interactive simulation is currently in development.
          <br />
          Check back soon to explore how different objects interact in fluids!
        </p>

        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-sm text-blue-400/80"
        >
          Coming Soon...
        </motion.div>
      </motion.div>
    </div>
  );
}
