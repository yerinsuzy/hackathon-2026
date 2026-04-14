"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { ProjectUI } from "@/types";
import { X, Trophy } from "lucide-react";

export default function WinnerOverlay({ 
  winnerProjects, 
  totalVotes, 
  onClose 
}: { 
  winnerProjects: ProjectUI[], 
  totalVotes: number, 
  onClose: () => void 
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // ... confetti logic remains same ...
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  if (!winnerProjects || winnerProjects.length === 0 || !mounted) return null;

  const isCoWinner = winnerProjects.length > 1;

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[999] flex flex-col items-center justify-center p-4 animate-in fade-in duration-500 overflow-y-auto">
      <button 
        onClick={onClose} 
        className="fixed top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white/50 hover:text-white transition-colors z-[1000]"
      >
        <X size={32} />
      </button>

      <div className="text-center w-full max-w-5xl my-auto animate-in zoom-in-50 duration-700 delay-150 fill-mode-both py-12">
        <div className="mb-6 relative inline-block">
          <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-30 rounded-full animate-pulse" />
          <Trophy className="w-32 h-32 mx-auto text-yellow-400 relative z-10" style={{ filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.5))" }} />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-yellow-600 tracking-wider mb-2">
          HACKATHON {isCoWinner ? "WINNERS" : "WINNER"}
        </h2>
        <p className="text-yellow-400/80 font-bold mb-8 tracking-[0.2em]">{isCoWinner ? "축하합니다! 공동 우승입니다!" : "축하합니다!"}</p>

        <div className={`grid gap-6 ${winnerProjects.length > 1 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-2xl mx-auto"}`}>
          {winnerProjects.map((project) => (
            <div key={project.id} className="bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[250px] transform hover:scale-[1.02] transition-transform">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-gradient-to-l from-yellow-500 to-yellow-600 rounded-bl-2xl font-bold text-yellow-950 text-sm">
                {project.teamNumber}조
              </div>
              
              <h3 className={`font-bold text-white mb-6 mt-4 leading-tight ${winnerProjects.length > 1 ? "text-xl md:text-2xl" : "text-3xl md:text-5xl"}`}>
                {project.title}
              </h3>
              
              <div className={`inline-flex items-center justify-center gap-3 bg-black/30 rounded-full px-6 py-3 border border-white/10 text-white/90 mx-auto`}>
                <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                <span className="text-2xl font-black">{project.votes}표</span>
              </div>
            </div>
          ))}
        </div>

        {totalVotes > 0 && (
          <div className="mt-12 text-white/40 text-sm font-medium">
            전체 참여 투표수: {totalVotes}표
          </div>
        )}
      </div>
    </div>
  );
}

function Heart(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
}
