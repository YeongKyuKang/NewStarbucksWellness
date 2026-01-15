'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Leaf, Users, Trophy, Coffee, Heart, ArrowRight, Activity, 
  Star, CheckCircle, Menu, X, Share2, MapPin, Clock, Zap, 
  BookOpen, Sun, Crown, Ticket, ShoppingBag, Lock, LogOut, User
} from 'lucide-react';

// --- Types ---
type UserProfile = {
  id: string;
  username: string;
  tier: 'newbie' | 'semipro' | 'pro';
  tickets: number;
  drops: number;
};

// --- Utilities ---
const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

// --- Components ---

// 1. 스타벅스 스타일 로그인 모달
const LoginModal = ({ isOpen, onClose, onLoginSuccess }: any) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // 닉네임
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: username } } // 메타데이터에 닉네임 저장
        });
        if (error) throw error;
        alert("가입 확인 메일을 확인해주세요! (테스트 환경이면 즉시 로그인 시도)");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      onLoginSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-800"><X /></button>
        <div className="text-center mb-6">
          <Leaf className="w-10 h-10 text-emerald-700 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-emerald-900">{isSignUp ? "Welcome to Thrive" : "Welcome Back"}</h2>
          <p className="text-sm text-stone-500">{isSignUp ? "당신의 웰니스 여정을 시작하세요." : "오늘도 건강한 하루 보내세요!"}</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1 ml-1">닉네임 (Call Name)</label>
              <input type="text" placeholder="매장에서 불러드릴 닉네임" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1 ml-1">이메일</label>
            <input type="email" placeholder="hello@thrive.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1 ml-1">비밀번호</label>
            <input type="password" placeholder="******" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
          </div>
          
          {error && <div className="text-red-500 text-xs text-center">{error}</div>}

          <button type="submit" disabled={loading} className="w-full bg-emerald-800 text-white font-bold py-3.5 rounded-full hover:bg-emerald-700 transition-all disabled:opacity-50">
            {loading ? "처리중..." : isSignUp ? "Thrive 가입하기" : "로그인하기"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-xs text-stone-500 underline hover:text-emerald-600">
            {isSignUp ? "이미 계정이 있으신가요? 로그인" : "새로운 멤버이신가요? 회원가입"}
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. 메인 앱 컨테이너
export default function ThriveApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  
  // Data States
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [meetups, setMeetups] = useState<any[]>([]);

  // 초기 데이터 로딩
  useEffect(() => {
    // 1. 세션 체크
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
    });

    // 2. Auth 상태 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setProfile(null);
    });

    // 3. 공통 데이터 로딩
    fetchCommonData();

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) setProfile(data);
  };

  const fetchCommonData = async () => {
    const { data: menu } = await supabase.from('thrive_menu').select('*');
    if (menu) setMenuItems(menu);
    const { data: posts } = await supabase.from('thrive_posts').select('*').order('created_at', { ascending: false });
    if (posts) setCommunityPosts(posts);
    const { data: meets } = await supabase.from('thrive_meetups').select('*');
    if (meets) setMeetups(meets);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert("로그아웃 되었습니다.");
  };

  // --- Render Helpers ---
  
  // 로그인 안했을 때 보여줄 기본 값
  const currentTier = profile?.tier || 'newbie'; 
  const currentTickets = profile?.tickets ?? 2; // 로그인 안하면 기본 2장 보여줌 (유도용)

  // 상단 헤더 (로그인 상태에 따라 변화)
  const Header = () => (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl text-emerald-800 cursor-pointer" onClick={() => setActiveTab('home')}>
          <Leaf className="w-6 h-6" /><span>Thrive</span>
        </div>
        
        {/* 우측 상단: 로그인 상태 표시 */}
        <div className="flex items-center gap-2">
          {!session ? (
            <button onClick={() => setShowLogin(true)} className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors">
              Sign In
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-600 hidden sm:block">Hi, {profile?.username}</span>
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
                {profile?.username?.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 md:hidden text-emerald-800 ml-1">
            {isMenuOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
          </button>
        </div>
      </div>
      
      {/* 모바일 메뉴 */}
      {isMenuOpen && (
         <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-stone-200 shadow-lg py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {[{ id: 'home', label: '홈' }, { id: 'menu', label: '건강 F&B' }, { id: 'community', label: '커뮤니티' }, { id: 'club', label: '웰니스 클럽' }].map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMenuOpen(false); }} className={`text-left text-lg font-medium p-2 rounded-lg ${activeTab === item.id ? 'bg-emerald-50 text-emerald-700' : 'text-stone-600'}`}>{item.label}</button>
          ))}
          {session && (
            <button onClick={handleLogout} className="text-left text-sm font-medium p-2 text-red-500 flex items-center gap-2 border-t border-stone-100 pt-4 mt-2">
              <LogOut className="w-4 h-4" /> 로그아웃
            </button>
          )}
        </div>
      )}
    </nav>
  );

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200">
      <Header />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onLoginSuccess={() => fetchProfile(session?.user?.id)} />

      <main className="max-w-md mx-auto bg-white min-h-[calc(100vh-64px)] shadow-2xl shadow-stone-200 overflow-hidden relative">
        {/* 페이지 컨텐츠 렌더링 */}
        {activeTab === 'home' && (
          <div className="animate-in fade-in duration-500">
            {/* 개인화된 히어로 섹션 */}
            <div className="bg-emerald-900 text-white p-8 pt-12 rounded-b-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <h2 className="text-sm font-semibold tracking-wider text-emerald-300 mb-2 uppercase flex items-center gap-2">
                  {session && <User className="w-4 h-4"/>}
                  {session ? `${getTimeBasedGreeting()}, ${profile?.username || 'Member'}` : "The New Paradigm"}
                </h2>
                <h1 className="text-4xl font-bold mb-4 leading-tight">
                  The more you drink,<br/><span className="text-emerald-400">the more you thrive.</span>
                </h1>
                
                {/* 로그인 상태에 따른 버튼 변화 */}
                {!session ? (
                  <button onClick={() => setShowLogin(true)} className="bg-white text-emerald-900 px-6 py-3 rounded-full font-bold text-sm hover:bg-emerald-50 transition-colors flex items-center gap-2">
                    Start Your Journey <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-emerald-500/30 flex items-center justify-between cursor-pointer hover:bg-white/20 transition-colors" onClick={() => setActiveTab('club')}>
                     <div>
                       <div className="text-[10px] text-emerald-200 mb-1">MY WELLNESS TIER</div>
                       <div className="font-bold text-lg uppercase tracking-wider">{currentTier}</div>
                     </div>
                     <div className="text-right">
                       <div className="text-[10px] text-emerald-200 mb-1">AVAILABLE TICKETS</div>
                       <div className="font-bold text-lg">{currentTickets} <span className="text-xs font-normal opacity-70">EA</span></div>
                     </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* ... 나머지 홈 컨텐츠 (기존과 동일하되 필요시 데이터 연동) ... */}
            <div className="p-6 space-y-8">
               <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 text-center">
                  <h3 className="font-bold text-stone-800 mb-2">오늘의 기분은 어떠신가요?</h3>
                  <div className="flex justify-center gap-4 mt-4">
                    {['😫 피곤해', '😎 집중!', '💪 운동전'].map(mood => (
                      <button key={mood} className="bg-white px-4 py-2 rounded-full text-xs font-bold shadow-sm border border-stone-100 hover:border-emerald-500 hover:text-emerald-600 transition-colors">{mood}</button>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Club Section (User Data 연동) */}
        {activeTab === 'club' && (
           <div className="p-6 pb-24 animate-in slide-in-from-right-4 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-stone-900">Young Wellness Club</h2>
                {session ? (
                   <p className="text-stone-500 text-sm mb-6">{profile?.username}님의 멤버십 현황입니다.</p>
                ) : (
                   <p className="text-stone-500 text-sm mb-6">로그인하고 멤버십 혜택을 확인하세요.</p>
                )}

                <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden mb-8 text-left">
                  {/* ... 멤버십 카드 UI (데이터 연동) ... */}
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                      <div className="text-xs text-stone-400 mb-1">MY MEMBERSHIP</div>
                      <div className="font-mono text-lg tracking-widest text-emerald-400 font-bold capitalize">{currentTier}</div>
                    </div>
                    <Star className="w-6 h-6 text-emerald-500" />
                  </div>
                  
                  {/* 로그인 안했으면 가리기 */}
                  {!session ? (
                    <div className="relative z-10 bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10 text-center">
                       <p className="text-sm font-bold mb-2">회원 전용 혜택입니다.</p>
                       <button onClick={() => setShowLogin(true)} className="text-xs bg-emerald-600 text-white px-4 py-2 rounded-full">로그인하고 확인하기</button>
                    </div>
                  ) : (
                    currentTier === 'newbie' ? (
                      <div className="relative z-10 bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold flex items-center gap-2"><Ticket className="w-4 h-4 text-emerald-300"/> 체험권 잔여</span>
                            <span className="text-xl font-bold">{currentTickets} <span className="text-xs font-normal opacity-70">/ 2</span></span>
                        </div>
                      </div>
                    ) : (
                      // Semipro 이상일 때 Drops 게이지 (스타벅스 별 모으기 느낌)
                      <div className="relative z-10 bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold">D</div><span className="text-sm font-bold">Drops</span></div>
                          <span className="text-xl font-bold">{profile?.drops} <span className="text-xs font-normal opacity-70">/ 50</span></span>
                        </div>
                        <div className="w-full bg-stone-700 h-2 rounded-full overflow-hidden mb-2 relative">
                           <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${(profile?.drops || 0) * 2}%` }}></div>
                        </div>
                        <p className="text-[10px] text-stone-300">
                          {50 - (profile?.drops || 0)} Drops 더 모으면 <span className="text-emerald-300 font-bold">한정판 굿즈</span> 교환 가능!
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
              {/* 플랜 목록 등 하단 컨텐츠 유지 */}
           </div>
        )}
        
        {/* 다른 탭 렌더링... (Menu, Community는 이전 코드와 동일하게 props 전달) */}
        {activeTab === 'menu' && (
          <div className="p-6 animate-in slide-in-from-right-4">
             <h2 className="text-2xl font-bold text-stone-900 mb-6">Health F&B</h2>
             <div className="grid gap-6">
                {menuItems.map(item => (
                  <div key={item.id} className="bg-white border border-stone-100 rounded-3xl p-4 shadow-sm flex gap-4">
                     <div className="w-24 h-24 bg-stone-50 rounded-2xl flex items-center justify-center text-4xl">{item.emoji}</div>
                     <div>
                       <h3 className="font-bold text-lg">{item.name}</h3>
                       <p className="text-xs text-stone-500 line-clamp-2 mb-2">{item.description}</p>
                       <button className="text-xs bg-stone-900 text-white px-3 py-1 rounded-full">담기</button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
        
        {activeTab === 'community' && (
           // Community 컴포넌트에 userTier, newbieTickets 전달 필요
           <div className="p-6">
              <h2 className="text-2xl font-bold text-stone-900 mb-4">Thrive Together</h2>
              {/* 커뮤니티 목록 렌더링 로직... */}
              <div className="text-center text-stone-500 mt-10">
                 {!session && <button onClick={() => setShowLogin(true)} className="underline">로그인</button>} 하고 커뮤니티에 참여해보세요.
              </div>
           </div>
        )}

      </main>

      <div className="fixed bottom-6 right-6 max-w-md mx-auto z-40">
        <button className="bg-emerald-800 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 transition-all hover:scale-105 flex items-center gap-2 group">
          <Coffee className="w-6 h-6" /><span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap">지금 주문하기</span>
        </button>
      </div>
    </div>
  );
}