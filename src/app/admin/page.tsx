"use client";

import { useState, useEffect } from "react";
import { useAppBaseContext } from "@/components/providers/AppProvider";
import { Lock, Unlock, BarChart3, Users, Settings, Trophy, Trash2, CheckCircle2, ChevronDown, PlayCircle, StopCircle } from "lucide-react";
import { User, Project } from "@/types";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"results" | "participants" | "topic">("results");
  const [isMounted, setIsMounted] = useState(false);

  const { projects, votes, registeredUsers, votingStatus, resetVotes, setVotingStatus } = useAppBaseContext();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "0417") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("관리자 비밀번호가 틀렸습니다.");
    }
  };

  if (!isMounted) return null;

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex justify-center items-center bg-slate-50 p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Only</h1>
          <p className="text-gray-500 mb-8 font-medium">관리자 비밀번호를 입력하세요.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 text-center tracking-widest text-lg mb-4"
            placeholder="****"
            maxLength={4}
          />
          {error && <p className="text-red-500 text-sm mb-4 font-bold">{error}</p>}
          <button type="submit" className="w-full py-4 rounded-xl font-bold bg-gray-900 text-white hover:bg-gray-800 transition-colors">
            인증하기
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-row overflow-x-auto gap-8 pt-4">
            <TabButton active={activeTab === "results"} onClick={() => setActiveTab("results")} icon={<BarChart3 size={20} />} label="📊 투표 결과" />
            <TabButton active={activeTab === "participants"} onClick={() => setActiveTab("participants")} icon={<Users size={20} />} label="👥 참여자 현황" />
            <TabButton active={activeTab === "topic"} onClick={() => setActiveTab("topic")} icon={<Settings size={20} />} label="📝 주제 설정" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {activeTab === "results" && "투표 결과 모니터링"}
            {activeTab === "participants" && "해커톤 참여 현황"}
            {activeTab === "topic" && "오늘의 주제 셋업"}
          </h2>

          <div className="flex gap-3">
            <VotingStatusToggle status={votingStatus} onToggle={setVotingStatus} />
            <ResetVotesButton onReset={resetVotes} />
          </div>
        </div>

        {activeTab === "results" && <ResultsTab projects={projects} votes={votes} registeredUsers={registeredUsers} />}
        {activeTab === "participants" && <ParticipantsTab registeredUsers={registeredUsers} votes={votes} />}
        {activeTab === "topic" && <TopicTab />}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 pb-4 px-2 whitespace-nowrap text-lg font-bold border-b-4 transition-colors ${
        active ? "border-indigo-600 text-indigo-700" : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300"
      }`}
    >
      {icon} {label}
    </button>
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

/* ----------------- Results Tab ----------------- */
function ResultsTab({ projects, votes, registeredUsers }: { projects: Project[]; votes: Record<string, string>; registeredUsers: User[] }) {
  const sortedProjects = [...projects].sort((a, b) => b.votes - a.votes);
  const totalVotes = Object.keys(votes).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-500 font-medium mb-1">총 등록된 프로젝트</p>
          <div className="text-4xl font-extrabold text-gray-900">{projects.length}개</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-500 font-medium mb-1">현재까지 진행된 투표 수</p>
          <div className="text-4xl font-extrabold text-indigo-600">{totalVotes}표</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-500 font-medium mb-1">투표 참여율 (조원 기준)</p>
          <div className="text-4xl font-extrabold text-emerald-600">
            {registeredUsers.filter(u => u.isParticipant).length > 0
              ? Math.round((totalVotes / registeredUsers.filter(u => u.isParticipant).length) * 100)
              : 0}%
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        {sortedProjects.map((project, idx) => {
          const isRank1 = idx === 0 && project.votes > 0;
          const isRank2 = idx === 1 && project.votes > 0;
          const isRank3 = idx === 2 && project.votes > 0;

          // Find who voted for this project
          const votersForThis = Object.entries(votes)
            .filter(([_, vProjectId]) => vProjectId === project.id)
            .map(([voterId]) => voterId.split('_')[0]); // Use first part of id as name

          return (
            <div key={project.id} className="p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 text-center flex-shrink-0">
                    {isRank1 ? <Trophy className="mx-auto text-yellow-500" size={28} /> : 
                     isRank2 ? <Trophy className="mx-auto text-slate-400" size={24} /> : 
                     isRank3 ? <Trophy className="mx-auto text-amber-700" size={24} /> : 
                     <span className="text-gray-400 font-bold text-lg">{idx + 1}</span>}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{project.projectName}</h3>
                    <p className="text-gray-500 text-sm">{project.teamName} · 제출자: {project.submitterId.split('_')[0]}</p>
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-indigo-600">{project.votes}표</div>
              </div>
              
              {/* Progress Bar */}
              <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex mb-3">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    isRank1 ? 'bg-yellow-400' : isRank2 ? 'bg-slate-400' : isRank3 ? 'bg-amber-600' : 'bg-indigo-500'
                  }`} 
                  style={{ width: `${totalVotes > 0 ? (project.votes / totalVotes) * 100 : 0}%` }}
                />
              </div>

              {/* Voter list */}
              {project.votes > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 ml-12">
                  <span className="text-xs text-gray-400 font-medium py-1">투표자:</span>
                  {votersForThis.map(name => (
                    <span key={name} className="px-2 py-1 bg-white border border-gray-200 text-xs text-gray-600 rounded-md font-medium">
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ----------------- Participants Tab ----------------- */
function ParticipantsTab({ registeredUsers, votes }: { registeredUsers: User[]; votes: Record<string, string> }) {
  // Group by team
  const teamsMap: Record<string, User[]> = {};
  for (let i = 1; i <= 8; i++) {
    teamsMap[i.toString()] = [];
  }
  teamsMap["observer"] = [];

  registeredUsers.forEach(u => {
    if (u.isParticipant && u.teamNumber) {
      if (!teamsMap[u.teamNumber]) teamsMap[u.teamNumber] = [];
      teamsMap[u.teamNumber].push(u);
    } else {
      teamsMap["observer"].push(u);
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Object.keys(teamsMap).filter(k => k !== 'observer').map(teamNum => (
        <TeamGroupCard key={teamNum} title={`${teamNum}조`} users={teamsMap[teamNum]} votes={votes} />
      ))}
      <TeamGroupCard title="참관인 (Observer)" users={teamsMap["observer"]} votes={votes} />
    </div>
  );
}

function TeamGroupCard({ title, users, votes }: { title: string; users: User[]; votes: Record<string, string> }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 font-bold text-indigo-900 flex justify-between items-center">
        {title} 
        <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full">{users.length}명</span>
      </div>
      <div className="p-4 flex-1 space-y-3">
        {users.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">참여 기록 없음</p>
        ) : (
          users.map((u, i) => {
            const uid = `${u.name}_${u.teamNumber || 'obs'}`;
            const hasVoted = !!votes[uid];
            return (
              <div key={i} className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">{u.name}</span>
                {hasVoted ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md font-bold">
                    <CheckCircle2 size={12} /> 투표 완료
                  </span>
                ) : (
                   <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">대기중</span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ----------------- Topic Tab ----------------- */
function TopicTab() {
  const [topic, setTopic] = useState({ title: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/topic")
      .then(res => res.json())
      .then(data => {
        setTopic({ title: data.title || "", description: data.description || "" });
        setIsLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(topic)
      });
      if (res.ok) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
         setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    }
  };

  return (
    <div className="bg-white max-w-3xl rounded-3xl shadow-sm border border-gray-200 p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">메인 상단 주제 노출 영역 설정</h3>
      {isLoading ? (
        <p className="text-gray-500 animate-pulse">불러오는 중...</p>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">프롬프트 (강조 문구)</label>
            <input
              type="text"
              value={topic.title}
              onChange={e => setTopic({...topic, title: e.target.value})}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition-colors bg-gray-50"
              placeholder="예: AI를 활용한 비즈니스 혁신"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">상세 가이드 (설명)</label>
            <textarea
              value={topic.description}
              onChange={e => setTopic({...topic, description: e.target.value})}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition-colors bg-gray-50"
              placeholder="상세 내용을 입력하세요"
            />
          </div>
          
          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saveStatus === "saving"}
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {saveStatus === "saving" ? "저장 중..." : "주제 저장하기"}
            </button>
            {saveStatus === "success" && <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 size={18}/> 완전히 저장되었습니다! 메인에 즉시 반영됩니다.</span>}
            {saveStatus === "error" && <span className="text-red-500 font-bold">저장 실패</span>}
          </div>
        </form>
      )}
    </div>
  );
}
