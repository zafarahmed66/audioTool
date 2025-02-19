import { motion } from "motion/react"
import UploadTrack from "@/components/upload-track"

const HomePage = () => {
  return (
    <motion.main
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ 
      duration: 0.5,
      delay: 0.5,
      ease: "easeOut"
    }}
    >
        <UploadTrack />
    </motion.main>
  )
}

export default HomePage