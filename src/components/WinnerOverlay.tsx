"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { ProjectUI } from "@/types";
import { X, Trophy } from "lucide-react";

export default function WinnerOverlay({ 
  winnerProject, 
  totalVotes, 
  onClose 
}: { 
  winnerProject: ProjectUI, 
  totalVotes: number, 
  onClose: () => void 
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  if (!winnerProject || !mounted) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[999] flex flex-col items-center justify-center p-4 animate-in fade-in duration-500">
      <button 
        onClick={onClose} 
        className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white/50 hover:text-white transition-colors"
      >
        <X size={32} />
      </button>

      <div className="text-center w-full max-w-4xl animate-in zoom-in-50 duration-700 delay-150 fill-mode-both">
        <div className="mb-8 relative inline-block">
          <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-30 rounded-full animate-pulse" />
          <Trophy className="w-40 h-40 mx-auto text-yellow-400 relative z-10" style={{ filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.5))" }} />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-yellow-600 tracking-wider mb-6 pb-2">
          HACKATHON WINNER
        </h2>

        <div className="bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 px-6 py-2 bg-gradient-to-l from-yellow-500 to-yellow-600 rounded-bl-3xl font-bold text-yellow-950">
            {winnerProject.teamNumber}조
          </div>
          
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-8 mt-4 leading-tight">
            {winnerProject.title}
          </h3>
          
          <div className="inline-flex items-center gap-4 bg-black/30 rounded-full px-8 py-4 border border-white/10 text-white/90">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
              <span className="text-3xl font-black">{winnerProject.votes}표</span>
            </div>
            {totalVotes > 0 && (
              <>
                <span className="text-white/30 text-2xl">/</span>
                <span className="text-xl font-medium">총 {Math.max(totalVotes, winnerProject.votes)}표 중 <span className="text-yellow-400">{(winnerProject.votes / totalVotes * 100).toFixed(1)}%</span></span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Heart(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
}
