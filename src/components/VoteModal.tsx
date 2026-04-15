"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { ProjectUI, User } from "@/types";
import { X, Heart, ShieldAlert } from "lucide-react";
import { castVote } from "@/actions/votes";
import { useRouter } from "next/navigation";

export default function VoteModal({ 
  projects, 
  currentUser, 
  onClose 
}: { 
  projects: ProjectUI[], 
  currentUser: User | null, 
  onClose: () => void 
}) {
  const router = useRouter();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Get current page URL
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleVote = async () => {
    if (!currentUser) {
      setError("로그인이 필요합니다.");
      return;
    }
    if (!selectedProjectId) {
      setError("프로젝트를 선택해주세요.");
      return;
    }

    const selectedProject = projects.find(p => p.id === selectedProjectId);
    if (currentUser.isParticipant && selectedProject?.teamNumber === currentUser.teamNumber) {
      setError("자신이 속한 조의 서비스는 투표할 수 없습니다.");
      return;
    }

    setIsSubmitting(true);
    const res = await castVote({
      projectId: selectedProjectId,
      voterName: currentUser.name,
      voterTeam: currentUser.teamNumber,
      isParticipant: currentUser.isParticipant
    });

    if (res.success) {
      setSuccess(true);
      router.refresh();
      // Show success briefly
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setError("투표 처리 중 오류가 발생했습니다. 이미 투표하셨을 수 있습니다.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-indigo-50">
          <h2 className="text-2xl font-extrabold text-indigo-900">투표하기</h2>
          <button onClick={onClose} className="p-2 bg-white rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {success ? (
            <div className="py-20 text-center">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart size={48} className="fill-emerald-500 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">✅ 투표에 참여하셨습니다!</h3>
              <p className="text-gray-500">소중한 한 표 감사합니다.</p>
            </div>
          ) : (
            <>
              <p className="text-center text-gray-600 mb-6 font-medium">가장 마음에 드는 프로젝트 하나를 선택해주세요.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {projects.map((p) => {
                  const isMyTeam = currentUser?.isParticipant && p.teamNumber === currentUser.teamNumber;
                  const isSelected = selectedProjectId === p.id;
                  
                  return (
                    <button
                      key={p.id}
                      onClick={() => !isMyTeam && setSelectedProjectId(p.id)}
                      disabled={isMyTeam}
                      className={`text-left p-4 rounded-2xl border-2 transition-all flex flex-col
                        ${isMyTeam 
                          ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed' 
                          : isSelected
                            ? 'border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-600 ring-offset-2'
                            : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${isMyTeam ? 'bg-gray-200 text-gray-500' : 'bg-indigo-100 text-indigo-700'}`}>
                          {p.teamNumber}조
                        </span>
                        {isMyTeam && (
                          <span title="자신의 조에는 투표할 수 없습니다">
                            <ShieldAlert size={16} className="text-amber-500" />
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-gray-900 line-clamp-2">{p.title}</span>
                    </button>
                  );
                })}
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-center text-sm font-bold mb-6">
                  {error}
                </div>
              )}

              <div className="hidden lg:flex flex-col items-center p-6 bg-gray-50 rounded-2xl mb-2 border border-gray-100">
                <p className="text-sm text-gray-500 mb-3 font-medium">모바일 기기로 투표하려면 이 QR코드를 스캔하세요</p>
                <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-200">
                  <QRCode value={currentUrl} size={120} />
                </div>
              </div>
            </>
          )}
        </div>

        {!success && (
          <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleVote}
              disabled={!selectedProjectId || isSubmitting}
              className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-md flex items-center gap-2
                ${!selectedProjectId || isSubmitting
                  ? "bg-gray-300 cursor-not-allowed shadow-none"
                  : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
                }
              `}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              ) : (
                <Heart size={20} className={selectedProjectId ? "fill-white" : ""} />
              )}
              제출하기
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
