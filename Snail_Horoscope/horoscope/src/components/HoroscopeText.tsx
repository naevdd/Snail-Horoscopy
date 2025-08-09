import { motion } from 'framer-motion';

interface HoroscopeTextProps {
  text: string;
}

export default function HoroscopeText({ text }: HoroscopeTextProps) {
  if (!text) return null;
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 1 }}
      className="mt- right-85 w-96 px-10 absolute max-w-xl text-center font-pixelify text-lg p-4 rounded-lg"
    >
      {text}
    </motion.div>
  );
}
