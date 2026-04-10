"use client";

import { useState, useEffect } from "react";
import { Lock, Unlock, ChevronUp } from "lucide-react";

interface TopicData {
  title: string;
  description: string;
}

export default function TopicSection({ initialTopic }: { initialTopic: { title: string, description: string } }) {
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
    if (!isUnlocked) {
      setIsOpen(!isOpen);
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "0417") {
      setIsUnlocked(true);
      setError("");
      localStorage.setItem("topicRevealed", "true");
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

  if (!isMounted) return null; // Hydration 

  return (
    <div className="w-full max-w-3xl mx-auto mb-10 relative z-50 group-topic animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl shadow-xl border border-indigo-700/50">
        <details 
          className="group"
          open={isOpen}
        >
          <summary 
            onClick={handleToggle}
            className="flex items-center justify-center cursor-pointer font-semibold text-white list-none [&::-webkit-details-marker]:hidden"
          >
            <div className="flex items-center gap-2 px-6 py-4 rounded-3xl bg-white/5 hover:bg-white/10 transition-all backdrop-blur-sm">
              {isUnlocked ? <Unlock size={16} className="text-emerald-400" /> : <Lock size={16} className="text-white/80" />}
              <span className="tracking-wide">
                {isUnlocked ? "오늘의 주제 공개 중" : "🔒 오늘의 주제는? (클릭하여 확인)"}
              </span>
            </div>
          </summary>
          
          {isOpen && (
            <div className="m-2 mt-0 p-6 sm:p-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-inner text-gray-800 text-lg leading-relaxed relative border border-white">
              {!isUnlocked ? (
                <form onSubmit={handleUnlock} className="flex flex-col gap-3 max-w-sm mx-auto my-4 text-center">
                  <p className="text-sm text-gray-600 mb-2 font-medium">관리자에게 전달받은 비밀번호를 입력해주세요.</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="password"
                      placeholder="비밀번호 4자리"
                      maxLength={4}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg text-center tracking-widest bg-gray-50 uppercase"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                      type="submit"
                      className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition duration-200 shadow-sm active:scale-95"
                    >
                      확인
                    </button>
                  </div>
                  {error && <p className="text-red-500 text-sm mt-2 animate-pulse font-medium">{error}</p>}
                </form>
              ) : (
                <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 p-2">
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center sm:justify-start gap-3">
                      <span className="text-3xl">💡</span>
                      {topic ? topic.title : "주제를 불러오는 중..."}
                    </h3>
                    {topic && (
                      <p className="mt-4 text-lg text-gray-600 max-w-3xl leading-relaxed font-medium">
                        {topic.description}
                      </p>
                    )}
                  </div>
                  <button 
                    onClick={handleClose}
                    className="flex-shrink-0 px-4 py-2 mt-4 sm:mt-0 text-sm font-semibold text-gray-500 hover:text-red-600 bg-gray-100 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 group border border-gray-200 hover:border-red-200 shadow-sm"
                  >
                    접기 <ChevronUp size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          )}
        </details>
      </div>
    </div>
  );
}
