import { useState } from 'react';
import { motion } from 'framer-motion';
import HoroscopeText from './components/HoroscopeText';
import GenerateButton from './components/GenerateButton';

export default function App() {
  const [horoscope, setHoroscope] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = speechSynthesis.getVoices().find(v => v.name.toLowerCase().includes("english")) || null;
    utter.pitch = 0.6;
    utter.rate = 0.9;
    speechSynthesis.speak(utter);
  };

  const generateHoroscope = async () => {
    if (!selectedImage) {
      alert("Please upload a snail image first!");
      return;
    }
    setLoading(true);
    setHoroscope('');

    const formData = new FormData();
    formData.append("image", selectedImage);

    const res = await fetch('http://127.0.0.1:5000/api/horoscope', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      alert("Failed to generate horoscope.");
      setLoading(false);
      return;
    }

    const data = await res.json();
    console.log(data);
    setHoroscope(data.horoscope);
    speak(data.horoscope);
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-screen bg-background flex flex-col items-center justify-center text-white">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl font-bold mb-10 -mt-20"
      >
        🐌 Snail Horoscope Oracle
      </motion.h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setSelectedImage(e.target.files[0])}
        className="mb-4 w-60 bg-white text-black rounded p-2"
      />

      <img
        src="/snailanim.gif"
        alt="Mystical Snail"
        className="mr-[500px] mb-6"
        width={600}
      />

      <GenerateButton onClick={generateHoroscope} loading={loading} />

      <HoroscopeText text={horoscope} />
    </div>
  );
}
