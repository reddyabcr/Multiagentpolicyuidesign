import { X, Volume2, Palette, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  voiceSpeed: number;
  onVoiceSpeedChange: (speed: number) => void;
  voicePitch: number;
  onVoicePitchChange: (pitch: number) => void;
}

export function SettingsDialog({
  isOpen,
  onClose,
  voiceSpeed,
  onVoiceSpeedChange,
  voicePitch,
  onVoicePitchChange,
}: SettingsDialogProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <Zap className="h-6 w-6 text-blue-400" />
                Settings
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Voice Settings Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Volume2 className="h-5 w-5 text-blue-400" />
                  <h3 className="font-semibold">Voice Settings</h3>
                </div>

                {/* Voice Speed */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-zinc-400">Speech Speed</label>
                    <span className="text-sm font-medium text-white">
                      {voiceSpeed.toFixed(1)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voiceSpeed}
                    onChange={(e) => onVoiceSpeedChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>Slow (0.5x)</span>
                    <span>Normal (1.0x)</span>
                    <span>Fast (2.0x)</span>
                  </div>
                </div>

                {/* Voice Pitch */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-zinc-400">Speech Pitch</label>
                    <span className="text-sm font-medium text-white">
                      {voicePitch.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voicePitch}
                    onChange={(e) => onVoicePitchChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>Low (0.5)</span>
                    <span>Normal (1.0)</span>
                    <span>High (2.0)</span>
                  </div>
                </div>
              </div>

              {/* Theme Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Palette className="h-5 w-5 text-purple-400" />
                  <h3 className="font-semibold">Appearance</h3>
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Dark Theme</p>
                      <p className="text-xs text-zinc-500">Currently active</p>
                    </div>
                    <div className="h-8 w-8 rounded bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-700" />
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <h3 className="text-sm font-semibold text-white mb-2">About</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Multi-Agent Policy Generator uses AI-powered agents to collaboratively
                  create comprehensive policy documents. Features include voice input/output,
                  real-time progress tracking, and intelligent agent coordination.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
