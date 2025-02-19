import { useEffect } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import Header from "@/components/header";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Badge } from "@/components/ui/badge";
import { AudioLines, Music } from "lucide-react";
import MusicPlayer from "@/components/music-player";
import { useAudioContext } from "@/context/audio-context";

const genres = ["Rock", "Pop", "Country", "Jazz", "R&B"];

const animationVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0 },
};

const AudioPage = () => {
  const navigate = useNavigate();
  const {
    currentAudioUrl,
    isOriginalAudio,
    setIsOriginalAudio,
    setCurrentAudioUrl,
    originalAudioUrl,
    processedAudioUrl,
  } = useAudioContext();

  useEffect(() => {
    if (!currentAudioUrl) {
      toast.warning("Please upload an audio file first", {
        duration: 5000,
      });
      navigate("/");
    }
  }, [currentAudioUrl, navigate]);
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
      variants={animationVariants}
      className="h-[80vh] bg-[#131B25] overflow-hidden rounded-lg text-white relative antialiased flex flex-col items-center justify-evenly"
    >
      <Header />

      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 1, ease: "easeOut" }}
        variants={animationVariants}
        className="flex flex-wrap gap-2 max-w-[200px] justify-center"
      >
        {genres.map((genre) => (
          <Badge
            className="bg-white text-black rounded-full py-1 px-2"
            key={genre}
          >
            {genre}
          </Badge>
        ))}
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 1.2, ease: "easeOut" }}
        variants={animationVariants}
        className="flex flex-col items-center gap-2"
      >
        <Music className="size-20" />
        <h2 className="text-2xl">Radio Master</h2>
        <p className="text-sm text-muted-foreground max-w-[400px] text-center">
          A clean and crisp radio mix, polished, balanced, and optimized for
          playback across a variety of devices.
        </p>
        <div className="flex gap-2">
          <div className="flex gap-2 bg-black/50 rounded-full p-2 items-center z-10 cursor-pointer">
            <span
              onClick={() => {
                setCurrentAudioUrl(originalAudioUrl);
                setIsOriginalAudio(true);
              }}
              className={`rounded-full px-2 py-1 ${
                isOriginalAudio
                  ? "bg-white text-black"
                  : "bg-black text-muted-foreground"
              }`}
            >
              Original
            </span>
            <span
              onClick={() => {
                setCurrentAudioUrl(processedAudioUrl);
                setIsOriginalAudio(false);
              }}
              className={`rounded-full px-2 py-1 ${
                !isOriginalAudio
                  ? "bg-white text-black"
                  : "bg-black text-muted-foreground"
              }`}
            >
              Mastered
            </span>
          </div>
          <Link
            to="/enhance"
            className="flex justify-center items-center bg-black/50 rounded-full p-2 z-10"
          >
            <AudioLines className="size-7" />
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 1.4, ease: "easeOut" }}
        variants={animationVariants}
        className="w-full z-[999999]"
      >
        <MusicPlayer key={"audio"} />
      </motion.div>

      <BackgroundBeams />
    </motion.div>
  );
};

export default AudioPage;
