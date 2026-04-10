"use client";

import { useState } from "react";
import { useAppBaseContext } from "@/components/providers/AppProvider";
import { Heart, ExternalLink, Trophy, Users, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Project, User } from "@/types";

export default function GalleryPage() {
  const { currentUser, projects, votes, vote, removeVote, votingStatus } = useAppBaseContext();
  const [searchTerm, setSearchTerm] = useState("");

  // Sort projects by votes (descending)
  const sortedProjects = [...projects].sort((a, b) => b.votes - a.votes);
  
  // Filter by search
  const filteredProjects = sortedProjects.filter((p) => 
    p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.teamName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentUserId = currentUser ? `${currentUser.name}_${currentUser.teamNumber || 'obs'}` : null;
  const myVotedProjectId = currentUserId ? votes[currentUserId] : null;

  const handleVoteClick = (projectId: string) => {
    if (votingStatus !== "active") {
      alert("지금은 투표 가능시간이 아닙니다.");
      return;
    }
    vote(projectId);
  };

  const handleRemoveVoteClick = () => {
    if (votingStatus !== "active") {
      alert("지금은 투표 가능시간이 아닙니다.");
      return;
    }
    removeVote();
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-12">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">프로젝트 갤러리</h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            해커톤 참가자들의 열정이 담긴 결과물입니다. 
            팀당 딱 1번의 투표가 가능하니, 가장 마음에 드는 프로젝트에 투표해주세요!
          </p>
        </div>
        
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="프로젝트 또는 팀 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-shadow"
          />
        </div>
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

      {!currentUser && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-10 flex items-start gap-4">
          <AlertCircle className="text-amber-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-800">투표 안내</h3>
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

      {filteredProjects.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-500">등록된 프로젝트가 없습니다</h3>
          <p className="text-gray-400 mt-2">첫 번째 프로젝트를 제출해보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => {
            const isRank1 = index === 0 && project.votes > 0;
            const isRank2 = index === 1 && project.votes > 0;
            const isRank3 = index === 2 && project.votes > 0;
            
            const hasVotedForThis = myVotedProjectId === project.id;
            const canVote = currentUser && !myVotedProjectId;
            const isDisabled = currentUser && myVotedProjectId && !hasVotedForThis;

            return (
              <ProjectCard 
                key={project.id}
                project={project}
                isRank1={isRank1}
                isRank2={isRank2}
                isRank3={isRank3}
                hasVotedForThis={hasVotedForThis}
                canVote={!!canVote}
                isDisabled={!!isDisabled}
                onVote={() => handleVoteClick(project.id)}
                onRemoveVote={() => handleRemoveVoteClick()}
                currentUser={currentUser}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// Subcomponent for neatness
function ProjectCard({ 
  project, 
  isRank1, 
  isRank2, 
  isRank3,
  hasVotedForThis,
  canVote,
  isDisabled,
  onVote,
  onRemoveVote,
  currentUser
}: { 
  project: Project, 
  isRank1: boolean, 
  isRank2: boolean, 
  isRank3: boolean,
  hasVotedForThis: boolean,
  canVote: boolean,
  isDisabled: boolean,
  onVote: () => void,
  onRemoveVote: () => void,
  currentUser: User | null
}) {
  return (
    <div className={`relative bg-white rounded-3xl shadow-lg border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl overflow-hidden flex flex-col h-full
      ${isRank1 ? 'border-yellow-400 border-2' : 
        isRank2 ? 'border-slate-300 border-2' : 
        isRank3 ? 'border-amber-600/50 border-2' : 'border-gray-100'}
    `}>
      {/* Ranking Ribbon */}
      {(isRank1 || isRank2 || isRank3) && (
        <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl font-bold text-sm tracking-wide z-10 flex items-center gap-1
          ${isRank1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-950 shadow-sm' : 
            isRank2 ? 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-900 shadow-sm' : 
            'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-sm'}
        `}>
          <Trophy size={14} />
          {isRank1 ? '1위' : isRank2 ? '2위' : '3위'}
        </div>
      )}
      
      {/* Card Content Area */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2 mt-4 cursor-default">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 leading-tight">
            {project.projectName}
          </h3>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600 mb-6 bg-gray-50 px-3 py-2 rounded-lg w-fit">
          <Users size={16} className="text-gray-400" />
          <span className="font-medium text-sm">{project.teamName}</span>
        </div>
        
        <p className="text-xs text-gray-400 mb-6 flex-1 cursor-default">제출자: {project.submitterId.split('_')[0]}</p>
        
        <div className="flex items-center gap-3 mt-auto pt-6 border-t border-gray-100">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition-colors"
          >
            보러가기 <ExternalLink size={18} />
          </a>
          
          {hasVotedForThis ? (
            <button
              onClick={onRemoveVote}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-pink-50 text-pink-600 border border-pink-200 font-bold hover:bg-pink-100 transition-colors"
              title="투표 취소"
            >
              <Heart size={20} className="fill-pink-500 text-pink-500" />
              {project.votes}
            </button>
          ) : (
            <button
              onClick={onVote}
              disabled={isDisabled || !currentUser}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all border
                ${isDisabled || !currentUser
                  ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed opacity-70"
                  : "bg-white text-gray-700 border-gray-200 hover:border-pink-300 hover:text-pink-600 hover:bg-pink-50 shadow-sm active:scale-95"
                }
              `}
              title={
                !currentUser ? "투표하려면 로그인하세요" : 
                isDisabled ? "이미 다른 프로젝트에 투표했습니다" : "이 프로젝트에 투표하기"
              }
            >
              <Heart size={20} />
              {project.votes}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
