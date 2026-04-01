import { Mic, MicOff, Sparkles, Download, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface InputSectionProps {
  topic: string;
  setTopic: (topic: string) => void;
  onGenerate: () => void;
  onDownload: () => void;
  isGenerating: boolean;
  isListening: boolean;
  onToggleListening: () => void;
  hasResults: boolean;
}

export function InputSection({
  topic,
  setTopic,
  onGenerate,
  onDownload,
  isGenerating,
  isListening,
  onToggleListening,
  hasResults,
}: InputSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Enter policy topic (e.g., Remote Work Policy, Data Privacy Guidelines...)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isGenerating && topic && onGenerate()}
            className="h-12 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 pr-12"
            disabled={isGenerating}
          />
          {isListening && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="flex gap-1 items-center">
                <span className="h-2 w-1 bg-red-500 rounded-full animate-pulse" />
                <span className="h-3 w-1 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                <span className="h-2 w-1 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          )}
        </div>
        <Button
          onClick={onToggleListening}
          variant="outline"
          size="lg"
          className={`h-12 w-12 border-zinc-800 ${
            isListening
              ? "bg-red-500 hover:bg-red-600 border-red-500 text-white"
              : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
          }`}
          disabled={isGenerating}
        >
          {isListening ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={onGenerate}
          disabled={!topic || isGenerating}
          className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Generate Policy
            </>
          )}
        </Button>
        <Button
          onClick={onDownload}
          disabled={!hasResults || isGenerating}
          variant="outline"
          size="lg"
          className="h-12 w-12 border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-50"
        >
          <Download className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
