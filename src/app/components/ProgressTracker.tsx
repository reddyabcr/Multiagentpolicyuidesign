import { Progress } from "./ui/progress";
import { motion } from "motion/react";

interface ProgressTrackerProps {
  stages: Array<{
    name: string;
    agent: string;
    completed: boolean;
    active: boolean;
  }>;
  progress: number;
}

export function ProgressTracker({ stages, progress }: ProgressTrackerProps) {
  if (stages.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Processing Progress</span>
          <span className="text-white font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.agent}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-3 rounded-lg border transition-all ${
              stage.completed
                ? "bg-green-500/10 border-green-500/50"
                : stage.active
                ? "bg-blue-500/10 border-blue-500/50 animate-pulse"
                : "bg-zinc-800/50 border-zinc-800"
            }`}
          >
            <div className="text-xs text-zinc-400 mb-1">{stage.name}</div>
            <div
              className={`text-sm font-medium ${
                stage.completed
                  ? "text-green-400"
                  : stage.active
                  ? "text-blue-400"
                  : "text-zinc-500"
              }`}
            >
              {stage.agent}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
