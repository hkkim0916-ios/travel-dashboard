import React, { useState, useEffect } from 'react';

export default function App() {
  // --- 상태 관리 (초기값 로컬스토리지 연동) ---
  const [activeTab, setActiveTab] = useState('itinerary');
  
  const [itineraries, setItineraries] = useState(() => {
    const saved = localStorage.getItem('sapporo_itineraries');
    return saved ? JSON.parse(saved) : [
      { id: 1, time: '10:00', location: '신치토세 공항 도착', memo: '포켓 와이파이 수령 및 JR 패스 교환' },
      { id: 2, time: '13:00', location: '스스키노 라멘 골목', memo: '미소라멘 점심 식사' },
      { id: 3, time: '18:00', location: '오도리 공원', memo: '삿포로 여름 축제 비어가든 즐기기' }
    ];
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('sapporo_expenses');
    return saved ? JSON.parse(saved) : [
      { id: 1, category: '식비', amount: 1500, memo: '점심 라멘' },
      { id: 2, category: '교통비', amount: 1200, memo: 'JR 편도 티켓' }
    ];
  });

  const [checklists, setChecklists] = useState(() => {
    const saved = localStorage.getItem('sapporo_checklists');
    return saved ? JSON.parse(saved) : [
      { id: 1, task: '여권 및 비자 확인', completed: true },
      { id: 2, task: '돼지코(어댑터) 챙기기', completed: false },
      { id: 3, task: '비어가든 사전 예약 확인', completed: false }
    ];
  });

  // --- 입력 폼 상태 ---
  const [newLocation, setNewLocation] = useState('');
  const [newTime, setNewTime] = useState('12:00');
  const [newMemo, setNewMemo] = useState('');

  const [expCategory, setExpCategory] = useState('식비');
  const [expAmount, setExpAmount] = useState('');
  const [expMemo, setExpMemo] = useState('');

  const [newTodo, setNewTodo] = useState('');

  // --- 로컬스토리지 동기화 (useEffect) ---
  useEffect(() => {
    localStorage.setItem('sapporo_itineraries', JSON.stringify(itineraries));
  }, [itineraries]);

  useEffect(() => {
    localStorage.setItem('sapporo_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('sapporo_checklists', JSON.stringify(checklists));
  }, [checklists]);

  // --- CRUD 핸들러 ---
  const addItinerary = (e) => {
    e.preventDefault();
    if (!newLocation.trim()) return;
    setItineraries([...itineraries, { id: Date.now(), time: newTime, location: newLocation, memo: newMemo }].sort((a, b) => a.time.localeCompare(b.time)));
    setNewLocation('');
    setNewMemo('');
  };

  const deleteItinerary = (id) => {
    setItineraries(itineraries.filter(item => item.id !== id));
  };

  const addExpense = (e) => {
    e.preventDefault();
    if (!expAmount || isNaN(expAmount)) return;
    setExpenses([...expenses, { id: Date.now(), category: expCategory, amount: parseInt(expAmount, 10), memo: expMemo }]);
    setExpAmount('');
    setExpMemo('');
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(item => item.id !== id));
  };

  const toggleChecklist = (id) => {
    setChecklists(checklists.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const addChecklist = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setChecklists([...checklists, { id: Date.now(), task: newTodo, completed: false }]);
    setNewTodo('');
  };

  const deleteChecklist = (id) => {
    setChecklists(checklists.filter(item => item.id !== id));
  };

  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);

  // --- 구글맵 이동 함수 ---
  const handleMapSearch = (location) => {
    if (!location) return;
    const encodedLocation = encodeURIComponent(location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-24 font-sans antialiased">
      {/* 상단 비주얼 헤더 */}
      <div className="relative h-48 bg-linear-to-r from-orange-600 to-amber-500 flex flex-col justify-end p-6 shadow-xl">
        <div className="absolute top-4 right-4 bg-slate-900/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wider border border-white/10 text-orange-200">
          JUL 26 - AUG 1
        </div>
        <p className="text-orange-100 text-xs font-bold tracking-widest uppercase mb-1">SAPPORO SUMMER FESTIVAL '26</p>
        <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">삿포로 여름 축제</h1>
      </div>

      {/* 메인 레이아웃 대시보드 */}
      <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
        
        {/* 탭 이동 제어 영역 */}
        {activeTab === 'itinerary' && (
          <div className="space-y-6">
            {/* 일정 추가 폼 */}
            <form onSubmit={addItinerary} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-orange-400 flex items-center gap-2">
                ➕ 새로운 일정 추가
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <input 
                  type="time" 
                  value={newTime} 
                  onChange={(e) => setNewTime(e.target.value)}
                  className="col-span-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-center focus:outline-hidden focus:border-orange-500 text-white"
                />
                <input 
                  type="text" 
                  placeholder="장소 또는 일정명" 
                  value={newLocation} 
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm focus:outline-hidden focus:border-orange-500 text-white"
                />
              </div>
              <input 
                type="text" 
                placeholder="메모 (선택사항)" 
                value={newMemo} 
                onChange={(e) => setNewMemo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm focus:outline-hidden focus:border-orange-500 text-white"
              />
              <button type="submit" className="w-full bg-linear-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-sm py-3 rounded-xl hover:opacity-90 transition-all active:scale-98 shadow-md shadow-orange-500/10">
                일정 추가하기
              </button>
            </form>

            {/* 타임라인 선 및 카드 목록 */}
            <div className="relative pl-6 border-l border-slate-800 ml-3 space-y-6">
              {itineraries.map((item) => (
                <div key={item.id} className="relative group">
                  <div className="absolute -left-[25px] top-1.5 w-3.5 h-3.5 bg-orange-500 rounded-full ring-4 ring-slate-950 group-hover:scale-110 transition-transform" />
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xs hover:border-slate-700 transition-colors">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-sm flex items-center gap-1">
                          ⏰ {item.time}
                        </span>
                        <h4 className="text-base font-bold text-slate-100">{item.location}</h4>
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleMapSearch(item.location)}
                          className="p-1.5 text-slate-500 hover:text-cyan-400 transition-colors"
                          title="구글맵에서 검색"
                        >
                          📍
                        </button>
                        <button 
                          onClick={() => deleteItinerary(item.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    {item.memo && <p className="text-sm text-slate-400 pl-1 mt-1 font-medium">{item.memo}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'expense' && (
          <div className="space-y-6">
            {/* 가계부 상단 요약 카드 */}
            <div className="bg-linear-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 flex justify-between items-center shadow-xs">
              <div>
                <p className="text-xs text-slate-400 font-bold tracking-wide uppercase mb-1">총 지출 금액</p>
                <p className="text-2xl font-black tracking-tight text-white">
                  {totalExpense.toLocaleString()} <span className="text-lg font-bold text-amber-400">JPY</span>
                </p>
              </div>
              <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 text-xl">
                💰
              </div>
            </div>

            {/* 가계부 지출 입력 폼 */}
            <form onSubmit={addExpense} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                ➕ 지출 내역 기록
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <select 
                  value={expCategory} 
                  onChange={(e) => setExpCategory(e.target.value)}
                  className="col-span-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-300 focus:outline-hidden focus:border-amber-500 text-center"
                >
                  <option value="식비">식비</option>
                  <option value="교통비">교통비</option>
                  <option value="쇼핑">쇼핑</option>
                  <option value="숙박">숙박</option>
                  <option value="기타">기타</option>
                </select>
                <input 
                  type="number" 
                  placeholder="금액 (엔화)" 
                  value={expAmount} 
                  onChange={(e) => setExpAmount(e.target.value)}
                  className="col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm focus:outline-hidden focus:border-amber-500 text-white"
                />
              </div>
              <input 
                type="text" 
                placeholder="내용 및 메모" 
                value={expMemo} 
                onChange={(e) => setExpMemo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm focus:outline-hidden focus:border-amber-500 text-white"
              />
              <button type="submit" className="w-full bg-linear-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm py-3 rounded-xl hover:opacity-90 transition-all active:scale-98 shadow-md shadow-amber-500/10">
                지출 내역 추가
              </button>
            </form>

            {/* 지출 목록 */}
            <div className="space-y-2">
              {expenses.map((item) => (
                <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between items-center group hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-amber-400 min-w-[55px] text-center">
                      {item.category}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{item.memo || item.category}</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-200">{item.amount.toLocaleString()} ¥</span>
                    <button 
                      onClick={() =>
