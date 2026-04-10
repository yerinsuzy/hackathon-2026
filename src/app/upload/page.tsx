"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppBaseContext } from "@/components/providers/AppProvider";
import { UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";

export default function UploadPage() {
  const { currentUser, addProject } = useAppBaseContext();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    projectName: "",
    teamName: "",
    url: "",
  });
  
  const [success, setSuccess] = useState(false);

  // Redirect if not logged in & prepopulate team
  useEffect(() => {
    if (currentUser === null) {
      router.push("/login");
    } else if (currentUser.isParticipant && currentUser.teamNumber && !formData.teamName) {
      setFormData(prev => ({ ...prev, teamName: `${currentUser.teamNumber}조` }));
    }
  }, [currentUser, router]);

  if (currentUser === null) {
    return null; // or a loading spinner
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectName || !formData.teamName || !formData.url) return;

    addProject({
      projectName: formData.projectName,
      teamName: formData.teamName,
      url: formData.url,
      submitterId: `${currentUser.name}_${currentUser.teamNumber || 'obs'}`,
    });
    
    setSuccess(true);
    setTimeout(() => {
      router.push("/gallery");
    }, 1500);
  };

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full">
          <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">제출 완료!</h2>
          <p className="text-gray-500 mb-8">프로젝트가 갤러리에 성공적으로 등록되었습니다.</p>
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">프로젝트 제출</h1>
        <p className="text-gray-600 text-lg">해커톤 결과물을 등록하고 동료들에게 공유하세요.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-indigo-50 p-6 flex items-start gap-4 border-b border-indigo-100">
          <AlertCircle className="text-indigo-600 mt-1" size={24} />
          <div>
            <h3 className="font-semibold text-indigo-900">제출 전 확인사항</h3>
            <p className="text-indigo-700 text-sm mt-1">제출 후에는 수정 및 삭제가 어렵습니다. 시연이 가능한 웹페이지 URL을 정확히 입력해주세요.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              프로젝트명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              placeholder="예: AI 기반 자동 문서 요약"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              팀명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.teamName}
              onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
              placeholder="예: 알파팀"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              웹페이지 URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-indigo-200"
            >
              <UploadCloud size={24} />
              제출하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
