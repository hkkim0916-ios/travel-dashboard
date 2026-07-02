import React, { useState } from 'react';

function App() {
  // --- 상태 관리 (State) ---
  const [activeMenu, setActiveMenu] = useState('timeline');
  const [activeDay, setActiveDay] = useState(1);
  const [suicaBalance, setSuicaBalance] = useState(5000);
  const [calcJpy, setCalcJpy] = useState('');
  const [calcKrw, setCalcKrw] = useState('');

  const handleJpyChange = (val) => {
    setCalcJpy(val);
    if (!val) { setCalcKrw(''); return; }
    setCalcKrw(Math.round((parseFloat(val) * 9.3)).toLocaleString());
  };

  const handleKrwChange = (val) => {
    const rawVal = val.replace(/,/g, '');
    setCalcKrw(val);
    if (!rawVal) { setCalcJpy(''); return; }
    setCalcJpy(Math.round((parseFloat(rawVal) / 9.3)));
  };

  const [copied, setCopied] = useState(false);
  const hotelAddress = "2 Chome-1-1 Kita 7 Jonishi, Kita Ward, Sapporo, Hokkaido 060-0807";
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(hotelAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 구글맵 범용 검색 쿼리 생성 도우미 함수 (URL 안전성 확보)
  const getMapUrl = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  const [events, setEvents] = useState([
    { id: 101, day: 1, time: '15:45', title: '공항 ➡️ 삿포로역 이동 🚌', desc: '공항 리무진 버스 탑승 (스이카 1,300엔)' },
    { id: 102, day: 1, time: '17:00', title: '호텔 체크인 🏨', desc: '호텔 포르자 삿포로역 짐 풀기', mapQuery: 'Hotel Forza Sapporo Station' },
    { id: 103, day: 1, time: '18:00', title: '오도리 공원 맥주축제 전야제 🍻', desc: '삿포로 클래식 부스에서 시원한 첫 잔!', mapQuery: 'Odori Park Sapporo' },
    { id: 104, day: 1, time: '19:30', title: '스스키노 이동 & 저녁 식사 🐑', desc: '징기스칸 양고기 맛집 탐방', mapQuery: 'Susukino Sapporo Jingisukan' },
    { id: 105, day: 1, time: '21:00', title: '📍 [추천] 스스키노 니카상 & 돈키호테 📸', desc: '징기스칸 먹고 도보 3분! 밤거리 랜드마크 인증샷과 쇼핑 코스', mapQuery: 'Susukino Nikka Sign' },

    { id: 201, day: 2, time: '07:40', title: '아침 식사 후 집결지 이동 🏃', desc: '삿포로역 투어 버스 탑승지 필수 확인' },
    { id: 202, day: 2, time: '08:00', title: '비에이·후라노 버스 투어 출발 🚌', desc: '대자연 정복 (추가 교통비 0원) ~19:00까지 진행', mapQuery: 'Sapporo Station Bus Terminal' },
    { id: 203, day: 2, time: '19:30', title: '삿포로역 복귀 후 저녁 식사 🍛', desc: '따끈하고 진한 스프카레로 피로 풀기' },
    { id: 204, day: 2, time: '20:30', title: '📍 [추천] 스파이스 수프카레 트레저 🍛', desc: '투어 끝나고 지친 몸을 녹여줄 현지인 최애 스프카레 명가', mapQuery: 'Soup Curry Treasure Sapporo' },

    { id: 301, day: 3, time: '11:00', title: '삿포로역 ➡️ 미나미오타루역 이동 🚊', desc: 'JR 쾌속 에어포트 (사전 지정석 탑승)', mapQuery: 'Minami-Otaru Station' },
    { id: 302, day: 3, time: '12:00', title: '오르골마을 투어 🎶', desc: '오르골당 본점 구경 및 스시로 점심 식사', mapQuery: 'Otaru Music Box Museum' },
    { id: 303, day: 3, time: '13:30', title: '📍 [추천] 르타오(LeTAO) 과자공방 본점 🍰', desc: '오르골당 바로 맞은편! 입에서 살살 녹는 치즈케이크 타임', mapQuery: 'LeTAO Main Store Otaru' },
    { id: 304, day: 3, time: '15:00', title: '오타루 운하 평지 산책 🌊', desc: '낮 풍경부터 로맨틱한 일몰 야경까지 감상', mapQuery: 'Otaru Canal' },
    { id: 305, day: 3, time: '19:00', title: '오타루역 ➡️ 삿포로역 복귀 🚊', desc: 'JR 쾌속 에어포트 (사전 지정석 탑승)', mapQuery: 'Otaru Station' },

    { id: 401, day: 4, time: '12:00', title: '[메인] 맥주축제 낮맥 점심 🍺', desc: '오도리 공원 맥주축제 도장깨기 (스이카 결제 가능)', mapQuery: 'Odori Park Sapporo' },
    { id: 402, day: 4, time: '14:00', title: '📍 [추천] 삿포로 시계탑 🔔', desc: '낮맥 마시고 숙소 가기 전 슬쩍 들러 근대 건축물 앞에서 인생샷', mapQuery: 'Sapporo Clock Tower' },
    { id: 403, day: 4, time: '14:30', title: '시원한 실내 쇼핑 및 휴식 🛍️', desc: '삿포로역 스텔라플레이스 구경 또는 숙소 휴식', mapQuery: 'Sapporo Stellar Place' },
    { id: 404, day: 4, time: '18:00', title: '📍 [추천] 니시4초메 트램 정류장 🚋', desc: '야경 보러 갈 때 탈 노면전차(트램) 정류장 위치! 스이카 찍고 탑승 (200엔)', mapQuery: 'Nishi-Yon-Chome Station' },
    { id: 405, day: 4, time: '19:00', title: '모이와야마 전망대 야경 🌌', desc: '7시 일몰 타이밍 저격! 일본 새로운 3대 야경 명소 감상 (~20:30)', mapQuery: 'Mt. Moiwa Ropeway' },

    { id: 501, day: 5, time: '09:30', title: '체크아웃 & 라스트 쇼핑 🛍️', desc: '호텔 체크아웃 후 역 근처 쇼핑몰 공략' },
    { id: 502, day: 5, time: '11:30', title: '삿포로역 ➡️ 공항역 이동 🚊', desc: 'JR 쾌속 에어포트 (사전 지정석)' },
    { id: 503, day: 5, time: '12:15', title: '공항 국내선 투어 및 귀국 ✈️', desc: '라멘 도조(라멘 거리)에서 마지막 미소라멘 점심 식사 후 귀국', mapQuery: 'New Chitose Airport Ramen Dojo' }
  ]);

  const [newTime, setNewTime] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newQuery, setNewQuery] = useState('');

  const [checklist, setChecklist] = useState([
    { id: 1, text: '여권 및 비행기 E-티켓 📄', checked: true },
    { id: 2, text: '비지트 재팬 WEB QR 등록 📱', checked: false },
    { id: 3, text: '모바일 실물 스이카 카드 충전 💳', checked: false },
    { id: 4, text: '환전 엔화 & 트래블 카드 💴', checked: true },
    { id: 5, text: '돼지코 어댑터 (110V) 🔌', checked: false }
  ]);
  const [newItem, setNewItem] = useState('');

  const totalBudget = 1200000;
  const [expenses, setExpenses] = useState([
    { id: 1, title: '항공권 결제 완료 ✈️', amount: 480000, category: '교통' },
    { id: 2, title: '호텔 포르자 4박 🏨', amount: 380000, category: '숙박' }
  ]);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('식비');

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newTime || !newTitle) return;
    const newEvent = { 
      id: Date.now(), 
      day: activeDay, 
      time: newTime, 
      title: newTitle, 
      desc: newDesc,
      mapQuery: newQuery.trim() || undefined
    };
    setEvents([...events, newEvent].sort((a,b) => a.time.localeCompare(b.time)));
    setNewTime(''); setNewTitle(''); setNewDesc(''); setNewQuery('');
  };
  
  const handleDeleteEvent = (id) => setEvents(events.filter(item => item.id !== id));
  const handleToggleCheck = (id) => setChecklist(checklist.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    setChecklist([...checklist, { id: Date.now(), text: newItem, checked: false }]);
    setNewItem('');
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expenseTitle || !expenseAmount) return;
    const newExp = {
      id: Date.now(),
      title: expenseTitle,
      amount: parseInt(expenseAmount),
      category: expenseCategory
    };
    setExpenses([newExp, ...expenses]);
    setExpenseTitle('');
    setExpenseAmount('');
  };
  const handleDeleteExpense = (id) => setExpenses(expenses.filter(item => item.id !== id));

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const doneCheckCount = checklist.filter(item => item.checked).length;
  const filteredEvents = events.filter(event => event.day === activeDay);

  const dayLabels = [
    { day: 1, label: 'DAY 01', date: '07.21 TUE' },
    { day: 2, label: 'DAY 02', date: '07.22 WED' },
    { day: 3, label: 'DAY 03', date: '07.23 THU' },
    { day: 4, label: 'DAY 04', date: '07.24 FRI' },
    { day: 5, label: 'DAY 05', date: '07.25 SAT' },
  ];

  return (
    <div className="flex h-screen bg-[#07090e] font-sans text-slate-300 overflow-hidden pb-20 md:pb-0 select-none antialiased">
      
      {/* ================= [PC 사이드바] ================= */}
      <aside className="w-64 bg-[#0d121f] border-r border-slate-800 hidden md:flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 border-b border-slate-800/60 flex items-center gap-3">
            <span className="text-xl bg-linear-to-r from-orange-500 via-amber-400 to-yellow-400 text-slate-950 px-2.5 py-0.5 font-mono font-black rounded-md tracking-tighter shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              SPF·26
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-mono tracking-widest text-white font-black">SAPPORO</span>
              <span className="text-[9px] font-mono text-slate-500 tracking-tight font-medium">TACTICAL BOARD</span>
            </div>
          </div>
          
          <nav className="p-4 space-y-2">
            <button onClick={() => setActiveMenu('timeline')} className={`w-full text-left p-3.5 rounded-xl transition-all font-mono font-black text-xs flex items-center justify-between group ${activeMenu === 'timeline' ? 'bg-linear-to-r from-orange-500 via-amber-400 to-yellow-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.35)]' : 'hover:bg-slate-800/40 text-slate-500'}`}>
              <span className="flex items-center gap-2">⚡ <span className={activeMenu === 'timeline' ? 'text-slate-950' : 'group-hover:text-slate-300'}>TIMELINE MATRIX</span></span>
              <span className="text-[10px] opacity-60">▶</span>
            </button>
            <button onClick={() => setActiveMenu('checklist')} className={`w-full text-left p-3.5 rounded-xl transition-all font-mono font-black text-xs flex items-center justify-between group ${activeMenu === 'checklist' ? 'bg-linear-to-r from-orange-500 via-amber-400 to-yellow-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.35)]' : 'hover:bg-slate-800/40 text-slate-500'}`}>
              <span className="flex items-center gap-2">🎒 <span className={activeMenu === 'checklist' ? 'text-slate-950' : 'group-hover:text-slate-300'}>PACKING CHECK</span></span>
              <span className="text-[10px] opacity-60">▶</span>
            </button>
            <button onClick={() => setActiveMenu('wallet')} className={`w-full text-left p-3.5 rounded-xl transition-all font-mono font-black text-xs flex items-center justify-between group ${activeMenu === 'wallet' ? 'bg-linear-to-r from-orange-500 via-amber-400 to-yellow-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.35)]' : 'hover:bg-slate-800/40 text-slate-500'}`}>
              <span className="flex items-center gap-2">👛 <span className={activeMenu === 'wallet' ? 'text-slate-950' : 'group-hover:text-slate-300'}>BUDGET WALLET</span></span>
              <span className="text-[10px] opacity-60">▶</span>
            </button>
            <button onClick={() => setActiveMenu('exchange')} className={`w-full text-left p-3.5 rounded-xl transition-all font-mono font-black text-xs flex items-center justify-between group ${activeMenu === 'exchange' ? 'bg-linear-to-r from-orange-500 via-amber-400 to-yellow-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.35)]' : 'hover:bg-slate-800/40 text-slate-500'}`}>
              <span className="flex items-center gap-2">📟 <span className={activeMenu === 'exchange' ? 'text-slate-950' : 'group-hover:text-slate-300'}>UTILITY MODULE</span></span>
              <span className="text-[10px] opacity-60">▶</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800/60 space-y-2 bg-[#090d16]/80">
          <a href="https://www.vjw.digital.go.jp/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-linear-to-r from-orange-500 to-amber-600 hover:opacity-90 text-white p-3 rounded-xl text-[11px] font-mono font-black tracking-tight shadow-[0_4px_12px_rgba(245,158,11,0.25)] transition-all">
            <span>VISIT JAPAN WEB QR</span>
            <span>↗</span>
          </a>
          <button onClick={handleCopyAddress} className="w-full flex flex-col items-start bg-slate-900/60 hover:bg-slate-900 border border-slate-800 p-3 rounded-xl text-left transition-all relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
            <span className="text-[9px] font-mono text-orange-400 font-black tracking-wider">HOTEL ADDRESS</span>
            <span className="text-xs font-bold mt-0.5 truncate w-full text-slate-300 group-hover:text-white">Tap to Copy Link</span>
            {copied && <span className="absolute right-2 top-2 text-[9px] bg-orange-400 text-slate-950 px-1.5 py-0.5 rounded font-mono font-black shadow-sm">DONE</span>}
          </button>
        </div>
      </aside>

      {/* ================= [메인 화면 구조] ================= */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        <header className="sticky top-0 z-40 h-16 bg-[#0d121f]/90 backdrop-blur-md border-b border-slate-800/60 flex items-center justify-between px-5 md:px-8 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full shadow-[0_0_8px_#f97316]"></div>
            <h1 className="text-xs md:text-sm font-mono font-black tracking-widest text-slate-200">SAPPORO SUMMER FESTIVAL '26</h1>
          </div>
          <span className="text-[10px] font-mono font-black bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 rounded-md">
            07.21 - 07.25
          </span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          
          {/* 상단 통합 상태판 대시보드 */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0e1424] border border-slate-800 p-5 rounded-2xl shadow-md">
              <span className="text-[10px] font-mono font-black text-slate-500 tracking-wider block">TOTAL REMAINING BUDGET</span>
              <p className="text-xl font-mono font-black text-white mt-1">{(totalBudget - totalSpent).toLocaleString()} <span className="text-xs text-slate-500 font-sans font-bold">KRW</span></p>
            </div>

            <div className="bg-[#0e1424] border border-slate-800 p-5 rounded-2xl shadow-md">
              <span className="text-[10px] font-mono font-black text-orange-400 tracking-wider block">💳 SUICA WALLET BALANCE</span>
              <p className="text-xl font-mono font-black text-white mt-1">{suicaBalance.toLocaleString()} <span className="text-xs text-orange-400 font-black">￥</span></p>
            </div>

            <div className="bg-[#0e1424] border border-slate-800 p-5 rounded-2xl shadow-md">
              <span className="text-[10px] font-mono font-black text-slate-500 tracking-wider block">GEAR READY RATE</span>
              <p className="text-xl font-mono font-black text-orange-400 mt-1">{doneCheckCount} <span className="text-xs text-slate-500 font-sans font-bold">/ {checklist.length} ITEMS</span></p>
            </div>
          </section>

          {/* 1. 타임라인 매트릭스 뷰 */}
          {activeMenu === 'timeline' && (
            <div className="space-y-6">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
                {dayLabels.map((item) => (
                  <button key={item.day} onClick={() => setActiveDay(item.day)} className={`flex-1 min-w-28 p-3 rounded-xl border transition-all text-center relative ${activeDay === item.day ? 'bg-linear-to-br from-slate-800 to-slate-900 border-orange-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.15)] font-black' : 'bg-[#0e1424] border-slate-800/80 text-slate-500 hover:border-slate-700 font-bold'}`}>
                    {activeDay === item.day && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-orange-400"></div>}
                    <div className={`text-xs font-mono tracking-tight ${activeDay === item.day ? 'text-orange-400' : ''}`}>{item.label}</div>
                    <div className="text-[9px] font-mono mt-0.5 opacity-60">{item.date}</div>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4 h-fit">
                  <div className="bg-[#0e1424] p-5 rounded-2xl border border-slate-800 shadow-md">
                    <h3 className="text-[10px] font-mono font-black text-orange-400 uppercase tracking-widest mb-4">// APPEND EVENT MATRIX</h3>
                    <form onSubmit={handleAddEvent} className="space-y-3">
                      <input type="time" value={newTime} onChange={e=>setNewTime(e.target.value)} className="w-full px-4 rounded-xl text-xs h-11 font-mono font-bold bg-[#07090e] border border-slate-800 text-white focus:outline-none focus:border-orange-400 transition"/>
                      <input type="text" placeholder="방문지 혹은 타깃 스팟" value={newTitle} onChange={e=>setNewTitle(e.target.value)} className="w-full px-4 rounded-xl text-xs h-11 font-sans font-bold bg-[#07090e] border border-slate-800 text-white focus:outline-none focus:border-orange-400 transition"/>
                      <textarea placeholder="메모할 세부 정보 입력" value={newDesc} onChange={e=>setNewDesc(e.target.value)} className="w-full p-4 rounded-xl text-xs h-14 font-sans bg-[#07090e] border border-slate-800 text-white focus:outline-none focus:border-orange-400 transition resize-none"/>
                      <input type="text" placeholder="구글맵 검색 장소명 (선택)" value={newQuery} onChange={e=>setNewQuery(e.target.value)} className="w-full px-4 rounded-xl text-xs h-11 font-sans bg-[#07090e] border border-slate-800 text-white focus:outline-none focus:border-orange-400 transition"/>
                      <button type="submit" className="w-full bg-linear-to-r from-orange-500 via-amber-400 to-yellow-400 text-slate-950 h-11 rounded-xl font-mono font-black text-xs shadow-md hover:opacity-95 transition-all">DEPLOY SCHEDULE</button>
                    </form>
                  </div>
                </div>

                <div className="lg:col-span-2 bg-[#0e1424] p-5 rounded-2xl border border-slate-800 shadow-md">
                  <h3 className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest mb-5">// DATA MATRIX INDEX</h3>
                  {filteredEvents.length === 0 ? (
                    <p className="text-center text-slate-600 py-12 font-mono text-xs">NO DISPATCH EVENTS FOUND FOR THIS DAY.</p>
                  ) : (
                    <div className="relative border-l border-slate-800/80 ml-2 pl-4 space-y-4">
                      {filteredEvents.map((event) => (
                        <div key={event.id} className="relative group">
                          <div className="-left-5.25 absolute top-2.5 bg-orange-400 w-2 h-2 rounded-full shadow-[0_0_8px_#f97316]"></div>
                          <div className="bg-[#07090e]/60 p-4 rounded-xl border border-slate-800/60 flex items-start justify-between transition-all hover:border-slate-700 hover:bg-[#07090e]">
                            <div className="flex-1 min-w-0 pr-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-black text-orange-400 bg-orange-950/40 border border-orange-900/30 px-2 py-0.5 rounded">
                                  {event.time}
                                </span>
                                {event.mapQuery && (
                                  <a href={getMapUrl(event.mapQuery)} target="_blank" rel="noopener noreferrer" className="text-[9px] font-mono font-black text-slate-950 bg-linear-to-r from-orange-400 to-amber-400 px-2.5 py-0.5 rounded shadow-[0_2px_6px_rgba(245,158,11,0.2)] hover:opacity-90 transition-all">
                                    🗺️ GOOGLE MAP
                                  </a>
                                )}
                              </div>
                              <h4 className="text-sm font-sans font-black text-slate-200 mt-2 tracking-tight">{event.title}</h4>
                              {event.desc && <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed font-sans">{event.desc}</p>}
                            </div>
                            <button onClick={() => handleDeleteEvent(event.id)} className="text-[10px] text-slate-600 font-mono font-bold hover:text-rose-400 p-1">DROP</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. 패킹 체크리스트 뷰 */}
          {activeMenu === 'checklist' && (
            <div className="max-w-xl mx-auto bg-[#0e1424] p-5 rounded-2xl border border-slate-800 shadow-md">
              <h3 className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest mb-4">// DEPLOYED GEAR LUGGAGE</h3>
              <form onSubmit={handleAddItem} className="flex gap-2 mb-5">
                <input type="text" placeholder="필요 기어 장비 명칭 기입..." value={newItem} onChange={e=>setNewItem(e.target.value)} className="flex-1 px-4 border border-slate-800 rounded-xl text-xs h-11 bg-[#07090e] text-slate-200 focus:outline-none focus:border-orange-400 transition"/>
                <button type="submit" className="bg-linear-to-r from-orange-500 via-amber-400 to-yellow-400 text-slate-950 px-5 rounded-xl text-xs font-mono font-black h-11 shadow-md transition-all">ADD</button>
              </form>
              <div className="space-y-2">
                {checklist.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3.5 rounded-xl bg-[#07090e]/40 border border-slate-800/60">
                    <label className="flex items-center gap-3 cursor-pointer select-none flex-1 py-0.5">
                      <input type="checkbox" checked={item.checked} onChange={() => handleToggleCheck(item.id)} className="w-4 h-4 accent-orange-500 rounded border-slate-800 bg-slate-950"/>
                      <span className={`text-xs font-sans font-bold ${item.checked ? 'line-through text-slate-600 font-medium' : 'text-slate-300'}`}>{item.text}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. 예산 기록 가계부 뷰 */}
          {activeMenu === 'wallet' && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="bg-[#0e1424] p-5 rounded-2xl border border-slate-800 shadow-md">
                <h3 className="text-[10px] font-mono font-black text-orange-400 uppercase tracking-widest mb-4">// RECORD LIVE EXPENSE</h3>
                <form onSubmit={handleAddExpense} className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <select value={expenseCategory} onChange={e=>setExpenseCategory(e.target.value)} className="col-span-1 px-3 bg-[#07090e] border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-orange-400">
                      <option value="식비">🍔 식비</option>
                      <option value="교통">🚌 교통</option>
                      <option value="숙박">🏨 숙박</option>
                      <option value="쇼핑">🛍️ 쇼핑</option>
                      <option value="기타">🎲 기타</option>
                    </select>
                    <input type="text" placeholder="지출 항목명" value={expenseTitle} onChange={e=>setExpenseTitle(e.target.value)} className="col-span-2 px-4 bg-[#07090e] border border-slate-800 rounded-xl text-xs h-11 text-white focus:outline-none focus:border-orange-400 font-bold"/>
                  </div>
                  <input type="number" placeholder="지출 금액 (KRW)" value={expenseAmount} onChange={e=>setExpenseAmount(e.target.value)} className="w-full px-4 bg-[#07090e] border border-slate-800 rounded-xl text-xs h-11 text-white focus:outline-none focus:border-orange-400 font-mono font-black"/>
                  <button type="submit" className="w-full bg-linear-to-r from-orange-500 via-amber-400 to-yellow-400 text-slate-950 h-11 rounded-xl font-mono font-black text-xs shadow-md">LOG EXPENSE</button>
                </form>
              </div>

              <div className="bg-[#0e1424] p-5 rounded-2xl border border-slate-800 shadow-md">
                <h3 className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest mb-3">// STATEMENT HISTORY</h3>
                <div className="space-y-2">
                  {expenses.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3.5 bg-[#07090e]/60 border border-slate-800/60 rounded-xl">
                      <div>
                        <span className="text-[9px] font-mono font-black text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded mr-2">{item.category}</span>
                        <span className="text-xs font-sans font-bold text-slate-200">{item.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-black text-rose-400">-{item.amount.toLocaleString()} ₩</span>
                        <button onClick={() => handleDeleteExpense(item.id)} className="text-[10px] text-slate-600 font-bold hover:text-rose-500">❌</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. 환율 및 스이카 특화 유틸 뷰 */}
          {activeMenu === 'exchange' && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="bg-[#0e1424] p-5 rounded-2xl border border-slate-800 shadow-md">
                <h3 className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest mb-3">// LIVE CONVERSION INTERFACE</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 block mb-1 font-black">￥ JPY EN</span>
                    <input type="number" placeholder="1000" value={calcJpy} onChange={e=>handleJpyChange(e.target.value)} className="w-full px-4 font-mono font-black text-sm h-11 bg-[#07090e] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"/>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 block mb-1 font-black">₩ KRW WON (x9.3)</span>
                    <input type="text" placeholder="9,300" value={calcKrw} onChange={e=>handleKrwChange(e.target.value)} className="w-full px-4 font-mono font-black text-sm h-11 bg-[#07090e] border border-slate-800 rounded-xl text-amber-400 focus:outline-none focus:border-amber-400"/>
                  </div>
                </div>
              </div>

              <div className="bg-[#0e1424] p-5 rounded-2xl border border-slate-800 shadow-md">
                <h3 className="text-[10px] font-mono font-black text-orange-400 uppercase tracking-widest mb-3">// SUICA INTEGRATION PANEL</h3>
                <div className="p-4 bg-[#07090e]/80 rounded-xl border border-slate-800/80 text-center mb-4">
                  <span className="text-[10px] font-mono font-bold text-slate-500 tracking-wider block">CURRENT BALANCE</span>
                  <span className="text-2xl font-mono font-black text-white">{suicaBalance.toLocaleString()} <span className="text-sm font-sans text-orange-400 font-black">￥</span></span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => setSuicaBalance(b => Math.max(0, b - 200))} className="text-xs bg-slate-900 border border-slate-800 text-slate-300 py-3 rounded-xl font-mono font-black hover:bg-slate-800/60">-200￥</button>
                  <button onClick={() => setSuicaBalance(b => Math.max(0, b - 1300))} className="text-xs bg-slate-900 border border-slate-800 text-slate-300 py-3 rounded-xl font-mono font-black hover:bg-slate-800/60">-1300￥</button>
                  <button onClick={() => setSuicaBalance(b => b + 2000)} className="text-xs bg-orange-500 text-slate-950 py-3 rounded-xl font-mono font-black shadow-[0_0_12px_rgba(245,158,11,0.35)]">+2000￥</button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ================= [🛠️ iOS 스퀘어클 앱 아이콘 스타일 모바일 탭바] ================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#0d121f]/95 backdrop-blur-md border-t border-slate-800/50 flex items-center justify-around z-50 px-3 pb-2 pt-1">
        
        {/* DAY TIMELINE 아이콘 */}
        <button onClick={() => setActiveMenu('timeline')} className="flex flex-col items-center justify-center flex-1 h-full group">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg transition-all duration-200 ${
            activeMenu === 'timeline' 
              ? 'bg-linear-to-br from-orange-500 via-amber-400 to-yellow-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.45)] border border-orange-400/30' 
              : 'bg-slate-900/80 text-slate-500 border border-slate-800 group-hover:border-slate-700'
          }`}>
            ⚡
          </div>
          <span className={`text-[9px] font-mono font-black tracking-tighter mt-1 transition-colors duration-200 ${activeMenu === 'timeline' ? 'text-orange-400 font-extrabold' : 'text-slate-600'}`}>
            TIME
          </span>
        </button>

        {/* PACKING LUGGAGE 아이콘 */}
        <button onClick={() => setActiveMenu('checklist')} className="flex flex-col items-center justify-center flex-1 h-full group">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg transition-all duration-200 ${
            activeMenu === 'checklist' 
              ? 'bg-linear-to-br from-orange-500 via-amber-400 to-yellow-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.45)] border border-orange-400/30' 
              : 'bg-slate-900/80 text-slate-500 border border-slate-800 group-hover:border-slate-700'
          }`}>
            🎒
          </div>
          <span className={`text-[9px] font-mono font-black tracking-tighter mt-1 transition-colors duration-200 ${activeMenu === 'checklist' ? 'text-orange-400 font-extrabold' : 'text-slate-600'}`}>
            PACK
          </span>
        </button>

        {/* LIVE WALLET 아이콘 */}
        <button onClick={() => setActiveMenu('wallet')} className="flex flex-col items-center justify-center flex-1 h-full group">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg transition-all duration-200 ${
            activeMenu === 'wallet' 
              ? 'bg-linear-to-br from-orange-500 via-amber-400 to-yellow-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.45)] border border-orange-400/30' 
              : 'bg-slate-900/80 text-slate-500 border border-slate-800 group-hover:border-slate-700'
          }`}>
            👛
          </div>
          <span className={`text-[9px] font-mono font-black tracking-tighter mt-1 transition-colors duration-200 ${activeMenu === 'wallet' ? 'text-orange-400 font-extrabold' : 'text-slate-600'}`}>
            CASH
          </span>
        </button>

        {/* UTILITY MODULE 아이콘 */}
        <button onClick={() => setActiveMenu('exchange')} className="flex flex-col items-center justify-center flex-1 h-full group">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg transition-all duration-200 ${
            activeMenu === 'exchange' 
              ? 'bg-linear-to-br from-orange-500 via-amber-400 to-yellow-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.45)] border border-orange-400/30' 
              : 'bg-slate-900/80 text-slate-500 border border-slate-800 group-hover:border-slate-700'
          }`}>
            📟
          </div>
          <span className={`text-[9px] font-mono font-black tracking-tighter mt-1 transition-colors duration-200 ${activeMenu === 'exchange' ? 'text-orange-400 font-extrabold' : 'text-slate-600'}`}>
            UTIL
          </span>
        </button>

      </div>

    </div>
  );
}

export default App;
