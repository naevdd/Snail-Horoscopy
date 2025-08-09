import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import HoroscopeText from './components/HoroscopeText';
import GenerateButton from './components/GenerateButton';

export default function App() {
  const [horoscope, setHoroscope] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const speak = (text: string) => {
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

    const res = await fetch('https://snail-horoscopy.onrender.com/api/horoscope', {
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-background flex flex-col items-center justify-center text-white">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl font-bold mb-10"
      >
        <img src='/snailfort.png' className='' width={350} alt="Snail Fort" />
      </motion.h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-60 z-50 bg-white text-black rounded mb-10 p-2"
      />

      <img
        src="/snailanim.gif"
        alt="Mystical Snail"
        className="mr-[600px] -mt-20 mb-10"
        width={700}
      />

      <GenerateButton onClick={generateHoroscope} loading={loading} />

      <img src='/leaf-export.png' className='absolute mt-35 right-[150px] z-0' width={700} alt="Leaf" />

      <HoroscopeText text={horoscope} />
    </div>
  );
}
