/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AudioLines, Music } from "lucide-react";
import { motion } from "framer-motion";
import { WEQ8Runtime } from "weq8";
import { toast } from "sonner";
import "weq8/ui";

import { useAudioContext } from "@/context/audio-context";
import MusicPlayer from "@/components/music-player";
import { BackgroundBeams } from "@/components/ui/background-beams";

const animationVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0 },
};

const EnhancePage = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const weq8Ref = useRef<WEQ8Runtime | null>(null);
  const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const weq8UIRef = useRef<HTMLElement | null>(null);

  const navigate = useNavigate();
  const { currentAudioUrl, isPlaying, isEQEnabled, setIsEQEnabled } =
    useAudioContext();

  useEffect(() => {
    if (!currentAudioUrl) {
      toast.warning("Please upload an audio file first");
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (!currentAudioUrl) {
      toast.warning("Please upload an audio file first");
      navigate("/");
      return;
    }

    const initializeAudio = async () => {
      try {
        if (!window.AudioContext) return;

        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext();
        }

        if (!weq8Ref.current) {
          weq8Ref.current = new WEQ8Runtime(audioContextRef.current);
        }

        if (!audioElementRef.current) {
          audioElementRef.current = new Audio(currentAudioUrl);
          audioElementRef.current.crossOrigin = "anonymous";
          audioElementRef.current.loop = true;
        }

        if (!audioSourceRef.current) {
          audioSourceRef.current =
            audioContextRef.current.createMediaElementSource(
              audioElementRef.current
            );
        }

        if (audioSourceRef.current && weq8Ref.current) {
          audioSourceRef.current.connect(weq8Ref.current.input);
          weq8Ref.current.connect(audioContextRef.current.destination);
        }

        if (weq8UIRef.current) {
          // @ts-ignore
          weq8UIRef.current.runtime = weq8Ref.current;
        }

        if (isPlaying) {
          await audioElementRef.current.play();
        } else {
          audioElementRef.current.pause();
        }
      } catch (error) {
        console.error("Error initializing audio:", error);
      }
    };

    initializeAudio();
  }, [currentAudioUrl, navigate, isPlaying]);

  const handleEnableEQ = async () => {
    if (audioContextRef.current && audioElementRef.current) {
      audioElementRef.current.currentTime = audioContextRef.current.currentTime;
    }
    await audioContextRef.current?.resume();
    audioElementRef.current?.play();
    setIsEQEnabled(true);
  };

  const handleDisableEQ = async () => {
    await audioContextRef.current?.suspend();
    audioElementRef.current?.pause();
    setIsEQEnabled(false);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
      variants={animationVariants}
      className="h-[80vh] bg-[#131B25] overflow-hidden rounded-lg text-white relative antialiased flex flex-col items-center justify-evenly"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 1, ease: "easeOut" }}
        variants={animationVariants}
        className="flex flex-col items-center gap-2"
      >
        <AudioLines className="size-20" />
        <h2 className="text-2xl">EQ Settings</h2>
        <p className="text-sm text-muted-foreground max-w-[400px] text-center">
          Adjust frequencies to shape audio. Enhance clarity, balance tones,
          achieve perfect sound.
        </p>
        <div className="flex gap-2">
          <div className="flex gap-2 bg-black/50 rounded-full p-2 items-center z-10 cursor-pointer">
            <span
              onClick={handleEnableEQ}
              className={`rounded-full px-2 py-1 ${
                isEQEnabled
                  ? "bg-white text-black"
                  : "bg-black text-muted-foreground"
              }`}
            >
              Enable EQ
            </span>
            <span
              onClick={handleDisableEQ}
              className={`rounded-full px-2 py-1 ${
                !isEQEnabled
                  ? "bg-white text-black"
                  : "bg-black text-muted-foreground"
              }`}
            >
              Disable EQ
            </span>
          </div>
          <Link
            to={"/audio"}
            className="flex justify-center items-center bg-black/50 rounded-full p-2 z-10"
          >
            <Music className="size-7" />
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 1.2, ease: "easeOut" }}
        variants={animationVariants}
        className="w-[90%] z-[999999]"
      >
        {/* @ts-ignore */}
        <weq8-ui ref={weq8UIRef} style={{ backgroundColor: "transparent" }} />
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 1.4, ease: "easeOut" }}
        variants={animationVariants}
        className="w-full z-[999999]"
      >
        <MusicPlayer key={"enhance"} />
      </motion.div>

      <BackgroundBeams />
    </motion.div>
  );
};

export default EnhancePage;
