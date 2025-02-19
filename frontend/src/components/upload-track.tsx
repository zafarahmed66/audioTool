import { motion } from "motion/react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { CloudUploadIcon } from "lucide-react";

import {
  Dropzone,
  DropZoneArea,
  DropzoneTrigger,
  useDropzone,
} from "@/components/ui/dropzone";
import Header from "./header";
import { useAudioContext } from "@/context/audio-context";
import { processSong } from "@/utils/process-song";
import { env } from "@/config/env";

const animationVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0 },
};

const UploadTrack = () => {
  const navigate = useNavigate();
  const {
    setOriginalAudioUrl,
    setProcessedAudioUrl,
    setCurrentAudioUrl,
    setIsOriginalAudio,
  } = useAudioContext();
  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      setOriginalAudioUrl(URL.createObjectURL(file));

      toast.promise(processSong(file), {
        loading: "Uploading...",
        success: (response) => {
          const masteredAudioUrl = `${env.pythonServerUrl}${response.data.processed_file}`;
          setProcessedAudioUrl(masteredAudioUrl);
          setCurrentAudioUrl(masteredAudioUrl);
          setIsOriginalAudio(false);
          navigate("/audio");
          return "Song processed successfully!";
        },
        error: "Failed to process song!",
      });
      return {
        status: "success",
        result: URL.createObjectURL(file),
      };
    },
    validation: {
      accept: {
        "audio/*": [".mp3", ".wav", ".aac", ".flac"],
      },
      maxSize: 10 * 1024 * 1024,
      maxFiles: 10,
    },
    onRootError(error) {
      if (error) {
        toast.error(error);
      }
    },
  });

  return (
    <div className="">
      <Dropzone {...dropzone}>
        <div>
          <DropZoneArea className="h-[80vh] border-2 border-dashed border-primary rounded-md flex flex-col justify-evenly items-center p-0">
            <Header />

            <motion.div
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 1, ease: "easeOut" }}
              variants={animationVariants}
              className="flex flex-col items-center gap-4 text-gray-400"
            >
              <CloudUploadIcon className="size-16" />

              <p className="text-sm max-w-[300px] text-center">
                Drag and drop your audio file here to add (MP3, WAV, AAC, FLAC)
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 1.2, ease: "easeOut" }}
              variants={animationVariants}
              className="flex w-full justify-center"
            >
              <DropzoneTrigger className="w-1/4 text-center border border-primary rounded-md p-2 bg-transparent hover:bg-primary hover:text-white transition-all duration-300">
                <p className="text-primary hover:text-white transition-all duration-300">
                  Choose file
                </p>
              </DropzoneTrigger>
            </motion.div>
          </DropZoneArea>
        </div>
      </Dropzone>
    </div>
  );
};

export default UploadTrack;
