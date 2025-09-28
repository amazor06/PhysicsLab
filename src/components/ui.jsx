import { motion } from "framer-motion";

const iconClassName = (className) => className || "";

export const Icons = ({ name, className = "" }) => {
  const svgs = {
    Cog: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClassName(className)}>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 .33 1.82zM4.6 15a1.65 1.65 0 0 1-1.82.33l-.06.06a2 2 0 0 0 0 2.83l.06.06a1.65 1.65 0 0 1 .33 1.82l-.06.06a2 2 0 0 0 0 2.83l.06.06a1.65 1.65 0 0 0 1.82.33l.06-.06a2 2 0 0 0 2.83 0l.06.06a1.65 1.65 0 0 0 .33-1.82l-.06-.06a2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 1 1.82-.33l.06.06a2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 .33 1.82z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    Radio: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClassName(className)}>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    Eye: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClassName(className)}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    Zap: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClassName(className)}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    Star: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClassName(className)}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    Play: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClassName(className)}>
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    TrendingUp: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClassName(className)}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    Sparkles: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={iconClassName(className)}>
        <path d="M12.5 1.5l-2 4L8 7l-4 2.5l4 2.5l2 4l2.5-4l4-2.5l-4-2.5zM19 13l-1.5 3l-1.5-3l1.5-3zM5.5 17.5l-1.5 3l-1.5-3l1.5-3z" />
      </svg>
    ),
    ArrowRight: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClassName(className)}>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    ),
  };

  return svgs[name] || null;
};

export const Card = ({ children, className = "", onClick }) => {
  const combinedClasses = [
    "card bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-md transition-all duration-300",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      className={combinedClasses}
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
};

export const Badge = ({ children, variant = "default" }) => {
  const baseClasses = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";
  const variants = {
    default: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    outline: "bg-white/10 text-white/70 border border-white/20",
  };
  const combinedClasses = [baseClasses, variants[variant] || variants.default]
    .filter(Boolean)
    .join(" ");

  return <span className={combinedClasses}>{children}</span>;
};

export const Button = ({ children, variant = "default", size = "default", onClick, className = "" }) => {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-300 cursor-pointer rounded-xl";
  const variants = {
    default: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700",
    outline: "bg-transparent border border-blue-400/30 text-blue-200 hover:bg-blue-600/20 hover:border-blue-500/50",
  };
  const sizes = {
    default: "px-4 py-2 text-sm",
    lg: "px-8 py-4 text-base",
  };
  const combinedClasses = [baseStyle, variants[variant] || variants.default, sizes[size] || sizes.default, className]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.button
      className={combinedClasses}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};
