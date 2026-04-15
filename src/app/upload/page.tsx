"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppBaseContext } from "@/components/providers/AppProvider";
import { UploadCloud, CheckCircle2, AlertCircle, Bold, Italic, List, Heading1, Heading2, Lock, Save } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { addProject } from "@/actions/projects";
import { Suspense } from "react";

// Editor component for Tiptap
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200 bg-gray-50 rounded-t-xl">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive("bold") ? "bg-gray-200 text-indigo-600" : "text-gray-600"}`}
      >
        <Bold size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive("italic") ? "bg-gray-200 text-indigo-600" : "text-gray-600"}`}
      >
        <Italic size={18} />
      </button>
      <div className="w-px bg-gray-300 mx-1"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1.5 rounded hover:bg-gray-200 font-bold ${editor.isActive("heading", { level: 1 }) ? "bg-gray-200 text-indigo-600" : "text-gray-600"}`}
      >
        <Heading1 size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1.5 rounded hover:bg-gray-200 font-bold ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200 text-indigo-600" : "text-gray-600"}`}
      >
        <Heading2 size={18} />
      </button>
      <div className="w-px bg-gray-300 mx-1"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive("bulletList") ? "bg-gray-200 text-indigo-600" : "text-gray-600"}`}
      >
        <List size={18} />
      </button>
    </div>
  );
};

export default function UploadPage() {
  const { currentUser } = useAppBaseContext();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: "",
    teamNumber: "",
    url: "",
    passwordRaw: "",
  });
  
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>프로젝트(서비스)에 대한 상세 설명을 작성해주세요.</p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm xl:prose-base focus:outline-none p-4 min-h-[200px] max-w-none text-gray-800',
      },
    },
  });

  useEffect(() => {
    if (currentUser === null) {
      router.push("/login");
    } else if (currentUser.isParticipant && currentUser.teamNumber) {
      setFormData(prev => ({ ...prev, teamNumber: currentUser.teamNumber!.toString() }));
    }
  }, [currentUser, router]);

  if (currentUser === null) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.teamNumber || !formData.url || !formData.passwordRaw) {
      setError("비밀번호를 포함한 모든 필수 항목을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const descriptionHtml = editor?.getHTML() || "";

    const res = await addProject({
      title: formData.title,
      teamNumber: parseInt(formData.teamNumber, 10),
      url: formData.url,
      description: descriptionHtml,
      passwordRaw: formData.passwordRaw,
    });

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/gallery");
      }, 1500);
    } else {
      setError("프로젝트 등록 중 오류가 발생했습니다.");
      setIsSubmitting(false);
    }
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
    <div className="max-w-4xl mx-auto w-full px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">결과물 제출</h1>
        <p className="text-gray-600 text-lg">해커톤 결과물을 정리하고 등록하여 동료들에게 멋진 프로젝트를 공유하세요!</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-12">
        <div className="bg-indigo-50 p-6 flex items-start gap-4 border-b border-indigo-100">
          <AlertCircle className="text-indigo-600 mt-1" size={24} />
          <div>
            <h3 className="font-semibold text-indigo-900">제출 전 확인사항</h3>
            <p className="text-indigo-700 text-sm mt-1">
              상세 설명은 5분 피칭/발표에 활용될 수 있게 꼼꼼히 작성해주세요. <br/>
              추후 수정/삭제 시 <strong>비밀번호</strong>가 필요하므로 반드시 기억해주세요.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                조 번호 <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.teamNumber}
                onChange={(e) => setFormData({ ...formData, teamNumber: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors bg-white font-medium"
              >
                <option value="" disabled>조를 선택하세요</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num}조</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                결과물 수정/삭제 비밀번호 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={formData.passwordRaw}
                  onChange={(e) => setFormData({ ...formData, passwordRaw: e.target.value })}
                  placeholder="추후 수정을 위한 비밀번호"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors bg-white font-medium"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              서비스명 (Title) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="예: AI 기반 자동 문서 요약"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              시연 URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              상세 설명 <span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-shadow">
              <MenuBar editor={editor} />
              <EditorContent editor={editor} className="bg-white min-h-[200px]" />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-medium">
              {error}
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 text-white hover:bg-indigo-700 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-transform shadow-lg shadow-indigo-200 ${
                isSubmitting ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 active:scale-[0.98]"
              }`}
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UploadCloud size={24} />
                  제출하기
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
