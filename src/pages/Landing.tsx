import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { motion } from 'motion/react';

export function Landing() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen bg-custom-bg flex flex-col"
    >
      <Header />
      <main className="max-w-[1728px] mx-auto mt-[80px] w-full flex-grow">
        <Hero />
        <Features />
      </main>
      <footer className="w-full border-t border-custom-divider py-8 text-center text-custom-text-muted font-mono-data text-xs bg-custom-bg mt-auto z-10 relative">
        <div className="flex items-center justify-center gap-2">
          <span>Made with</span>
          <span className="text-[#ffb4ab]">♥</span>
          <span>in 2026. Ledger Financial Inc. All rights reserved.</span>
        </div>
      </footer>
    </motion.div>
  );
}
