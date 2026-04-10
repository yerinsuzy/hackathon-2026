import Link from "next/link";
import { Calendar, MapPin, Target, Sparkles, ChevronRight, Clock, ChevronDown } from "lucide-react";
import TopicSection from "@/components/home/TopicSection";
import { getTopicObj } from "@/actions/admin";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const schedule = [
    { time: "10:00 - 11:30", title: "아이디에이션", desc: "주제에 맞춘 아이디어 발상 및 기획" },
    { time: "13:00 - 16:00", title: "바이브코딩", desc: "본격적인 프로토타입 디자인 및 개발" },
    { time: "16:00 - 17:00", title: "완성본 제출 및 쇼케이스", desc: "프로젝트 업로드 및 상호 평가" },
    { time: "17:00 - 17:30", title: "시상 및 마무리", desc: "우수작 발표 및 클로징" },
  ];

  const topicObj = await getTopicObj();
  let parsedTopic = { title: "", description: "" };
  try {
    parsedTopic = JSON.parse(topicObj.content);
  } catch (e) {}

  return (
    <div className="w-full">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
        {/* Abstract shapes for background */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-purple-200/50 blur-3xl filter" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-200/50 blur-3xl filter" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-100 bg-indigo-50/50 text-indigo-700 font-medium text-sm mb-8 backdrop-blur-sm">
            <Sparkles size={16} />
            <span>2026 Product기획실 바이브코딩 해커톤</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8">
            Zero to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Product</span>
          </h1>
          
          <TopicSection initialTopic={parsedTopic} />
          

        </div>
      </section>



      {/* Timeline Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">행사 일정</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">해커톤 당일 진행되는 세부 일정을 확인하세요. 일정은 당일 상황에 따라 변동될 수 있습니다.</p>
        </div>

        <div className="relative border-l-2 border-indigo-100 ml-4 md:ml-8 space-y-12 pb-8">
          {schedule.map((item, index) => (
            <div key={index} className="relative pl-8 md:pl-12">
              <div className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-white border-4 border-indigo-500 shadow-sm" />
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 mb-2">
                <div className="flex items-center gap-1.5 text-indigo-600 font-semibold text-lg bg-indigo-50 px-3 py-1 rounded-md w-fit">
                  <Clock size={16} />
                  {item.time}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
              </div>
              <p className="text-gray-600 text-lg md:ml-28">{item.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-lg mx-auto">
          <Link 
            href="/gallery" 
            className="flex-1 px-8 py-4 rounded-full bg-gray-900 text-white font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-transform active:scale-95 shadow-md"
          >
            제출작 보러가기 <ChevronRight size={18} />
          </Link>
          <Link 
            href="/upload" 
            className="flex-1 px-8 py-4 rounded-full bg-white text-gray-900 border-2 border-gray-200 font-semibold flex items-center justify-center hover:bg-gray-50 transition-transform active:scale-95 shadow-sm"
          >
            프로젝트 제출
          </Link>
        </div>
      </section>
    </div>
  );
}
