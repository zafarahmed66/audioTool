import { useWavesurfer } from "@wavesurfer/react";
import { Pause, Play, Volume2 } from "lucide-react";
import { useRef, useState, useEffect, MutableRefObject } from "react";
import { Slider } from "./ui/slider";
import { useAudioContext } from "@/context/audio-context";

interface MusicPlayerProps {
  audioElementRef?: MutableRefObject<HTMLAudioElement | null>;
}

export default function MusicPlayer({ audioElementRef }: MusicPlayerProps) {
  const wavesurferRef = useRef<HTMLDivElement | null>(null);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  const { currentAudioUrl, togglePlayPause, isPlaying, isEQEnabled } =
    useAudioContext();

  const { wavesurfer } = useWavesurfer({
    container: wavesurferRef,
    url: currentAudioUrl,
    waveColor: "#E5E7EB",
    progressColor: "#3EBCB5",
    height: 100,
  });

  useEffect(() => {
    if (!wavesurfer) return;

    if (isPlaying) {
      wavesurfer.play();
    } else {
      wavesurfer.pause();
    }

    const handleTimeUpdate = () => {
      const current = wavesurfer.getCurrentTime();
      const total = wavesurfer.getDuration();
      setCurrentTime(formatTime(current));
      setDuration(formatTime(total));
    };

    wavesurfer.on("timeupdate", handleTimeUpdate);
    wavesurfer.on("ready", handleTimeUpdate);

    return () => {
      wavesurfer.un("timeupdate", handleTimeUpdate);
      wavesurfer.un("ready", handleTimeUpdate);
    };
  }, [wavesurfer, isPlaying]);

  useEffect(() => {
    if (wavesurfer) {
      const current = wavesurfer.getCurrentTime();
      if (audioElementRef && audioElementRef.current) {
        audioElementRef.current.currentTime = current;
      }
      console.log("wavesurfer", current);
      console.log("player", audioElementRef?.current?.currentTime);
    }
  }, [isEQEnabled, audioElementRef, wavesurfer]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const onPlayPause = () => {
    if (wavesurfer) {
      const current = wavesurfer.getCurrentTime();
      if (audioElementRef && audioElementRef.current) {
        audioElementRef.current.currentTime = current;
      }
      console.log("wavesurfer", current);
      console.log("player", audioElementRef?.current?.currentTime);
    }

    togglePlayPause();
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (wavesurfer) {
      wavesurfer.setVolume(newVolume);
    }
  };

  return (
    <div className="flex w-[90%] mx-auto rounded-lg p-4 justify-between items-center">
      <div className="flex flex-col gap-2">
        <span className="text-white text-lg">My Music Info</span>
        <span className="text-gray-400 text-sm">
          {currentTime}/{duration}
        </span>
      </div>
      <div className="flex items-center gap-4 w-[60%]">
        <button
          onClick={onPlayPause}
          className="bg-white rounded-full p-2 size-10"
        >
          {isPlaying ? (
            <Pause className="text-black" />
          ) : (
            <Play className="text-black" />
          )}
        </button>
        <div className="w-full" ref={wavesurferRef}></div>
      </div>

      <div className="flex items-center gap-2">
        <Volume2 className="text-white size-8" />
        <Slider
          value={[volume]}
          onValueChange={handleVolumeChange}
          min={0}
          max={1}
          step={0.1}
          className="w-20 "
        />
      </div>
    </div>
  );
}
