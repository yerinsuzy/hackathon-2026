"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Sparkles, Smartphone, Share2 } from "lucide-react";

export default function QRCodeDisplay() {
  const [url, setUrl] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUrl(window.location.origin);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center gap-6 py-12 px-8 rounded-[40px] bg-gradient-to-b from-white to-indigo-50/30 border border-indigo-100/50 shadow-2xl shadow-indigo-100/20 backdrop-blur-sm relative overflow-hidden group">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-500/5 blur-[60px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/5 blur-[80px] rounded-full" />
      
      <div className="relative flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold tracking-widest uppercase mb-6 shadow-lg shadow-indigo-200 animate-pulse">
          <Sparkles size={12} />
          <span>Scan to Participate</span>
        </div>

        <div className="relative p-6 bg-white rounded-[32px] shadow-inner border border-white group-hover:scale-105 transition-all duration-500 ease-out">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative bg-white p-2 rounded-2xl">
            <QRCode
              value={url || "https://hackathon.vercel.app"}
              size={180}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox={`0 0 256 256`}
              fgColor="#1e1b4b" // indigo-950
            />
          </div>
        </div>
      </div>

      <div className="text-center space-y-2 relative z-10">
        <h3 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <Smartphone className="text-indigo-600" size={20} />
          모바일로 바로 참여하세요
        </h3>
        <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
          QR 코드를 스캔하여 실시간으로 <br />
          <span className="font-semibold text-indigo-600">투표</span>하고 <span className="font-semibold text-purple-600">제출작</span>을 감상할 수 있습니다.
        </p>
      </div>

      <div className="flex items-center gap-3 text-indigo-400 opacity-60 group-hover:opacity-100 transition-opacity">
        <Share2 size={16} />
        <span className="text-xs font-medium tracking-tight whitespace-nowrap">{url.replace(/^https?:\/\//, "")}</span>
      </div>
    </div>
  );
}
