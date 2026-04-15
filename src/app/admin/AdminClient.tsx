"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Unlock, BarChart3, Users, Settings, Trophy, Trash2, CheckCircle2, ChevronDown, PlayCircle, StopCircle } from "lucide-react";
import { ProjectUI } from "@/types";
import { setTopicObj, setVotingState, resetAllVotes } from "@/actions/admin";

export default function AdminClient({
  initialProjects,
  votedUsers,
  votingDetails,
  initialStatus,
  initialTopic
}: {
  initialProjects: ProjectUI[],
  votedUsers: any[],
  votingDetails: Record<string, any[]>,
  initialStatus: "not_started" | "active" | "ended",
  initialTopic: { 
    theme1: { title: string, example: string }, 
    theme2: { title: string, example: string } 
  }
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const [activeTab, setActiveTab] = useState<"results" | "users" | "topic">("results");
  
  const [topicState, setTopicState] = useState(initialTopic as any);
  const [isSavingTopic, setIsSavingTopic] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "0417") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("비밀번호가 올바르지 않습니다.");
    }
  };

  const handleSaveTopic = async () => {
    setIsSavingTopic(true);
    await setTopicObj(topicState);
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    setIsSavingTopic(false);
    router.refresh();
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex justify-center items-center py-20 px-4 bg-slate-50">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm border border-gray-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">관리자 페이지</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>
            {error && <p className="text-sm text-red-500 font-medium text-center">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Unlock size={18} /> 접근하기
            </button>
          </form>
        </div>
      </div>
    );
  }

  const sortedProjects = [...initialProjects].sort((a, b) => b.votes - a.votes);
  const maxVotes = sortedProjects.length > 0 ? Math.max(1, sortedProjects[0].votes) : 1;

  return (
    <div className="flex-1 bg-slate-50 pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 flex gap-8">
          <button
            onClick={() => setActiveTab("results")}
            className={`py-4 flex items-center gap-2 font-bold border-b-2 transition-colors ${
              activeTab === "results" ? "border-red-600 text-red-600" : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <BarChart3 size={18} /> 투표 결과
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`py-4 flex items-center gap-2 font-bold border-b-2 transition-colors ${
              activeTab === "users" ? "border-red-600 text-red-600" : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <Users size={18} /> 참여 현황
          </button>
          <button
            onClick={() => setActiveTab("topic")}
            className={`py-4 flex items-center gap-2 font-bold border-b-2 transition-colors ${
              activeTab === "topic" ? "border-red-600 text-red-600" : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <Settings size={18} /> 주제 설정
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {activeTab === "results" && "투표 결과 모니터링"}
            {activeTab === "users" && "투표 참여 현황"}
            {activeTab === "topic" && "오늘의 주제 셋업"}
          </h2>

          <div className="flex gap-3">
            <VotingStatusToggle 
              status={initialStatus as "not_started" | "active" | "ended"} 
              onToggle={async (s) => {
                await setVotingState(s);
                router.refresh();
              }} 
            />
            <ResetVotesButton onReset={async () => {
              await resetAllVotes();
              router.refresh();
            }} />
          </div>
        </div>

        {activeTab === "results" && (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-gray-100">
            {sortedProjects.length === 0 ? (
              <p className="text-center text-gray-500 py-10">등록된 프로젝트가 없습니다.</p>
            ) : (
              <div className="space-y-6">
                {sortedProjects.map((project, index) => {
                  const votersForThis = votingDetails[project.id] || [];
                  const isExpanded = expandedProject === project.id;
                  
                  return (
                    <div key={project.id} className="border border-gray-100 rounded-2xl overflow-hidden bg-white hover:border-gray-300 transition-colors">
                      <div 
                        className="p-5 flex items-center gap-4 cursor-pointer select-none"
                        onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                      >
                        <div className="w-12 font-bold text-center">
                          {index === 0 && project.votes > 0 ? (
                            <Trophy className="mx-auto text-yellow-500" />
                          ) : index === 1 && project.votes > 0 ? (
                            <Trophy className="mx-auto text-slate-400" />
                          ) : index === 2 && project.votes > 0 ? (
                            <Trophy className="mx-auto text-amber-700" />
                          ) : (
                            <span className="text-gray-400">{index + 1}</span>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 line-clamp-1">{project.title}</h3>
                          <p className="text-sm text-gray-500">{project.teamNumber}조</p>
                        </div>
                        
                        <div className="w-1/3 md:w-1/2 flex items-center gap-3">
                          <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                            <div 
                              className="h-full bg-red-500 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${(project.votes / maxVotes) * 100}%` }}
                            />
                          </div>
                          <span className="font-black text-lg w-8 text-right text-gray-700">{project.votes}</span>
                        </div>
                        
                        <div className="text-gray-400">
                          <ChevronDown size={20} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="bg-gray-50 px-6 py-5 border-t border-gray-100 p-3 text-sm text-gray-600">
                          {votersForThis.length === 0 ? (
                            <p className="text-gray-400 italic">아직 투표한 사람이 없습니다.</p>
                          ) : (
                            <div>
                              <p className="font-semibold text-gray-800 mb-3">투표자 목록 ({votersForThis.length}명)</p>
                              <div className="flex flex-wrap gap-2">
                                {votersForThis.map((voter, i) => (
                                  <span key={i} className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-200 font-medium">
                                    {voter.name || voter.voterName}
                                    <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                      {voter.isParticipant ? `${voter.teamNumber ?? voter.voterTeam ?? '?'}조` : "참관인"}
                                    </span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(teamNum => {
              const teamVoters = votedUsers.filter(u => u.teamNumber === teamNum);
              
              return (
                <div key={teamNum} className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                    <h3 className="text-lg font-black text-gray-800">{teamNum}조</h3>
                    <div className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold">
                      투표완료: {teamVoters.length}명
                    </div>
                  </div>
                  
                  {teamVoters.length === 0 ? (
                    <p className="text-sm text-gray-400 italic py-2 text-center">아직 투표 건이 없습니다</p>
                  ) : (
                    <ul className="space-y-2">
                      {teamVoters.map((user, idx) => (
                        <li key={idx} className="flex justify-between items-center text-sm">
                          <span className="font-medium text-gray-700">{user.name}</span>
                          <CheckCircle2 size={16} className="text-emerald-500" />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
            
            {/* Observers / 참관인 */}
            <div className="bg-gray-50 rounded-3xl p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                <h3 className="text-lg font-black text-gray-800">참관인</h3>
                <div className="px-2 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm font-bold">
                  투표완료: {votedUsers.filter(u => !u.isParticipant).length}명
                </div>
              </div>
              <ul className="space-y-2">
                {votedUsers.filter(u => !u.isParticipant).map((user, idx) => (
                  <li key={idx} className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-600">{user.name}</span>
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "topic" && (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-gray-100">
            <p className="text-gray-500 mb-8 max-w-2xl">이곳에서 변경한 주제는 메인 페이지 상단에 노출됩니다. 2개의 대조되는 테마(업무/일상)를 설정할 수 있으며, 각 테마별 예시는 줄바꿈으로 구분해 입력해 주세요.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Theme 1: 업무 */}
              <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-2 mb-6 text-indigo-900 font-black">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-xs">1</div>
                  <h3 className="text-lg">테마 1: 업무 특화</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">메인 주제 제목</label>
                    <input
                      type="text"
                      value={topicState?.theme1?.title || ""}
                      onChange={(e) => setTopicState({
                        ...topicState, 
                        theme1: { ...topicState.theme1, title: e.target.value } 
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium"
                      placeholder="예: 까칠한 동료보다 나은 업무 도우미"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">아이디어 예시 (줄바꿈으로 구분)</label>
                    <textarea
                      value={topicState?.theme1?.example || ""}
                      onChange={(e) => setTopicState({
                        ...topicState, 
                        theme1: { ...topicState.theme1, example: e.target.value } 
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none bg-white font-medium text-sm leading-relaxed"
                      placeholder="한 줄에 하나씩 예시를 입력하세요."
                    />
                  </div>
                </div>
              </div>

              {/* Theme 2: 일상 */}
              <div className="p-6 bg-purple-50/50 rounded-2xl border border-purple-100">
                <div className="flex items-center gap-2 mb-6 text-purple-900 font-black">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-xs">2</div>
                  <h3 className="text-lg">테마 2: 일상</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">메인 주제 제목</label>
                    <input
                      type="text"
                      value={topicState?.theme2?.title || ""}
                      onChange={(e) => setTopicState({
                        ...topicState, 
                        theme2: { ...topicState.theme2, title: e.target.value } 
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none bg-white font-medium"
                      placeholder="예: 1%를 위하여. 대중성은 필요없다"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">아이디어 예시 (줄바꿈으로 구분)</label>
                    <textarea
                      value={topicState?.theme2?.example || ""}
                      onChange={(e) => setTopicState({
                        ...topicState, 
                        theme2: { ...topicState.theme2, example: e.target.value } 
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none h-32 resize-none bg-white font-medium text-sm leading-relaxed"
                      placeholder="한 줄에 하나씩 예시를 입력하세요."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-gray-100">
              <div className="flex items-center gap-2">
                {saveSuccess && (
                  <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-sm font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={16} /> 설정이 저장되었습니다
                  </span>
                )}
              </div>
              
              <button
                onClick={handleSaveTopic}
                disabled={isSavingTopic}
                className="px-10 py-4 bg-gray-900 hover:bg-black text-white font-extrabold rounded-2xl disabled:bg-gray-400 transition-all active:scale-95 shadow-lg shadow-gray-200 disabled:shadow-none"
              >
                {isSavingTopic ? "저장 중..." : "주제 시스템 전체 업데이트"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function VotingStatusToggle({ status, onToggle }: { status: "not_started" | "active" | "ended", onToggle: (s: "not_started" | "active" | "ended") => void }) {
  const isActive = status === "active";
  
  const handleToggle = () => {
    onToggle(isActive ? "ended" : "active");
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg transition-colors border-2 ${
        isActive 
          ? "border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 shadow-sm" 
          : "border-gray-200 text-gray-600 bg-white hover:bg-gray-50 shadow-sm"
      }`}
    >
      {isActive ? <StopCircle size={18} /> : <PlayCircle size={18} />}
      {isActive ? "투표 활성화 됨 (클릭시 마감)" : "투표 시작하기 (현재 비활성)"}
    </button>
  );
}

function ResetVotesButton({ onReset }: { onReset: () => void }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    onReset();
    setShowConfirm(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-2 px-4 py-2 border-2 border-red-200 text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-300 font-bold rounded-lg transition-colors shadow-sm"
      >
        <Trash2 size={18} /> 투표 초기화
      </button>

      {showConfirm && (
        <div className="absolute right-0 top-12 w-64 bg-white border border-red-200 p-4 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
          <p className="text-sm font-semibold text-gray-800 mb-4">정말 투표 기록을 모두 지우시겠습니까? (복구 불가)</p>
          <div className="flex gap-2">
            <button onClick={() => setShowConfirm(false)} className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold text-gray-700 transition-colors">
              취소
            </button>
            <button onClick={handleReset} className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-bold text-white transition-colors">
              초기화
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
