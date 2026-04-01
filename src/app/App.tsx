import { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { Header } from "./components/Header";
import { InputSection } from "./components/InputSection";
import { ProgressTracker } from "./components/ProgressTracker";
import { AgentOutput, AgentMessage, AgentType } from "./components/AgentOutput";
import { LoadingScreen } from "./components/LoadingScreen";
import { SettingsDialog } from "./components/SettingsDialog";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";

interface Stage {
  name: string;
  agent: string;
  completed: boolean;
  active: boolean;
}

const AGENT_RESPONSES: Record<
  AgentType,
  (topic: string) => string
> = {
  researcher: (topic) =>
    `I've conducted comprehensive research on "${topic}". Based on current industry standards and best practices, I've identified the following key considerations:\n\n• Current market trends and industry benchmarks\n• Regulatory requirements and compliance standards\n• Case studies from leading organizations\n• Statistical data supporting policy implementation\n• Potential challenges and mitigation strategies\n\nThese findings will form the foundation for our policy framework.`,
  legal: (topic) =>
    `Legal review completed for "${topic}". I've analyzed the following legal aspects:\n\n• Compliance with federal and state regulations\n• Employment law considerations and worker rights\n• Data protection and privacy requirements\n• Liability and risk management implications\n• Contract and agreement clauses\n• Anti-discrimination and equal opportunity compliance\n\nAll recommendations align with current legal frameworks and minimize organizational risk.`,
  ethics: (topic) =>
    `Ethical assessment completed for "${topic}". My evaluation covers:\n\n• Impact on stakeholder wellbeing and work-life balance\n• Fairness and equity considerations across all employee groups\n• Transparency and accountability measures\n• Privacy and dignity preservation\n• Environmental and social responsibility aspects\n• Long-term sustainability and organizational values alignment\n\nThe policy promotes ethical practices while respecting individual rights and organizational integrity.`,
  writer: (topic) =>
    `Policy draft completed for "${topic}". I've structured a comprehensive policy document including:\n\n• Executive Summary and Purpose Statement\n• Scope and Applicability sections\n• Clear definitions and terminology\n• Detailed policy guidelines and procedures\n• Implementation timeline and responsibilities\n• Monitoring and evaluation criteria\n• References and supporting documentation\n\nThe document is written in clear, accessible language suitable for all stakeholders.`,
  supervisor: (topic) =>
    `Final review completed for "${topic}". I've synthesized all agent inputs and provide this assessment:\n\n• Research findings are thorough and well-documented\n• Legal compliance is comprehensive and up-to-date\n• Ethical considerations are thoughtfully addressed\n• Policy writing is clear, professional, and actionable\n\nRecommendation: This policy is ready for implementation. It balances organizational needs with legal requirements and ethical standards. Suggested next steps include stakeholder review, pilot testing, and phased rollout with regular evaluation checkpoints.`,
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [progress, setProgress] = useState(0);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initial loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 seconds loading

    return () => clearTimeout(timer);
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTopic(transcript);
        toast.success("Voice input captured");
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        toast.error("Voice input failed. Please try again.");
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast.info("Listening... Speak now");
    }
  };

  const handleSpeak = (text: string, messageIndex: number) => {
    if (!("speechSynthesis" in window)) {
      toast.error("Text-to-speech not supported in this browser");
      return;
    }

    if (speakingIndex === messageIndex) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = voiceSpeed;
    utterance.pitch = voicePitch;
    utterance.volume = 1.0;

    utterance.onend = () => {
      setSpeakingIndex(null);
    };

    utterance.onerror = () => {
      setSpeakingIndex(null);
      toast.error("Text-to-speech failed");
    };

    speechSynthesisRef.current = utterance;
    setSpeakingIndex(messageIndex);
    window.speechSynthesis.speak(utterance);
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setMessages([]);
    setProgress(0);

    const agentSequence: Array<{
      type: AgentType;
      name: string;
      delay: number;
    }> = [
      { type: "researcher", name: "Research", delay: 2000 },
      { type: "legal", name: "Legal Review", delay: 2000 },
      { type: "ethics", name: "Ethics Review", delay: 2000 },
      { type: "writer", name: "Policy Writing", delay: 2000 },
      { type: "supervisor", name: "Supervision", delay: 2000 },
    ];

    const initialStages = agentSequence.map((agent, index) => ({
      name: agent.name,
      agent: agent.type.charAt(0).toUpperCase() + agent.type.slice(1),
      completed: false,
      active: index === 0,
    }));

    setStages(initialStages);
    toast.success("Policy generation started");

    for (let i = 0; i < agentSequence.length; i++) {
      const agent = agentSequence[i];

      // Update stages
      setStages((prev) =>
        prev.map((stage, index) => ({
          ...stage,
          active: index === i,
          completed: index < i,
        }))
      );

      // Update progress
      const progressValue = ((i + 1) / agentSequence.length) * 100;
      setProgress(progressValue);

      // Add agent message
      await new Promise((resolve) => setTimeout(resolve, agent.delay));
      
      const newMessage: AgentMessage = {
        agent: agent.type,
        content: AGENT_RESPONSES[agent.type](topic),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
    }

    // Mark all stages as completed
    setStages((prev) =>
      prev.map((stage) => ({
        ...stage,
        active: false,
        completed: true,
      }))
    );

    setIsGenerating(false);
    toast.success("Policy generation completed!");
  };

  const handleDownload = () => {
    if (messages.length === 0) return;

    const content = `POLICY DOCUMENT: ${topic}\n` +
      `Generated on: ${new Date().toLocaleString()}\n` +
      `${"=".repeat(80)}\n\n` +
      messages
        .map(
          (msg) =>
            `${msg.agent.toUpperCase()}\n${"-".repeat(40)}\n${
              msg.content
            }\n\n`
        )
        .join("");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `policy-${topic.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Policy document downloaded");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        voiceSpeed={voiceSpeed}
        onVoiceSpeedChange={setVoiceSpeed}
        voicePitch={voicePitch}
        onVoicePitchChange={setVoicePitch}
      />

      <Toaster position="top-right" theme="dark" />
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          <InputSection
            topic={topic}
            setTopic={setTopic}
            onGenerate={handleGenerate}
            onDownload={handleDownload}
            isGenerating={isGenerating}
            isListening={isListening}
            onToggleListening={toggleListening}
            hasResults={messages.length > 0}
          />

          {stages.length > 0 && (
            <ProgressTracker stages={stages} progress={progress} />
          )}

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <AgentOutput
              messages={messages}
              onSpeak={handleSpeak}
              speakingIndex={speakingIndex}
            />
          </div>
        </div>
      </main>
    </div>
  );
}