import { Bot, Settings } from "lucide-react";

interface HeaderProps {
  onSettingsClick: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-white">
                Multi-Agent Policy Generator
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400">
                AI-powered collaborative policy creation
              </p>
            </div>
          </div>
          <button
            onClick={onSettingsClick}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}