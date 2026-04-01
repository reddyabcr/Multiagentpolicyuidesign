import { motion } from "motion/react";
import { Bot, Loader2 } from "lucide-react";

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Animated background glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 blur-2xl"
        />

        {/* Logo container */}
        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl">
          <Bot className="h-12 w-12 text-white" />
        </div>
      </motion.div>

      {/* Loading spinner and text */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-8 flex flex-col items-center gap-4"
      >
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-1">
            Multi-Agent Policy Generator
          </h2>
          <p className="text-sm text-zinc-400">
            Initializing AI agents...
          </p>
        </div>
      </motion.div>

      {/* Progress dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex gap-2"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
            className="h-2 w-2 rounded-full bg-blue-400"
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
