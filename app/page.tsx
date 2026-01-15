'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, Users, Trophy, Coffee, Heart, ArrowRight, Activity, 
  Star, CheckCircle, Menu, X, Share2, MapPin, Clock, Zap, 
  BookOpen, Sun, Crown, Ticket, ShoppingBag, Lock, LogOut, User, ChevronRight, Flame, ChevronLeft,
  Utensils, Carrot, ChevronDown, AlertCircle, Check
} from 'lucide-react';

// --- Types ---
type UserProfile = {
  id: string;
  username: string;
  tier: 'newbie' | 'semipro' | 'pro';
  tickets: number;
  drops: number;
};

type ToastType = 'success' | 'error' | 'info';

// --- Images (Verified & Matched) ---
const IMAGES = {
  hero_main: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1000&auto=format&fit=crop", 
  hero_run: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=800&auto=format&fit=crop", 
  hero_order: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop", 
  activity_yoga: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=600&auto=format&fit=crop",
  activity_run: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=600&auto=format&fit=crop",
  activity_study: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop",
  avatar_def: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
};

// --- DATA: Menu & Stores ---
const FULL_MENU_ITEMS = [
  { id: 'd1', category: 'drink', name: "프로틴 말차 부스트", desc: "제주 유기농 말차와 식물성 단백질 20g", tags: ["High Protein"], color_class: "bg-green-100 text-green-800", img: "https://images.unsplash.com/photo-1515825838458-f2a94b20105a?q=80&w=600&auto=format&fit=crop" },
  { id: 'd2', category: 'drink', name: "ABC 클렌즈 주스", desc: "사과, 비트, 당근 착즙 100%", tags: ["Detox"], color_class: "bg-red-100 text-red-800", img: "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=600&auto=format&fit=crop" },
  { id: 'd3', category: 'drink', name: "브레인 포커스 콜드브루", desc: "L-테아닌 첨가로 깔끔한 집중력", tags: ["Focus"], color_class: "bg-blue-100 text-blue-800", img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600&auto=format&fit=crop" },
  { id: 'd4', category: 'drink', name: "케일 & 사과 스무디", desc: "식이섬유 가득한 그린 에너지", tags: ["Fiber"], color_class: "bg-emerald-100 text-emerald-800", img: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=600&auto=format&fit=crop" },
  { id: 'd5', category: 'drink', name: "오트 바닐라 라떼", desc: "귀리 우유로 만든 가벼운 라떼", tags: ["Vegan"], color_class: "bg-orange-50 text-orange-800", img: "https://images.unsplash.com/photo-1638255967069-425d57635293?q=80&w=600&auto=format&fit=crop" },
  { id: 'd6', category: 'drink', name: "유자 민트 티", desc: "상큼한 유자와 시원한 민트의 조화", tags: ["Refresh"], color_class: "bg-yellow-100 text-yellow-800", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=600&auto=format&fit=crop" },
  { id: 'd7', category: 'drink', name: "블루베리 요거트", desc: "생 블루베리를 갈아넣은 요거트", tags: ["Antioxidant"], color_class: "bg-purple-100 text-purple-800", img: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?q=80&w=600&auto=format&fit=crop" },
  { id: 'd8', category: 'drink', name: "진저 레몬 샷", desc: "면역력을 높이는 따뜻한 한 잔", tags: ["Immunity"], color_class: "bg-amber-100 text-amber-800", img: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=600&auto=format&fit=crop" },
  { id: 'd9', category: 'drink', name: "아보카도 바나나", desc: "든든한 식사 대용 쉐이크", tags: ["Meal"], color_class: "bg-lime-100 text-lime-800", img: "https://images.unsplash.com/photo-1563583649-6f5df9cb6835?q=80&w=600&auto=format&fit=crop" },
  { id: 'd10', category: 'drink', name: "콤부차 에이드", desc: "장 건강을 위한 발효 탄산음료", tags: ["Probiotic"], color_class: "bg-rose-100 text-rose-800", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600&auto=format&fit=crop" },
  { id: 'd11', category: 'drink', name: "캐모마일 릴렉서", desc: "스트레스 완화를 위한 허브티", tags: ["Relax"], color_class: "bg-teal-50 text-teal-800", img: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=80&w=600&auto=format&fit=crop" },
  { id: 'd12', category: 'drink', name: "제로 슈가 라임", desc: "칼로리 걱정 없는 탄산", tags: ["0 Kcal"], color_class: "bg-stone-100 text-stone-600", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop" },
  { id: 'f1', category: 'food', name: "비건 두부 브라우니", desc: "밀가루 없이 두부로 만든 꾸덕함", tags: ["No Flour"], color_class: "bg-stone-100 text-stone-800", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476d?q=80&w=600&auto=format&fit=crop" },
  { id: 'f2', category: 'food', name: "그릭 요거트 자", desc: "제철 과일과 그래놀라 토핑", tags: ["Protein"], color_class: "bg-white border border-stone-200 text-stone-800", img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=600&auto=format&fit=crop" },
  { id: 'f3', category: 'food', name: "치아씨드 푸딩", desc: "오메가3 가득한 슈퍼푸드 간식", tags: ["Superfood"], color_class: "bg-indigo-50 text-indigo-800", img: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=600&auto=format&fit=crop" },
  { id: 'f4', category: 'food', name: "당근 쌀 케이크", desc: "국내산 쌀가루로 만든 건강 케이크", tags: ["Gluten Free"], color_class: "bg-orange-50 text-orange-800", img: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=600&auto=format&fit=crop" },
  { id: 'f5', category: 'food', name: "다크 초콜릿 바크", desc: "견과류가 듬뿍 들어간 72% 카카오", tags: ["Low Sugar"], color_class: "bg-stone-800 text-stone-100", img: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=600&auto=format&fit=crop" },
  { id: 's1', category: 'salad', name: "수비드 닭가슴살", desc: "부드러운 닭가슴살과 퀴노아", tags: ["High Protein"], color_class: "bg-green-50 text-green-800", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop" },
  { id: 's2', category: 'salad', name: "연어 아보카도 포케", desc: "신선한 연어와 크리미한 아보카도", tags: ["Omega 3"], color_class: "bg-orange-50 text-orange-800", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop" },
  { id: 's3', category: 'salad', name: "리코타 과일 샐러드", desc: "매장에서 직접 만든 리코타 치즈", tags: ["Vegetarian"], color_class: "bg-rose-50 text-rose-800", img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600&auto=format&fit=crop" },
  { id: 's4', category: 'salad', name: "단호박 에그 샐러드", desc: "가볍지만 든든한 한 끼", tags: ["Light"], color_class: "bg-yellow-50 text-yellow-800", img: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?q=80&w=600&auto=format&fit=crop" },
];

const STORES = [
  { id: 1, name: "Thrive 강남 스테이션", distance: "120m", status: "혼잡", tag: "도심 속 힐링", color: "red" },
  { id: 2, name: "Thrive 한강 공원", distance: "2.4km", status: "여유", tag: "러닝 크루 핫플", color: "green" },
  { id: 3, name: "Thrive 더종로 R", distance: "5.1km", status: "보통", tag: "딥 워크 성지", color: "yellow" },
  { id: 4, name: "Thrive 북한산 포레스트", distance: "12km", status: "여유", tag: "숲 속 요가", color: "green" },
];

// --- ⭐️ DEFINED SHARED COMPONENTS (Fixed Position) ---
const Badge = ({ children, color = "bg-black", textColor = "text-white" }: any) => (
  <span className={`${color} ${textColor} text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider`}>
    {children}
  </span>
);

const SectionHeader = ({ title, sub, linkText, onClick }: any) => (
  <div className="flex justify-between items-end mb-4 px-1">
    <div>
      <h2 className="text-xl font-bold text-stone-900 leading-tight">{title}</h2>
      {sub && <p className="text-xs text-stone-500 mt-1">{sub}</p>}
    </div>
    {linkText && (
      <button onClick={onClick} className="text-xs font-bold text-emerald-600 flex items-center hover:underline">
        {linkText} <ChevronRight className="w-3 h-3" />
      </button>
    )}
  </div>
);

// --- Toast Component ---
const ToastContainer = ({ toasts, removeToast }: { toasts: any[], removeToast: (id: number) => void }) => {
  return (
    <div className="fixed top-4 left-0 right-0 z-[100] flex flex-col items-center gap-2 pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-full shadow-xl border backdrop-blur-md min-w-[300px] max-w-sm ${
              toast.type === 'success' ? 'bg-white/90 border-emerald-200 text-emerald-900' :
              toast.type === 'error' ? 'bg-white/90 border-red-200 text-red-900' :
              'bg-white/90 border-blue-200 text-blue-900'
            }`}
          >
            <div className={`p-1 rounded-full ${
              toast.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
              toast.type === 'error' ? 'bg-red-100 text-red-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              {toast.type === 'success' ? <CheckCircle className="w-4 h-4"/> :
               toast.type === 'error' ? <AlertCircle className="w-4 h-4"/> : <Activity className="w-4 h-4"/>}
            </div>
            <span className="text-sm font-bold flex-1">{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// --- Store Selector Modal ---
const StoreSelector = ({ isOpen, onClose, currentStore, onSelect }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <motion.div 
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        className="bg-white w-full max-w-md rounded-t-3xl p-6 pb-10 shadow-2xl relative max-h-[80vh] overflow-y-auto"
      >
        <div className="w-12 h-1.5 bg-stone-200 rounded-full mx-auto mb-6"></div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-stone-900">매장 선택</h2>
          <button onClick={onClose}><X className="text-stone-400" /></button>
        </div>

        <div className="space-y-3">
          {STORES.map((store) => (
            <div 
              key={store.id} 
              onClick={() => { onSelect(store); onClose(); }}
              className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${currentStore.id === store.id ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-stone-100 bg-white hover:bg-stone-50'}`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-stone-900">{store.name}</h3>
                  {currentStore.id === store.id && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <MapPin className="w-3 h-3" /> {store.distance}
                  <span className="w-0.5 h-3 bg-stone-300"></span>
                  <span className={`${store.color === 'red' ? 'text-red-500' : store.color === 'green' ? 'text-emerald-500' : 'text-yellow-600'} font-bold`}>{store.status}</span>
                </div>
              </div>
              <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-1 rounded-full font-bold">
                {store.tag}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// --- Starbucks Auth Modal ---
const StarbucksAuthModal = ({ isOpen, onClose, onLoginSuccess, showToast }: any) => {
  const [loading, setLoading] = useState(false);

  const handleStarbucksConnect = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(); 
      onClose();
      showToast("강민지님, 환영합니다!", "success");
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <motion.div 
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col items-center text-center"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-stone-300 hover:text-stone-800 transition-colors"><X /></button>
        
        <div className="w-16 h-16 bg-emerald-800 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <Leaf className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-stone-900 mb-2">Thrive with Starbucks</h2>
        <p className="text-stone-500 text-sm mb-8 leading-relaxed">
          기존 스타벅스 계정을 연동하면<br/>
          별도 가입 없이 바로 이용할 수 있습니다.
        </p>

        <button 
          onClick={handleStarbucksConnect}
          disabled={loading}
          className="w-full bg-[#00704A] text-white py-4 rounded-full font-bold text-lg hover:bg-[#005c3d] transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>정보 불러오는 중...</span>
            </>
          ) : (
            <>
              <span>Starbucks 계정으로 계속하기</span>
            </>
          )}
        </button>

        <p className="text-[10px] text-stone-400 mt-6">
          계정이 없으신가요? 위 버튼을 누르면 스타벅스 통합 회원가입으로 이동합니다.
        </p>
      </motion.div>
    </div>
  );
};

// --- Section Components ---

const HomeSection = ({ setActiveTab, userTier, userName, onLoginClick }: any) => {
  const isGuest = userTier === 'guest';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="bg-stone-900 text-white text-[10px] py-2 overflow-hidden whitespace-nowrap mb-2">
        <motion.div animate={{ x: ["100%", "-100%"] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="inline-flex items-center gap-8">
          <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500" /> 강남점 요가 클래스 마감임박</span>
          <span>•</span>
          <span>신메뉴 '프로틴 쉐이크' 출시 기념 1+1</span>
          <span>•</span>
          <span>이번 주말 한강 러닝 크루 모집 중</span>
        </motion.div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3 aspect-[4/5] md:aspect-[2/1]">
          <motion.div 
            onClick={() => setActiveTab('club')}
            className="col-span-2 relative rounded-3xl p-6 overflow-hidden flex flex-col justify-between min-h-[240px] cursor-pointer group shadow-lg"
          >
            <div className="absolute inset-0 z-0">
               <img src={IMAGES.hero_main} alt="Wellness" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            </div>

            <div className="relative z-10">
              <Badge color={isGuest ? "bg-stone-600" : "bg-emerald-500"} textColor="text-white">
                {isGuest ? "WELCOME" : "MY STATUS"}
              </Badge>
              <h1 className="text-3xl font-bold text-white mt-3 leading-tight drop-shadow-lg">
                {isGuest ? (
                  <>Start Your<br/><span className="text-emerald-300">Wellness Journey</span></>
                ) : (
                  <>Hello, {userName}<br/><span className="text-emerald-300">Ready to Thrive?</span></>
                )}
              </h1>
              {!isGuest && <p className="text-emerald-100 text-xs mt-2 font-medium">현재 등급: <span className="font-bold uppercase text-white bg-white/20 px-2 py-0.5 rounded ml-1 backdrop-blur-sm">{userTier}</span></p>}
            </div>
            
            <div className="relative z-10 flex items-center justify-between mt-4">
               {isGuest ? (
                 <button onClick={(e) => { e.stopPropagation(); onLoginClick(); }} className="bg-emerald-500 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-900/50">
                   Starbucks 연동하기
                 </button>
               ) : (
                 <>
                   <div className="flex -space-x-2">
                     <img src={IMAGES.avatar_def} className="w-8 h-8 rounded-full border-2 border-emerald-900 object-cover" alt="User" />
                     <div className="w-8 h-8 rounded-full bg-stone-800 border-2 border-emerald-900 flex items-center justify-center text-white text-[10px]">+2k</div>
                   </div>
                   <button className="bg-white/90 backdrop-blur text-emerald-900 px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 group-hover:bg-white transition-colors shadow-lg">
                     Club 혜택 보기 <ArrowRight className="w-4 h-4" />
                   </button>
                 </>
               )}
            </div>
          </motion.div>

          <motion.div onClick={() => setActiveTab('community')} className="relative rounded-3xl p-4 flex flex-col justify-between overflow-hidden group cursor-pointer shadow-md h-40">
             <img src={IMAGES.hero_run} className="absolute inset-0 w-full h-full object-cover brightness-[0.7] group-hover:scale-110 transition-transform duration-500" alt="Run" />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
             <div className="relative z-10 flex justify-end">
               <span className="flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
               </span>
             </div>
             <div className="relative z-10">
               <div className="text-[10px] font-bold text-orange-400 mb-1">COMMUNITY</div>
               <div className="font-bold text-white text-sm leading-tight drop-shadow-md">참여할 커뮤니티<br/>확인하기</div>
             </div>
          </motion.div>

          <motion.div onClick={() => setActiveTab('menu')} className="relative rounded-3xl p-4 flex flex-col justify-between group cursor-pointer shadow-md h-40">
             <img src={IMAGES.hero_order} className="absolute inset-0 w-full h-full object-cover brightness-[0.7] group-hover:scale-110 transition-transform duration-500" alt="Order" />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
             <div className="relative z-10">
               <Badge color="bg-white/20 backdrop-blur" textColor="text-white">ORDER</Badge>
             </div>
             <div className="relative z-10">
               <div className="font-bold text-white text-sm leading-tight drop-shadow-md">주문하기</div>
               <div className="text-[10px] text-stone-300">나만의 메뉴 찾기 &rarr;</div>
             </div>
          </motion.div>
        </div>

        <div>
          <SectionHeader title="Thrive Together" sub="지금 가장 핫한 오프라인 모임" linkText="전체보기" onClick={() => setActiveTab('community')} />
          <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar snap-x px-1">
             {[
               { title: "루프탑 요가", time: "Sat 08:00", img: IMAGES.activity_yoga, loc: "강남점" },
               { title: "나이트 러닝", time: "Wed 20:00", img: IMAGES.activity_run, loc: "광화문" },
               { title: "딥 워크", time: "Mon 19:00", img: IMAGES.activity_study, loc: "더종로R" }
             ].map((act, idx) => (
               <div key={idx} className="min-w-[160px] snap-center relative rounded-2xl overflow-hidden aspect-[4/3] group cursor-pointer shadow-md" onClick={() => setActiveTab('community')}>
                  <img src={act.img} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={act.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                     <div className="font-bold text-sm text-white drop-shadow-md">{act.title}</div>
                     <div className="text-[10px] text-stone-300 flex items-center gap-1"><MapPin className="w-3 h-3"/> {act.loc}</div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuSection = ({ showToast }: { showToast: Function }) => {
  const [category, setCategory] = useState('drink');
  const filteredItems = FULL_MENU_ITEMS.filter(item => item.category === category);

  return (
    <div className="p-6 pb-24 animate-in slide-in-from-right-4 duration-500">
      <SectionHeader title="Health F&B" sub="당신의 컨디션을 위한 맞춤 설계" />
      <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar">
        {[
          { id: 'drink', label: 'Healthy Drink', icon: <Coffee className="w-4 h-4"/> },
          { id: 'food', label: 'Wellness Dessert', icon: <Utensils className="w-4 h-4"/> },
          { id: 'salad', label: 'Fresh Food', icon: <Carrot className="w-4 h-4"/> }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setCategory(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              category === tab.id 
                ? 'bg-emerald-800 text-white shadow-md' 
                : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
      <div className="grid gap-6">
        <AnimatePresence mode='popLayout'>
          {filteredItems.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="group relative bg-white border border-stone-100 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all flex gap-4 overflow-hidden cursor-pointer"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-stone-50">
                <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
              </div>
              <div className="flex-1 py-1 z-10">
                <div className="flex gap-2 mb-2">
                  {item.tags?.map((tag: string) => (
                    <span key={tag} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.color_class.replace('text-', 'bg-').replace('100', '50')} ${item.color_class}`}>
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="font-bold text-lg text-stone-800 leading-tight mb-1">{item.name}</h3>
                <p className="text-xs text-stone-500 line-clamp-2">{item.desc}</p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  showToast(`${item.name} 담기 완료!`, "success");
                }}
                className="absolute bottom-4 right-4 bg-stone-900 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors z-20"
              >
                +
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const CommunitySection = ({ posts, meetups, userTier, newbieTickets, showToast }: any) => {
  const [view, setView] = useState('meetups');
  const isGuest = userTier === 'guest';
  const isFeedLocked = userTier === 'newbie' || isGuest;

  return (
    <div className="pb-24 animate-in slide-in-from-right-4 duration-500 relative">
      <div className="sticky top-0 bg-white/95 backdrop-blur z-20 pt-4 border-b border-stone-100">
        <div className="px-6 mb-4">
          <h2 className="text-2xl font-bold text-stone-900">Thrive Together</h2>
          <p className="text-stone-500 text-sm">함께 성장하는 커뮤니티</p>
        </div>
        <div className="flex px-6 gap-6">
          <button onClick={() => setView('meetups')} className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-1 ${view === 'meetups' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-stone-400'}`}>
            모임 & 활동 <Badge color="bg-orange-100" textColor="text-orange-600">New</Badge>
          </button>
          <button onClick={() => setView('feed')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${view === 'feed' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-stone-400'}`}>
            소셜 피드
          </button>
        </div>
      </div>

      {view === 'meetups' && (
        <div className="p-6 space-y-6 animate-in fade-in duration-300">
          {!isGuest && userTier === 'newbie' && (
             <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3 mb-2">
                <Ticket className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm">Newbie 체험권 잔여: {newbieTickets}회</h4>
                  <p className="text-xs text-emerald-700 mt-1">{newbieTickets > 0 ? "체험권 소진 후에는 멤버십 업그레이드가 필요합니다." : "체험권 소진. 업그레이드 필요"}</p>
                </div>
             </div>
          )}
          
          <div className="space-y-4">
            {meetups.length === 0 ? <p className="text-center text-stone-400">등록된 모임이 없습니다.</p> : meetups.map((meetup: any, idx: number) => (
              <div key={meetup.id} className="bg-white border border-stone-200 rounded-3xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-32 relative">
                   <img 
                    src={idx % 2 === 0 ? IMAGES.activity_run : IMAGES.activity_study} 
                    className="absolute inset-0 w-full h-full object-cover" 
                    alt="Meetup" 
                   />
                   <div className="absolute inset-0 bg-black/40"></div>
                   <div className="absolute bottom-3 left-3 text-white">
                      <span className="text-[10px] bg-white/20 backdrop-blur px-2 py-0.5 rounded font-bold uppercase tracking-wider mb-1 inline-block">{meetup.type}</span>
                      <h3 className="font-bold text-lg leading-none">{meetup.title}</h3>
                   </div>
                </div>
                <div className="p-5">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-stone-600"><Clock className="w-4 h-4 text-emerald-600" /><span>{meetup.meet_time}</span></div>
                    <div className="flex items-center gap-2 text-xs text-stone-600"><MapPin className="w-4 h-4 text-emerald-600" /><span>{meetup.location}</span></div>
                    <div className="flex items-center gap-2 text-xs text-stone-600"><Users className="w-4 h-4 text-emerald-600" /><span>참여 인원 {meetup.participants_current}/{meetup.participants_max}명</span></div>
                  </div>
                  <button 
                    onClick={() => {
                        if(isGuest) showToast("로그인이 필요합니다.", "error");
                        else if(userTier === 'newbie' && newbieTickets <= 0) showToast("체험권이 모두 소진되었습니다.", "error");
                        else showToast("참여 신청이 완료되었습니다!", "success");
                    }}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${(userTier === 'newbie' && newbieTickets <= 0) || isGuest ? 'bg-stone-200 text-stone-400' : 'bg-emerald-800 text-white hover:bg-emerald-700'}`}
                  >
                    {isGuest ? '로그인 후 참여 가능' : (userTier === 'newbie' && newbieTickets <= 0 ? '멤버십 필요' : '참여 신청하기')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'feed' && (
        <div className="relative">
          {isFeedLocked && (
            <div className="absolute inset-0 z-30 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center h-[500px]">
              <div className="bg-stone-900 text-white p-4 rounded-full mb-4 shadow-xl"><Lock className="w-8 h-8" /></div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">{isGuest ? "로그인 필요" : "Semipro 멤버 전용"}</h3>
              <p className="text-stone-600 text-sm mb-6">{isGuest ? "커뮤니티를 보려면 로그인해주세요." : "소셜 피드는 Semipro 등급부터 이용 가능합니다."}</p>
              <button 
                onClick={() => showToast(isGuest ? "상단 로그인 버튼을 이용해주세요." : "멤버십 탭에서 업그레이드 가능합니다.", "info")}
                className="bg-emerald-600 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg"
              >
                {isGuest ? "로그인하기" : "업그레이드"}
              </button>
            </div>
          )}
          <div className={`divide-y divide-stone-100 animate-in fade-in duration-300 ${isFeedLocked ? 'blur-sm select-none overflow-hidden h-[500px]' : ''}`}>
            {posts.map((post: any, idx: number) => (
              <div key={post.id} className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <img src={IMAGES.avatar_def} className="w-10 h-10 rounded-full object-cover border border-stone-200" alt="User" />
                    <div>
                      <div className="flex items-center gap-1"><span className="font-bold text-sm text-stone-900">{post.username}</span><CheckCircle className="w-3 h-3 text-blue-500" /></div>
                      <div className="text-xs text-stone-400">{new Date(post.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full font-bold">{post.badge}</span>
                </div>
                <p className="text-stone-800 text-sm mb-3 leading-relaxed">{post.content}</p>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-stone-500 hover:text-red-500"><Heart className="w-5 h-5" /><span className="text-xs font-medium">{post.likes}</span></button>
                  <button className="flex items-center gap-1 text-stone-500"><Share2 className="w-5 h-5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ClubSection = ({ badges, plans, userTier, newbieTickets, drops, onUpgrade, onLoginClick, showToast }: any) => {
  const isGuest = userTier === 'guest';

  return (
    <div className="p-6 pb-24 animate-in slide-in-from-right-4 duration-500">
      <SectionHeader title="Young Wellness Club" sub="나에게 딱 맞는 멤버십을 선택하세요" />
        
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden mb-8 text-left transition-all duration-500 min-h-[180px] flex flex-col justify-center">
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500 rounded-full blur-[60px] opacity-20 -mr-10 -mt-10"></div>
        
        {isGuest ? (
           <div className="relative z-10 text-center">
              <h3 className="font-bold text-xl mb-2">로그인이 필요해요</h3>
              <p className="text-stone-300 text-sm mb-4">멤버십에 가입하고 Thrive만의 혜택을 누려보세요.</p>
              <button onClick={onLoginClick} className="bg-emerald-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-emerald-500 transition-colors">Starbucks 연동하기</button>
           </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div><div className="text-xs text-stone-400 mb-1">MY MEMBERSHIP</div><div className="font-mono text-xl tracking-widest text-emerald-400 font-bold capitalize">{userTier}</div></div>
              <Star className="w-6 h-6 text-emerald-500" />
            </div>
            
            {userTier === 'newbie' ? (
                <div className="relative z-10 bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold flex items-center gap-2"><Ticket className="w-4 h-4 text-emerald-300"/> 체험권 잔여</span>
                    <span className="text-xl font-bold">{newbieTickets} <span className="text-xs font-normal opacity-70">/ 2</span></span>
                  </div>
                  <p className="text-[10px] text-stone-300">Semipro로 업그레이드하고 무제한으로 즐기세요!</p>
                </div>
            ) : (
              <div className="relative z-10 bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold">D</div><span className="text-sm font-bold">Drops</span></div>
                    <span className="text-xl font-bold">{drops} <span className="text-xs font-normal opacity-70">/ 50</span></span>
                  </div>
                  <div className="w-full bg-stone-700 h-2 rounded-full overflow-hidden mb-2"><div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${(drops/50)*100}%` }}></div></div>
                  <p className="text-[10px] text-stone-300">{50-drops} Drops만 더 모으면 한정판 굿즈 획득 가능!</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mb-10">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Ticket className="w-5 h-5 text-emerald-600" />Plans</h3>
        <div className="space-y-4">
          {plans.map((plan: any) => (
             <div key={plan.id} className={`relative border rounded-3xl p-5 transition-all duration-300 ${plan.id === userTier ? 'bg-stone-50 border-emerald-500 ring-1 ring-emerald-500' : 'bg-white border-stone-200 hover:border-emerald-300'}`}>
              {plan.recommended && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">Popular</span>}
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2"><h4 className="font-bold text-lg">{plan.name}</h4></div>
                <div className="text-right"><span className="block font-bold text-xl">{plan.price}</span></div>
              </div>
              <ul className="space-y-2 mt-4 mb-4">
                {plan.features.map((feature: string, idx: number) => (<li key={idx} className="flex items-start gap-2 text-sm opacity-90"><CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" /><span>{feature}</span></li>))}
              </ul>
              <button 
                onClick={() => {
                   if(isGuest) { showToast("로그인이 필요합니다.", "error"); onLoginClick(); }
                   else onUpgrade(plan.id);
                }}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${plan.id === userTier ? 'bg-stone-200 text-stone-500 cursor-default' : 'bg-emerald-800 text-white hover:bg-emerald-700 shadow-md'}`}
              >
                {plan.id === userTier ? '현재 이용중' : '변경하기'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// --- Main App Container ---
export default function ThriveApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showStoreSelector, setShowStoreSelector] = useState(false);
  const [currentStore, setCurrentStore] = useState(STORES[0]);

  // Toast State
  const [toasts, setToasts] = useState<{id: number, message: string, type: ToastType}[]>([]);
  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000); 
  };

  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [meetups, setMeetups] = useState<any[]>([]);
  const [localTier, setLocalTier] = useState<string>('newbie'); 

  // Static Data for Club & Plans
  const plans = [
    { id: 'newbie', name: "Wellness Newbie", price: "Free", features: ["커뮤니티 2회 체험", "기본 배지 획득"], recommended: false },
    { id: 'semipro', name: "Wellness Semipro", price: "₩9,900", features: ["피드 무제한", "활동 무제한", "월 2회 무료 음료"], recommended: true },
    { id: 'pro', name: "Wellness Pro", price: "₩29,900", features: ["모든 혜택 포함", "월 10회 무료 음료", "신메뉴 시음회"], recommended: false }
  ];
  const badges = [{ id: 1, name: "Early Bird", completed: true }, { id: 2, name: "Runner", completed: false }];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id); else setProfile(null);
    });
    fetchCommonData();
    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) {
        setProfile(data);
        setLocalTier(data.tier);
    }
  };

  const fetchCommonData = async () => {
    const { data: posts } = await supabase.from('thrive_posts').select('*').order('created_at', { ascending: false });
    if (posts && posts.length > 0) setCommunityPosts(posts);
    else {
       setCommunityPosts([
         { id: 1, username: "Minji", content: "오늘 오운완!", likes: 12, badge: "Runner", created_at: new Date().toISOString() },
         { id: 2, username: "Kai", content: "말차 맛있다", likes: 5, badge: "Newbie", created_at: new Date().toISOString() }
       ]);
    }

    const { data: meets } = await supabase.from('thrive_meetups').select('*');
    if (meets && meets.length > 0) setMeetups(meets);
    else {
      setMeetups([
        { id: 1, title: "Saturday Run", type: "Activity", location: "한강공원", meet_time: "Sat 08:00", participants_current: 12, participants_max: 20 },
        { id: 2, title: "Deep Work", type: "Study", location: "강남점", meet_time: "Wed 19:00", participants_current: 3, participants_max: 8 }
      ]);
    }
  };

  const handleLogout = async () => { 
    await supabase.auth.signOut(); 
    setSession(null); 
    setProfile(null);
    addToast("로그아웃 되었습니다.", "info");
  };

  // Mock SSO Login for Demo
  const handleSSOLogin = async () => {
    // Demo User Data Setup (강민지, Newbie)
    const demoProfile = { 
        id: "demo_user_minji", 
        username: "강민지", 
        tier: "newbie", 
        tickets: 2, 
        drops: 0 
    };
    
    // Simulate successful login
    setSession({ user: { id: demoProfile.id } });
    setProfile(demoProfile as UserProfile);
    setLocalTier("newbie");
  };

  const handleUpgrade = async (newTier: string) => {
    if (!session) {
        setShowLogin(true);
        return;
    }
    setLocalTier(newTier);
    addToast(`멤버십이 ${newTier.toUpperCase()} 등급으로 변경되었습니다!`, "success");
    // In real app, update DB here
  };

  const currentTier = session ? localTier : 'guest'; 
  const currentTickets = profile?.tickets ?? 2;
  const currentDrops = profile?.drops ?? 0; 
  const currentName = profile?.username || "Guest";

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-stone-900 font-sans max-w-md mx-auto shadow-2xl overflow-hidden relative selection:bg-emerald-200">
      <ToastContainer toasts={toasts} removeToast={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
      <StarbucksAuthModal isOpen={showLogin} onClose={() => setShowLogin(false)} onLoginSuccess={handleSSOLogin} showToast={addToast} />
      <StoreSelector isOpen={showStoreSelector} onClose={() => setShowStoreSelector(false)} currentStore={currentStore} onSelect={setCurrentStore} />
      
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-1 cursor-pointer hover:bg-stone-50 px-2 py-1 rounded-lg transition-colors" onClick={() => setShowStoreSelector(true)}>
          <div className="text-emerald-800"><Leaf className="w-5 h-5 fill-current" /></div>
          <div className="flex flex-col">
            <span className="text-[10px] text-stone-500 leading-none">Current Store</span>
            <div className="flex items-center text-sm font-bold text-stone-800 leading-none">
              <span className="max-w-[120px] truncate">{currentStore.name}</span>
              <ChevronDown className="w-3 h-3 ml-1 text-stone-400" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           {!session ? (
             <button onClick={() => setShowLogin(true)} className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors">Sign In</button>
           ) : (
             <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <span className="text-xs font-bold hidden sm:block">{currentName}</span>
                <img src={IMAGES.avatar_def} className="w-8 h-8 rounded-full border border-emerald-200 object-cover" alt="Profile" />
             </div>
           )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
           <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-14 left-0 w-full bg-white z-40 border-b shadow-lg p-4 flex flex-col gap-2">
             {['Home', 'Menu', 'Community', 'Club'].map((tab) => (
               <button key={tab} onClick={() => { setActiveTab(tab.toLowerCase()); setIsMenuOpen(false); }} className="p-3 text-left font-bold text-stone-600 hover:bg-stone-50 rounded-lg">{tab}</button>
             ))}
             {session && <button onClick={handleLogout} className="p-3 text-left font-bold text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-2"><LogOut className="w-4 h-4"/> Logout</button>}
           </motion.div>
        )}
      </AnimatePresence>

      <main className="min-h-[calc(100vh-140px)] bg-white">
        {activeTab === 'home' && <HomeSection setActiveTab={setActiveTab} userTier={currentTier} userName={currentName} onLoginClick={() => setShowLogin(true)} />}
        {activeTab === 'menu' && <MenuSection showToast={addToast} />}
        {activeTab === 'community' && <CommunitySection posts={communityPosts} meetups={meetups} userTier={currentTier} newbieTickets={currentTickets} showToast={addToast} />}
        {activeTab === 'club' && <ClubSection plans={plans} badges={badges} userTier={currentTier} newbieTickets={currentTickets} drops={currentDrops} onUpgrade={handleUpgrade} onLoginClick={() => setShowLogin(true)} showToast={addToast} />}
      </main>

      {/* Floating Bottom Nav */}
      <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-stone-200 p-2 flex justify-around items-center z-50 pb-safe">
        {[
          { id: 'home', icon: <Leaf className="w-5 h-5" />, label: "Home" },
          { id: 'menu', icon: <Coffee className="w-5 h-5" />, label: "Menu" },
          { id: 'community', icon: <Users className="w-5 h-5" />, label: "Together" },
          { id: 'club', icon: <Star className="w-5 h-5" />, label: "Club" },
        ].map((item) => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${activeTab === item.id ? 'text-emerald-700 bg-emerald-50' : 'text-stone-400'}`}>
            {item.icon}
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </div>
      
      {/* Order FAB */}
      <div className="fixed bottom-20 right-4 z-40">
        <button 
          onClick={() => {
            addToast("매장 주문 기능은 준비 중입니다.", "info"); // Fixed: showToast -> addToast
          }}
          className="bg-emerald-800 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2"
        >
          <ShoppingBag className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}