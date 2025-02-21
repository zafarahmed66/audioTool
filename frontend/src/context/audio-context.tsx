import { bufferToWav } from "@/lib/utils";
import {
  createContext,
  MutableRefObject,
  useContext,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { WEQ8Runtime } from "weq8";
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
  audioContextRef: MutableRefObject<AudioContext | null>;
  weq8Ref: MutableRefObject<WEQ8Runtime | null>;
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
  const [isEQEnabled, setIsEQEnabled] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const weq8Ref = useRef<WEQ8Runtime | null>(null);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const downloadAudio = async () => {
    if (!isEQEnabled) {
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
    } else {
      handleEQDownload();
    }
  };

  async function downloadProcessedAudio() {
    if (!audioContextRef.current || !weq8Ref.current) {
      toast.error("Audio is not processed yet!");
      return;
    }

    try {
      const response = await fetch(currentAudioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(
        arrayBuffer
      );

      const offlineContext = new OfflineAudioContext({
        numberOfChannels: audioBuffer.numberOfChannels,
        length: audioBuffer.length,
        sampleRate: audioBuffer.sampleRate,
      });

      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;

      const offlineWEQ8 = new WEQ8Runtime(offlineContext);

      source.connect(offlineWEQ8.input);
      offlineWEQ8.connect(offlineContext.destination);

      source.start();

      const renderedBuffer = await offlineContext.startRendering();

      const wavBlob = bufferToWav(renderedBuffer);
      const url = URL.createObjectURL(wavBlob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "processed-audio.wav";
      a.textContent = "Download Processed Audio";
      document.body.appendChild(a);
      a.click();

      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return url;
    } catch (error) {
      console.error("Error downloading processed audio:", error);
      toast.error("Failed to process audio!");
    }
  }

  const handleEQDownload = () => {
    toast.promise(downloadProcessedAudio, {
      loading: "Downloading...",
      success: () => {
        return "Song processed successfully!";
      },
      error: "Failed to process song!",
    });
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
        audioContextRef,
        weq8Ref,
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
