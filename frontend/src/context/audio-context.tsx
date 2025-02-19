import { createContext, useContext, useState } from "react";
import { toast } from "sonner";
interface AudioContextType {
  originalAudioUrl: string;
  setOriginalAudioUrl: (url: string) => void;
  processedAudioUrl: string;
  setProcessedAudioUrl: (url: string) => void;
  currentAudioUrl: string;
  setCurrentAudioUrl: (url: string) => void;
  isPlaying: boolean;
  togglePlayPause: () => void;
  isOriginalAudio: boolean;
  setIsOriginalAudio: (isOriginal: boolean) => void;
  isEQEnabled: boolean;
  setIsEQEnabled: (isEQEnabled: boolean) => void;
  downloadAudio: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [originalAudioUrl, setOriginalAudioUrl] = useState<string>("");
  const [processedAudioUrl, setProcessedAudioUrl] = useState<string>("");
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isOriginalAudio, setIsOriginalAudio] = useState<boolean>(true);
  const [isEQEnabled, setIsEQEnabled] = useState<boolean>(true);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const downloadAudio = async () => {
    if (!currentAudioUrl) {
      toast.error("No audio available to download.");
      return;
    }

    try {
      const response = await fetch(currentAudioUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", "enhanced-audio.wav");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      toast.error("Failed to download audio.");
      console.error("Download error:", error);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        originalAudioUrl,
        setOriginalAudioUrl,
        processedAudioUrl,
        setProcessedAudioUrl,
        currentAudioUrl,
        setCurrentAudioUrl,
        isPlaying,
        togglePlayPause,
        isOriginalAudio,
        setIsOriginalAudio,
        isEQEnabled,
        setIsEQEnabled,
        downloadAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error(
      "useAudioContext must be used within a AudioContextProvider"
    );
  }
  return context;
};

export default AudioContext;
