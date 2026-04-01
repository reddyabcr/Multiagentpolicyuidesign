import { motion } from "motion/react";
import {
  Search,
  Scale,
  Heart,
  PenTool,
  UserCheck,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "./ui/button";

export type AgentType = "researcher" | "legal" | "ethics" | "writer" | "supervisor";

export interface AgentMessage {
  agent: AgentType;
  content: string;
  timestamp: Date;
}

interface AgentOutputProps {
  messages: AgentMessage[];
  onSpeak: (text: string, messageIndex: number) => void;
  speakingIndex: number | null;
}

const agentConfig: Record<
  AgentType,
  { name: string; icon: any; color: string; bgColor: string }
> = {
  researcher: {
    name: "Researcher",
    icon: Search,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  legal: {
    name: "Legal Advisor",
    icon: Scale,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  ethics: {
    name: "Ethics Reviewer",
    icon: Heart,
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
  },
  writer: {
    name: "Policy Writer",
    icon: PenTool,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  supervisor: {
    name: "Supervisor",
    icon: UserCheck,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
};

export function AgentOutput({ messages, onSpeak, speakingIndex }: AgentOutputProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-20 w-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4"
        >
          <Search className="h-10 w-10 text-zinc-600" />
        </motion.div>
        <motion.h3
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-semibold text-white mb-2"
        >
          Ready to Generate
        </motion.h3>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-zinc-400 max-w-md"
        >
          Enter a policy topic above and click generate to start the multi-agent
          policy creation process.
        </motion.p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message, index) => {
        const config = agentConfig[message.agent];
        const Icon = config.icon;
        const isSpeaking = speakingIndex === index;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex gap-4 p-4 rounded-lg border border-zinc-800 ${config.bgColor}`}
          >
            <div className={`flex-shrink-0 h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center ${config.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${config.color}`}>
                    {config.name}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSpeak(message.content, index)}
                  className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
                >
                  {isSpeaking ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}