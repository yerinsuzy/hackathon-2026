"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppBaseContext } from "@/components/providers/AppProvider";
import { UserCircle, ArrowRight, Check, X } from "lucide-react";

export default function LoginPage() {
  const [isParticipant, setIsParticipant] = useState<boolean | null>(null);
  const [teamNumber, setTeamNumber] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [error, setError] = useState("");
  
  const { login } = useAppBaseContext();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isParticipant === null) {
      setError("참여 여부를 선택해주세요.");
      return;
    }

    if (isParticipant && !teamNumber) {
      setError("소속 조를 선택해주세요.");
      return;
    }

    if (!name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }

    login({
      name: name.trim(),
      isParticipant,
      teamNumber: isParticipant ? teamNumber : null
    });
    
    router.push("/");
  };

  return (
    <div className="flex-1 flex justify-center items-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 relative overflow-hidden border border-gray-100">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 rounded-full bg-indigo-50" />
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-24 h-24 rounded-full bg-purple-50" />
        
        <div className="relative text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
            <UserCircle size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">환영합니다</h1>
          <p className="text-gray-500">원활한 진행을 위해 정보를 입력해주세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="relative space-y-6">
          {/* Step 1: Participant Boolean */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3 text-center">
              해커톤에 참가 중인 조원이신가요?
            </label>
            <div className="flex gap-4 justify-center">
              <button
                type="button"
                onClick={() => {
                  setIsParticipant(true);
                  setError("");
                }}
                className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 font-medium transition-all ${
                  isParticipant === true
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Check size={18} /> 예, 조원입니다
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsParticipant(false);
                  setTeamNumber("");
                  setError("");
                }}
                className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 font-medium transition-all ${
                  isParticipant === false
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <X size={18} /> 아니요 (참관인)
              </button>
            </div>
          </div>

          {/* Step 2: Team Selection (Only if Participant) */}
          {isParticipant === true && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label htmlFor="teamNumber" className="block text-sm font-semibold text-gray-800 mb-2">
                소속 조 선택
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setTeamNumber(num.toString());
                      setError("");
                    }}
                    className={`py-2 rounded-lg border-2 font-medium transition-colors ${
                      teamNumber === num.toString()
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-md"
                        : "border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"
                    }`}
                  >
                    {num}조
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Name Input (Always shown after Step 1) */}
          {isParticipant !== null && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-2">
                이름 {isParticipant === false ? "(선택)" : ""}
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                placeholder="홍길동"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-indigo-500 transition-colors bg-white text-gray-900 text-lg"
              />
            </div>
          )}

          {error && (
            <p className="mt-2 text-sm text-red-600 text-center font-medium bg-red-50 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={isParticipant === null}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
              isParticipant !== null
                ? "text-white bg-gray-900 hover:bg-gray-800 active:scale-95"
                : "text-gray-400 bg-gray-200 cursor-not-allowed"
            }`}
          >
            입장하기
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
