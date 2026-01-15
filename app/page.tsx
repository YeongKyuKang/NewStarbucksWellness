'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Supabase 클라이언트 import
import { 
  Leaf, Users, Trophy, Coffee, Heart, ArrowRight, Activity, 
  Star, CheckCircle, Menu, X, Share2, MapPin, Clock, Zap, 
  BookOpen, Sun, Crown, Ticket, ShoppingBag, Lock
} from 'lucide-react';

// --- Sub-Components (데이터를 props로 받도록 수정됨) ---

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
)

const HomeSection = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => (
  <div className="animate-in fade-in duration-500">
    <div className="bg-emerald-900 text-white p-8 pt-12 rounded-b-3xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
      <div className="relative z-10">
        <h2 className="text-sm font-semibold tracking-wider text-emerald-300 mb-2 uppercase">The New Paradigm</h2>
        <h1 className="text-4xl font-bold mb-4 leading-tight">
          The more you drink,<br/>
          <span className="text-emerald-400">the more you thrive.</span>
        </h1>
        <p className="text-emerald-100 mb-8 text-sm leading-relaxed opacity-90">
          단기적 즐거움을 넘어,<br/>당신의 지속 가능한 라이프스타일을 설계합니다.
        </p>
        <button 
          onClick={() => setActiveTab('club')}
          className="bg-white text-emerald-900 px-6 py-3 rounded-full font-bold text-sm hover:bg-emerald-50 transition-colors flex items-center gap-2"
        >
          Young Wellness Club 가입하기 <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>

    <div className="p-6 space-y-8">
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-stone-800 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-600" />
          Why Thrive?
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
            <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center mb-3">
              <Heart className="w-5 h-5 text-orange-600" />
            </div>
            <h4 className="font-bold text-stone-800 mb-1">Health Design</h4>
            <p className="text-xs text-stone-500">즐기면서 챙기는 건강, 죄책감 없는 소비</p>
          </div>
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
            <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-bold text-stone-800 mb-1">Relations</h4>
            <p className="text-xs text-stone-500">함께 성장하는 커뮤니티와 네트워킹</p>
          </div>
        </div>
      </div>

      <div className="bg-stone-900 text-stone-50 p-6 rounded-3xl relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => setActiveTab('community')}>
        <div className="relative z-10 flex flex-col items-center text-center">
           <span className="bg-emerald-500 text-xs font-bold px-2 py-1 rounded mb-2">HOT TREND</span>
           <h3 className="text-2xl font-bold mb-2">나의 Thrive ID 표현하기</h3>
           <p className="text-stone-400 text-sm mb-4">어떤 음료를 마시는지가 당신을 말해줍니다.</p>
           <div className="flex -space-x-2">
             <div className="w-8 h-8 rounded-full bg-stone-700 border-2 border-stone-900 flex items-center justify-center text-xs">A</div>
             <div className="w-8 h-8 rounded-full bg-stone-600 border-2 border-stone-900 flex items-center justify-center text-xs">B</div>
             <div className="w-8 h-8 rounded-full bg-stone-500 border-2 border-stone-900 flex items-center justify-center text-xs">+99</div>
           </div>
        </div>
      </div>
    </div>
  </div>
);

