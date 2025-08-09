import { motion } from 'framer-motion';

export default function HoroscopeText({ text }) {
  if (!text) return null;
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 1 }}
      className="mt-6 max-w-xl text-center text-lg bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20"
    >
      {text}
    </motion.div>
  );
}
