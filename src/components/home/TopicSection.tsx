"use client";

import { useState, useEffect } from "react";
import { Lock, Unlock, ChevronUp, Briefcase, Sparkles, Lightbulb } from "lucide-react";

interface Theme {
  title: string;
  example: string;
}

interface TopicData {
  theme1: Theme;
  theme2: Theme;
}

export default function TopicSection({ initialTopic }: { initialTopic: TopicData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  
  const topic = initialTopic;

  useEffect(() => {
    setIsMounted(true);
    const revealed = localStorage.getItem("topicRevealed");
    if (revealed === "true") {
      setIsUnlocked(true);
      setIsOpen(true);
    }
  }, []);

  const handleToggle = (e: React.MouseEvent<HTMLDetailsElement>) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "0417") {
      setIsUnlocked(true);
      setError("");
      localStorage.setItem("topicRevealed", "true");
    } else {
      setError("비밀번호가 올바르지 않습니다.");
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUnlocked(false);
    setIsOpen(false);
    setPassword("");
    localStorage.removeItem("topicRevealed");
  };

  if (!isMounted) return null;

  return (
    <div className="w-full max-w-5xl mx-auto mb-10 relative z-50 group-topic animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-purple-950 rounded-[40px] shadow-2xl border border-white/10 overflow-hidden">
        <details 
          className="group"
          open={isOpen}
        >
          <summary 
            onClick={handleToggle}
            className="flex items-center justify-center cursor-pointer font-semibold text-white list-none [&::-webkit-details-marker]:hidden"
          >
            <div className="flex items-center gap-3 px-8 py-5 transition-all hover:scale-105 duration-300">
              {isUnlocked ? (
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-4 py-1.5 rounded-full border border-emerald-400/20">
                  <Unlock size={16} />
                  <span className="text-sm font-bold tracking-tight">주제 공개 중</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-white/90 bg-white/5 px-6 py-2.5 rounded-full border border-white/10 backdrop-blur-md">
                  <Lock size={16} />
                  <span className="tracking-wide">오늘의 주제는 무엇일까요? (클릭하여 확인)</span>
                </div>
              )}
            </div>
          </summary>
          
          {isOpen && (
            <div className="px-4 pb-8 sm:px-8 bg-white/5 backdrop-blur-3xl border-t border-white/5">
              {!isUnlocked ? (
                <div className="max-w-md mx-auto py-12 text-center">
                  <div className="mb-6 inline-flex p-4 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 text-indigo-400">
                    <Lock size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">비밀번호 보호됨</h4>
                  <p className="text-indigo-200/60 text-sm mb-8">공유받은 비밀번호를 입력해주세요.</p>
                  
                  <form onSubmit={handleUnlock} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="password"
                      placeholder="PW 4자리"
                      maxLength={4}
                      className="flex-1 px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white text-lg text-center tracking-[0.5em] font-mono"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                      type="submit"
                      className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                    >
                      잠금 해제
                    </button>
                  </form>
                  {error && <p className="text-rose-400 text-sm mt-4 font-semibold animate-bounce">{error}</p>}
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                  <div className="relative flex flex-col items-center py-6 border-b border-white/5 mb-8">
                    <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400 mb-2">
                      <Lightbulb size={24} />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-black text-white tracking-tight">오늘의 주제</h3>
                      <p className="text-white/40 text-xs font-medium uppercase tracking-widest">두 테마 중 하나를 선택해 보세요</p>
                    </div>
                    <button 
                      onClick={handleClose}
                      className="absolute right-0 top-1/2 -translate-y-1/2 p-2.5 text-white/30 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all border border-transparent hover:border-rose-400/20"
                    >
                      <ChevronUp size={24} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                    {/* Theme 1: Work */}
                    <div className="relative group/card overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-500/10 to-transparent border border-white/10 p-8 hover:border-indigo-500/30 transition-all duration-500 shadow-xl">
                      <div className="absolute top-0 right-0 p-6 opacity-20 group-hover/card:scale-110 transition-transform duration-700 text-indigo-400">
                        <Briefcase size={80} />
                      </div>
                      
                      <div className="relative z-10">
                        <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-black tracking-widest uppercase rounded-full border border-indigo-500/30 mb-6">
                          Theme 01. 업무 특화
                        </span>
                        <h4 className="text-2xl sm:text-3xl font-black text-white mb-6 leading-tight break-keep">
                          {topic.theme1?.title || "주제를 입력해주세요"}
                        </h4>
                        
                        <div className="space-y-4">
                          <p className="text-xs font-bold text-white/30 tracking-widest uppercase">💡 아이디어 예시</p>
                          <ul className="space-y-3">
                            {(topic.theme1?.example || "").split('\n').filter(line => line.trim()).map((line, idx) => (
                              <li key={idx} className="flex items-start gap-3 group/item">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover/item:scale-125 transition-transform" />
                                <span className="text-gray-300 text-sm sm:text-base leading-relaxed break-keep font-medium">
                                  {line}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Theme 2: Daily */}
                    <div className="relative group/card overflow-hidden rounded-[32px] bg-gradient-to-br from-purple-500/10 to-transparent border border-white/10 p-8 hover:border-purple-500/30 transition-all duration-500 shadow-xl">
                      <div className="absolute top-0 right-0 p-6 opacity-20 group-hover/card:scale-110 transition-transform duration-700 text-purple-400">
                        <Sparkles size={80} />
                      </div>
                      
                      <div className="relative z-10">
                        <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-[10px] font-black tracking-widest uppercase rounded-full border border-purple-500/30 mb-6">
                          Theme 02. 일상
                        </span>
                        <h4 className="text-2xl sm:text-3xl font-black text-white mb-6 leading-tight break-keep">
                          {topic.theme2?.title || "주제를 입력해주세요"}
                        </h4>
                        
                        <div className="space-y-4">
                          <p className="text-xs font-bold text-white/30 tracking-widest uppercase">💡 아이디어 예시</p>
                          <ul className="space-y-3">
                            {(topic.theme2?.example || "").split('\n').filter(line => line.trim()).map((line, idx) => (
                              <li key={idx} className="flex items-start gap-3 group/item">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-50 group-hover/item:scale-125 transition-transform" />
                                <span className="text-gray-300 text-sm sm:text-base leading-relaxed break-keep font-medium">
                                  {line}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </details>
      </div>
    </div>
  );
}