const MenuSection = ({ items }: { items: any[] }) => (
  <div className="p-6 animate-in slide-in-from-right-4 duration-500">
    <div className="flex justify-between items-end mb-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-900">Health F&B</h2>
        <p className="text-stone-500 text-sm">당신의 컨디션을 위한 맞춤 설계</p>
      </div>
    </div>

    <div className="grid gap-6">
      {items.length === 0 ? <p className="text-center text-stone-400">메뉴를 불러오는 중...</p> : items.map(item => (
        <div key={item.id} className="group relative bg-white border border-stone-100 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all flex gap-4">
          <div className="w-24 h-24 bg-stone-50 rounded-2xl flex items-center justify-center text-4xl shrink-0 group-hover:scale-110 transition-transform duration-300">
            {item.emoji}
          </div>
          <div className="flex-1 py-1">
            <div className="flex gap-2 mb-2">
              {item.tags?.map((tag: string) => (
                <span key={tag} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.color_class.replace('text-', 'bg-').replace('100', '50')} ${item.color_class}`}>
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="font-bold text-lg text-stone-800 leading-tight mb-1">{item.name}</h3>
            <p className="text-xs text-stone-500 line-clamp-2">{item.description}</p>
          </div>
          <button className="absolute bottom-4 right-4 bg-stone-900 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
            +
          </button>
        </div>
      ))}
    </div>
    
    <div className="mt-8 bg-emerald-50 p-6 rounded-2xl text-center">
      <h3 className="font-bold text-emerald-900 mb-2">내 몸에 맞는 음료 찾기</h3>
      <p className="text-sm text-emerald-700 mb-4">오늘의 컨디션을 체크하면 AI가 음료를 추천해드려요.</p>
      <button className="w-full bg-white text-emerald-900 border border-emerald-200 py-3 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-colors">
        컨디션 체크 시작하기
      </button>
    </div>
  </div>
);

const CommunitySection = ({ posts, meetups, userTier, newbieTickets }: any) => {
  const [view, setView] = useState('feed');
  const isFeedLocked = userTier === 'newbie';

  return (
    <div className="pb-20 animate-in slide-in-from-right-4 duration-500 relative">
      <div className="sticky top-0 bg-white/95 backdrop-blur z-20 pt-4 border-b border-stone-100">
        <div className="px-6 mb-4">
          <h2 className="text-2xl font-bold text-stone-900">Thrive Together</h2>
          <p className="text-stone-500 text-sm">함께 공유하고, 실제로 만나는 즐거움</p>
        </div>
        <div className="flex px-6 gap-6">
          <button onClick={() => setView('feed')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${view === 'feed' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-stone-400'}`}>
            소셜 피드
          </button>
          <button onClick={() => setView('meetups')} className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-1 ${view === 'meetups' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-stone-400'}`}>
            모임 & 활동 <span className="bg-orange-100 text-orange-600 text-[10px] px-1.5 py-0.5 rounded-full">New</span>
          </button>
        </div>
      </div>

      {view === 'feed' && (
        <div className="relative">
          {isFeedLocked && (
            <div className="absolute inset-0 z-30 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center h-[500px]">
              <div className="bg-stone-900 text-white p-4 rounded-full mb-4 shadow-xl"><Lock className="w-8 h-8" /></div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Semipro 멤버 전용</h3>
              <p className="text-stone-600 text-sm mb-6 max-w-xs">소셜 피드는 Semipro 등급부터 이용 가능합니다.<br/>서로의 루틴을 공유하고 더 큰 동기부여를 얻으세요!</p>
              <button className="bg-emerald-600 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg hover:bg-emerald-700 transition-transform active:scale-95">멤버십 업그레이드 하기</button>
            </div>
          )}

          <div className={`divide-y divide-stone-100 animate-in fade-in duration-300 ${isFeedLocked ? 'blur-sm select-none overflow-hidden h-[500px]' : ''}`}>
            {posts.map((post: any) => (
              <div key={post.id} className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-emerald-400 to-blue-400 rounded-full"></div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-sm text-stone-900">{post.username}</span>
                        <CheckCircle className="w-3 h-3 text-blue-500" />
                      </div>
                      <div className="text-xs text-stone-400">{new Date(post.created_at).toLocaleTimeString()}</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full font-bold">{post.badge}</span>
                </div>
                <div className="bg-stone-100 aspect-square rounded-2xl mb-3 flex items-center justify-center text-stone-300">
                   <span className="text-sm">Image Placeholder</span>
                </div>
                <p className="text-stone-800 text-sm mb-3 leading-relaxed">{post.content}</p>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-stone-500 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" /><span className="text-xs font-medium">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-stone-500 hover:text-blue-500 transition-colors"><Share2 className="w-5 h-5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'meetups' && (
        <div className="p-6 space-y-6 animate-in fade-in duration-300">
          {userTier === 'newbie' && (
             <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3 mb-2">
                <Ticket className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm">Newbie 체험권 잔여: {newbieTickets}회</h4>
                  <p className="text-xs text-emerald-700 mt-1">{newbieTickets > 0 ? "체험권 소진 후에는 멤버십 업그레이드가 필요합니다." : "체험권이 모두 소진되었습니다. 업그레이드하고 계속 즐기세요!"}</p>
                </div>
             </div>
          )}
          
          <div className="space-y-4">
            {meetups.map((meetup: any) => (
              <div key={meetup.id} className="bg-white border border-stone-200 rounded-3xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-32 ${meetup.visual_color_class} flex items-center justify-center relative overflow-hidden`}>
                   <div className="relative z-10 flex flex-col items-center gap-2">
                      {meetup.type === 'Activity' ? <Zap className="w-12 h-12 text-white" /> : meetup.type === 'Study' ? <BookOpen className="w-12 h-12 text-white" /> : <Sun className="w-12 h-12 text-white" />}
                      <span className="text-white/90 font-bold text-lg tracking-wider uppercase">{meetup.type}</span>
                   </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-stone-900 mb-2">{meetup.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-stone-600"><Clock className="w-4 h-4 text-emerald-600" /><span>{meetup.meet_time}</span></div>
                    <div className="flex items-center gap-2 text-xs text-stone-600"><MapPin className="w-4 h-4 text-emerald-600" /><span>{meetup.location}</span></div>
                    <div className="flex items-center gap-2 text-xs text-stone-600"><Users className="w-4 h-4 text-emerald-600" /><span>참여 인원 {meetup.participants_current}/{meetup.participants_max}명</span></div>
                  </div>
                  <button disabled={userTier === 'newbie' && newbieTickets <= 0} className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${userTier === 'newbie' && newbieTickets <= 0 ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : 'bg-emerald-800 text-white hover:bg-emerald-700'}`}>
                    {userTier === 'newbie' && newbieTickets <= 0 ? '체험 횟수 초과 (멤버십 필요)' : '참여 신청하기'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ClubSection = ({ badges, plans, goods, userTier, newbieTickets }: any) => (
  <div className="p-6 pb-24 animate-in slide-in-from-right-4 duration-500">
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-stone-900">Young Wellness Club</h2>
      <p className="text-stone-500 text-sm mb-6">나에게 딱 맞는 멤버십을 선택하세요</p>
      
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden mb-8 text-left">
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div><div className="text-xs text-stone-400 mb-1">MY MEMBERSHIP</div><div className="font-mono text-lg tracking-widest text-emerald-400 font-bold capitalize">{userTier}</div></div>
          <Star className="w-6 h-6 text-emerald-500" />
        </div>
        
        {userTier === 'newbie' ? (
           <div className="relative z-10 bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10">
             <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold flex items-center gap-2"><Ticket className="w-4 h-4 text-emerald-300"/> 체험권 잔여</span>
                <span className="text-xl font-bold">{newbieTickets} <span className="text-xs font-normal opacity-70">/ 2</span></span>
             </div>
           </div>
        ) : (
          <div className="relative z-10 bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10">
             <div className="flex justify-between items-center mb-2">
               <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold">D</div><span className="text-sm font-bold">Thrive Drops</span></div>
               <span className="text-xl font-bold">24 <span className="text-xs font-normal opacity-70">/ 50</span></span>
             </div>
             <div className="w-full bg-stone-700 h-2 rounded-full overflow-hidden mb-2"><div className="bg-emerald-500 h-full w-[48%]"></div></div>
          </div>
        )}
      </div>
    </div>

    <div className="mb-10">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Ticket className="w-5 h-5 text-emerald-600" />Membership Plans</h3>
      <div className="space-y-4">
        {plans.map((plan: any) => (
           <div key={plan.id} className={`relative border rounded-3xl p-5 ${plan.color} ${plan.recommended ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}`}>
            {plan.recommended && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">Starbucks Buddy Pass 연동</span>}
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                 <div className={`p-2 rounded-full ${plan.id === 'pro' ? 'bg-stone-800' : 'bg-white/50'}`}>{plan.icon}</div>
                 <h4 className="font-bold text-lg">{plan.name}</h4>
              </div>
              <div className="text-right"><span className="block font-bold text-xl">{plan.price}</span><span className="text-xs opacity-70">{plan.period}</span></div>
            </div>
            <ul className="space-y-2 mt-4 mb-4">
              {plan.features.map((feature: string, idx: number) => (<li key={idx} className="flex items-start gap-2 text-sm opacity-90"><CheckCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{feature}</span></li>))}
            </ul>
            <button className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${plan.id === 'pro' ? 'bg-yellow-400 text-stone-900 hover:bg-yellow-300' : plan.id === 'semipro' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-white text-stone-900 border border-stone-200 hover:bg-stone-50'}`}>{plan.id === userTier ? '현재 이용중' : '변경하기'}</button>
          </div>
        ))}
      </div>
    </div>

    <div className="mb-8">
      <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg flex items-center gap-2"><Trophy className="w-5 h-5 text-orange-500" />My Badges</h3></div>
      <div className="space-y-4">
        {badges.map((badge: any) => (
          <div key={badge.id} className={`border rounded-2xl p-4 flex items-center gap-4 ${badge.completed ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-stone-100'}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${badge.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-100 text-stone-400'}`}>{badge.icon}</div>
            <div className="flex-1">
              <div className="flex justify-between mb-1"><h4 className={`font-bold text-sm ${badge.completed ? 'text-emerald-900' : 'text-stone-600'}`}>{badge.name}</h4>{badge.completed && <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full">획득완료</span>}</div>
              <p className="text-xs text-stone-500 mb-2">{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- Main App Component ---

export default function ThriveApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // State from Database
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [meetups, setMeetups] = useState<any[]>([]);
  
  // Local User State (나중에 Auth 연동 시 DB에서 가져올 부분)
  const [userTier, setUserTier] = useState('semipro'); // 'newbie' | 'semipro' | 'pro'
  const [newbieTickets, setNewbieTickets] = useState(2);

  // Static Data (변경이 적은 데이터는 상수로 유지 혹은 추후 DB화)
  const badges = [
    { id: 1, name: "모닝 리추얼", desc: "오전 9시 이전 방문 5회", icon: <SunIcon />, progress: 80 },
    { id: 2, name: "슈가 커터", desc: "Low Sugar 음료 10잔 달성", icon: <CheckCircle className="w-5 h-5" />, progress: 40 },
    { id: 3, name: "커뮤니티 리더", desc: "피드 공유 3회", icon: <Users className="w-5 h-5" />, progress: 100, completed: true }
  ];

  const goods = [
    { id: 1, name: "Thrive 홈트 요가매트", cost: "30 Drops", img: "🧘‍♀️" },
    { id: 2, name: "친환경 덤벨 세트", cost: "50 Drops", img: "💪" },
    { id: 3, name: "식물성 프로틴 쉐이커", cost: "15 Drops", img: "🥛" }
  ];

  const plans = [
    { id: 'newbie', name: "Wellness Newbie", price: "Free", period: "기본 멤버십", color: "bg-stone-100 text-stone-900 border-stone-200", features: ["가입 즉시 커뮤니티 2회 무료 체험", "체험권 소진 시 커뮤니티 참여 제한", "🎂 생일 선물: 커뮤니티 1회 이용권", "기본 건강 배지 획득 가능"], icon: <Leaf className="w-6 h-6" />, recommended: false },
    { id: 'semipro', name: "Wellness Semipro", price: "₩9,900", period: "/ month", color: "bg-emerald-50 text-emerald-900 border-emerald-200", features: ["★ Starbucks Buddy Pass 연동 가능", "소셜 피드 무제한 이용 (작성/공유)", "커뮤니티 활동 무제한 참여", "2주 1회 음료 & 디저트 무료"], icon: <Star className="w-6 h-6 text-emerald-600" />, recommended: true },
    { id: 'pro', name: "Wellness Pro", price: "₩29,900", period: "/ month", color: "bg-stone-900 text-white border-stone-900", features: ["Semipro 혜택 전체 포함", "3일마다 1회 음료 쿠폰 (월 최대 10회)", "신메뉴 선공개 시음회 초대", "커뮤니티 우선 예약권"], icon: <Crown className="w-6 h-6 text-yellow-400" />, recommended: false }
  ];

  // Supabase Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Menu
      const { data: menuData } = await supabase.from('thrive_menu').select('*');
      if (menuData) setMenuItems(menuData);

      // 2. Fetch Posts
      const { data: postData } = await supabase.from('thrive_posts').select('*').order('created_at', { ascending: false });
      if (postData) setCommunityPosts(postData);

      // 3. Fetch Meetups
      const { data: meetupData } = await supabase.from('thrive_meetups').select('*');
      if (meetupData) setMeetups(meetupData);
    };

    fetchData();
  }, []);

  const renderContent = () => {
    switch(activeTab) {
      case 'home': return <HomeSection setActiveTab={setActiveTab} />;
      case 'menu': return <MenuSection items={menuItems} />;
      case 'community': return <CommunitySection posts={communityPosts} meetups={meetups} userTier={userTier} newbieTickets={newbieTickets} />;
      case 'club': return <ClubSection badges={badges} plans={plans} goods={goods} userTier={userTier} newbieTickets={newbieTickets} />;
      default: return <HomeSection setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-emerald-800 cursor-pointer" onClick={() => setActiveTab('home')}>
            <Leaf className="w-6 h-6" /><span>Thrive</span>
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 md:hidden text-emerald-800">{isMenuOpen ? <X /> : <Menu />}</button>
          <div className="hidden md:flex gap-6 font-medium text-stone-600">
            {['Home', 'Menu', 'Community', 'Club'].map((item) => (
              <button key={item} onClick={() => setActiveTab(item.toLowerCase())} className={`hover:text-emerald-600 transition-colors ${activeTab === item.toLowerCase() ? 'text-emerald-600' : ''}`}>{item}</button>
            ))}
          </div>
        </div>
        {isMenuOpen && (
           <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-stone-200 shadow-lg py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
            {[{ id: 'home', label: '홈' }, { id: 'menu', label: '건강 F&B' }, { id: 'community', label: '커뮤니티' }, { id: 'club', label: '웰니스 클럽' }].map((item) => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMenuOpen(false); }} className={`text-left text-lg font-medium p-2 rounded-lg ${activeTab === item.id ? 'bg-emerald-50 text-emerald-700' : 'text-stone-600'}`}>{item.label}</button>
            ))}
          </div>
        )}
      </nav>

      <main className="max-w-md mx-auto bg-white min-h-[calc(100vh-64px)] shadow-2xl shadow-stone-200 overflow-hidden">
        {renderContent()}
      </main>

      <div className="fixed bottom-6 right-6 max-w-md mx-auto z-40">
        <button className="bg-emerald-800 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 transition-all hover:scale-105 flex items-center gap-2 group">
          <Coffee className="w-6 h-6" /><span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap">지금 주문하기</span>
        </button>
      </div>
    </div>
  );
}