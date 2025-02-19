import { motion } from "motion/react"
const Header = () => {
  return (
    <motion.div
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
    className="max-w-[400px] space-y-2">
    <h2 className="text-3xl font-semibold text-primary text-center">  Simplify Your Audio with One Reference Track</h2>
    <p className="text-sm text-muted-foreground text-center">Enhance Speech turns your recordings into professional studio-quality audio with just one reference track.</p>
      </motion.div>
  )
}

export default Header