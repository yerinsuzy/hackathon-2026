"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppBaseContext } from "@/components/providers/AppProvider";
import { Heart, ExternalLink, Trophy, Users, AlertCircle, Maximize2, Trash2 } from "lucide-react";
import Link from "next/link";
import { ProjectUI } from "@/types";
import { castVote, removeVote } from "@/actions/votes";
import { deleteProject } from "@/actions/projects";
import VoteModal from "@/components/VoteModal";
import WinnerOverlay from "@/components/WinnerOverlay";

export default function GalleryClient({ 
  initialProjects, 
  initialVotesMap, 
  initialStatus 
}: { 
  initialProjects: ProjectUI[], 
  initialVotesMap: Record<string, string>, 
  initialStatus: string 
}) {
  const { currentUser } = useAppBaseContext();
  const router = useRouter();
  
  const [projects, setProjects] = useState<ProjectUI[]>(initialProjects);
  const [votesMap, setVotesMap] = useState<Record<string, string>>(initialVotesMap);
  const [votingStatus, setVotingStatus] = useState(initialStatus);
  
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [winnerOverlayOpen, setWinnerOverlayOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [votingProjectId, setVotingProjectId] = useState<string | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);

  // Polling every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 30000);
    return () => clearInterval(interval);
  }, [router]);

  // Sync props to state if props update from router.refresh()
  useEffect(() => {
    setProjects(initialProjects);
    setVotesMap(initialVotesMap);
    setVotingStatus(initialStatus);
  }, [initialProjects, initialVotesMap, initialStatus]);

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    if (!deletePassword) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteProject(projectToDelete, deletePassword);
      if (!res?.success) {
        alert(res?.error || "삭제에 실패했습니다.");
      } else {
        alert("성공적으로 삭제되었습니다.");
        setProjects((prev) => prev.filter(p => p.id !== projectToDelete));
        router.refresh();
      }
    } catch (e) {
      alert("삭제 중 서버 통신 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
      setProjectToDelete(null);
      setDeletePassword("");
    }
  };

  const handleCardVote = async (projectId: string, isRemoving: boolean = false) => {
    if (!currentUser) {
      alert("로그인이 필요합니다. 아래 로그인 버튼을 눌러주세요.");
      return;
    }
    if (votingStatus !== "active") {
      alert("지금은 투표 가능 시간이 아닙니다.");
      return;
    }

    const clickedProject = projects.find(p => p.id === projectId);
    if (currentUser.isParticipant && clickedProject?.teamNumber === currentUser.teamNumber) {
      alert("자신이 속한 조의 프로젝트에는 투표할 수 없습니다.");
      return;
    }

    setVotingProjectId(projectId);
    try {
      if (isRemoving) {
        const res = await removeVote({
          voterName: currentUser.name,
          voterTeam: currentUser.teamNumber,
          isParticipant: currentUser.isParticipant
        });
        if (res.success) router.refresh();
        else alert("투표 취소에 실패했습니다.");
      } else {
        const res = await castVote({
          projectId: projectId,
          voterName: currentUser.name,
          voterTeam: currentUser.teamNumber,
          isParticipant: currentUser.isParticipant
        });
        if (res.success) router.refresh();
        else alert("투표에 실패했습니다.");
      }
    } catch {
      alert("서버 오류가 발생했습니다.");
    } finally {
      setVotingProjectId(null);
    }
  };

  const handleRevealWinner = () => {
    setIsRevealing(true);
    setTimeout(() => {
      setIsRevealing(false);
      setWinnerOverlayOpen(true);
    }, 3000); // 3 seconds of suspense!
  };

  const visibleProjects = [...projects].sort((a, b) => a.teamNumber - b.teamNumber);
  const actualWinner = [...projects].sort((a, b) => b.votes - a.votes)[0];

  const currentUserId = currentUser ? `${currentUser.name}_${currentUser.teamNumber || 'obs'}` : null;
  const myVotedProjectId = currentUserId ? votesMap[currentUserId] : null;

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-12 relative">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">프로젝트 갤러리</h1>
        <p className="text-gray-600 text-lg max-w-2xl">
          해커톤 참가자들의 열정이 담긴 결과물입니다. 
          제일 마음에 드는 1조에게만 투표가 가능하니, 가장 마음에 드는 프로젝트에 투표해주세요!
        </p>
      </div>

      {votingStatus !== "active" && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 mb-10 flex items-start gap-4">
          <AlertCircle className="text-rose-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-rose-800">투표 안내</h3>
            <p className="text-rose-700 mt-1">지금은 투표 가능 시간이 아닙니다. 행사 진행 안내에 따라 투표 시간이 되면 참여해주세요.</p>
          </div>
        </div>
      )}

      {votingStatus === "active" && (
        <div className="flex justify-center mb-10">
          <button 
            onClick={() => setIsVoteModalOpen(true)}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3 text-lg"
          >
            <Heart size={24} className="fill-white" />
            가장 마음에 드는 서비스를 선택해 주세요
          </button>
        </div>
      )}

      {!currentUser && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-10 flex items-start gap-4">
          <AlertCircle className="text-amber-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-800">투표 참여 안내</h3>
            <p className="text-amber-700 mt-1 mb-3">투표를 하시려면 로그인이 필요합니다. 이름과 역할을 입력하고 간편하게 로그인하세요.</p>
            <Link 
              href="/login" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none"
            >
              로그인하러 가기
            </Link>
          </div>
        </div>
      )}

      {visibleProjects.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-500">등록된 프로젝트가 없습니다</h3>
          <p className="text-gray-400 mt-2">첫 번째 프로젝트를 제출해보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {visibleProjects.map((project, index) => {
            const hasVotedForThis = myVotedProjectId === project.id;
            const isMyProject = Boolean(currentUser?.teamNumber != null && Number(currentUser.teamNumber) === Number(project.teamNumber));

            return (
              <ProjectCard 
                key={project.id}
                project={project}
                hasVotedForThis={hasVotedForThis}
                isMyProject={isMyProject}
                onDelete={() => setProjectToDelete(project.id)}
                onVote={() => handleCardVote(project.id, false)}
                onRemoveVote={() => handleCardVote(project.id, true)}
                isVotingLoading={votingProjectId === project.id}
              />
            );
          })}
        </div>
      )}

      {/* Admin Revealed Winner Button */}
      {votingStatus === "ended" && actualWinner && (
        <div className="flex justify-center mt-8 mb-16">
          {isRevealing ? (
            <button 
              disabled
              className="px-12 py-5 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-extrabold rounded-full shadow-2xl flex items-center gap-4 text-2xl animate-pulse"
            >
              <span className="animate-bounce text-3xl inline-block -mt-2">🥁</span> 
              두구두구두구...
            </button>
          ) : (
            <button 
              onClick={handleRevealWinner}
              className="px-10 py-5 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-extrabold rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-4 text-2xl"
            >
              <Trophy size={32} className="fill-white" />
              🏆 1위 결과 보러가기
            </button>
          )}
        </div>
      )}

      {isVoteModalOpen && (
        <VoteModal 
          projects={visibleProjects}
          currentUser={currentUser}
          onClose={() => setIsVoteModalOpen(false)}
        />
      )}

      {winnerOverlayOpen && actualWinner && (
        <WinnerOverlay 
          winnerProject={actualWinner} 
          totalVotes={votesMap ? Object.keys(votesMap).length : 0}
          onClose={() => setWinnerOverlayOpen(false)} 
        />
      )}

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">프로젝트 삭제</h3>
              <p className="text-gray-600 mb-6 text-sm">
                정말로 이 프로젝트를 삭제하시겠습니까? 등록 시 입력했던 비밀번호를 입력해주세요.
              </p>
              
              <div className="space-y-4">
                <div>
                  <input
                    type="password"
                    placeholder="비밀번호"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-shadow"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') confirmDelete();
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                onClick={() => {
                  setProjectToDelete(null);
                  setDeletePassword("");
                }}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                {isDeleting ? "삭제 중..." : "위험: 삭제하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ 
  project, 
  hasVotedForThis,
  isMyProject,
  onDelete,
  onVote,
  onRemoveVote,
  isVotingLoading
}: { 
  project: ProjectUI, 
  hasVotedForThis: boolean,
  isMyProject?: boolean,
  onDelete?: () => void,
  onVote?: () => void,
  onRemoveVote?: () => void,
  isVotingLoading?: boolean
}) {
  return (
    <div className="relative bg-white rounded-3xl shadow-lg border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl overflow-hidden flex flex-col h-full">
      
      {/* Card Content Area */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2 mt-4 cursor-default">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 leading-tight">
            {project.title}
          </h3>
          {isMyProject && (
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onDelete) onDelete();
              }}
              title="이 프로젝트 삭제하기"
              className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors flex-shrink-0"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-gray-600 mb-6 bg-gray-50 px-3 py-2 rounded-lg w-fit">
          <Users size={16} className="text-gray-400" />
          <span className="font-medium text-sm">{project.teamNumber}조</span>
        </div>
        
        <div className="text-sm text-gray-600 mb-6 flex-1 prose prose-sm max-w-none line-clamp-4" dangerouslySetInnerHTML={{ __html: project.description }} />
        
        <div className="flex items-center gap-3 mt-auto pt-6 border-t border-gray-100">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition-colors"
          >
            보러가기 <ExternalLink size={18} />
          </a>
          
          {hasVotedForThis && (
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemoveVote?.(); }}
              disabled={isVotingLoading}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-bold transition-all
                ${isVotingLoading ? 'bg-pink-100 text-pink-400 border-pink-200 cursor-wait' : 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100 hover:scale-105 active:scale-95'}`}
              title="내 투표 취소하기"
            >
              <Heart size={20} className={isVotingLoading ? "text-pink-400" : "fill-pink-500 text-pink-500"} />
            </button>
          )}
          {!hasVotedForThis && (
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onVote?.(); }}
              disabled={isVotingLoading || isMyProject}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-bold transition-all
                ${isMyProject 
                  ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'
                  : isVotingLoading 
                    ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-wait' 
                    : 'bg-white text-gray-500 border-gray-200 hover:border-pink-300 hover:text-pink-500 hover:bg-pink-50 hover:scale-105 active:scale-95'
                }`}
              title={isMyProject ? "내 프로젝트에는 투표할 수 없습니다" : "이 프로젝트에 투표하기"}
            >
              <Heart size={20} className={isVotingLoading ? "animate-pulse" : ""} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
