import { Button } from "@/components/ui/button";
import { Download, CloudUpload } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useAudioContext } from "@/context/audio-context";

export default function Navbar() {
  const { downloadAudio } = useAudioContext();
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      className="flex justify-between items-center py-4"
    >
      <Link to="/">
        <h2 className="text-2xl font-bold uppercase">Band Breeze</h2>
        <h4 className="text-sm font-semibold uppercase">Audio Enhancer</h4>
      </Link>
      <div className="flex gap-4">
        <Button variant="secondary">
          <Link to="/" className="flex items-center gap-2 group">
            <span>Upload Audio</span>
            <motion.div className="group-hover:-translate-y-1 transition-transform ease-[cubic-bezier(0.68, -0.55, 0.27, 1.55)]">
              <CloudUpload />
            </motion.div>
          </Link>
        </Button>
        <Button
          className="flex items-center gap-2 group"
          onClick={downloadAudio}
        >
          <span>Download Audio</span>
          <motion.div className="group-hover:translate-y-1 transition-transform ease-[cubic-bezier(0.68, -0.55, 0.27, 1.55)]">
            <Download />
          </motion.div>
        </Button>
      </div>
    </motion.nav>
  );
}
