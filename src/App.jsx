import React, { useState, useEffect } from 'react';

export default function App() {
  // 메인 메뉴 탭 ('itinerary': 일정 관리, 'expense': 가계부, 'checklist': 준비물)
  const [activeTab, setActiveTab] = useState('itinerary');
  
  // 일정 내부에서 사용하는 '날짜별 서브 탭' (Day 1, Day 2, Day 3)
  const [activeDay, setActiveDay] = useState('Day 1');
  
  // 환율 상태 관리 (기본값 100엔 = 900원 가정)
  const [exchangeRate, setExchangeRate] = useState(() => {
    const saved = localStorage.getItem('sapporo_rate');
    return saved ? parseFloat(saved) : 900;
  });

  // 복원된 추천 일정 및 전체 교통편 초기 데이터
  const [itineraries, setItineraries] = useState(() => {
    const saved = localStorage.getItem('sapporo_itineraries');
    return saved ? JSON.parse(saved) : [
      // Day 1: 공항 도착 및 삿포로 시내 (추천 일정 & 교통편)
      { id: 1, day: 'Day 1', time: '10:00', location: '신치토세 공항 도착', memo: '🛄 포켓 와이파이 수령 및 JR 패스 / 교통카드 충전' },
      { id: 2, day: 'Day 1', time: '11:00', location: '신치토세 공항역 ➡ 삿포로역 (JR 쾌속 에어포트)', memo: '🚇 [교통] 약 37분 소요 (지정석 추천)' },
      { id: 3, day: 'Day 1', time: '13:00', location: '스스키노 라멘 골목 (원조 라멘요코초)', memo: '🍜 [식사] 삿포로 명물 미소라멘으로 점심 식사' },
      { id: 4, day: 'Day 1', time: '15:00', location: '숙소 체크인 (스스키노 인근)', memo: '🏨 짐 풀고 가벼운 복장으로 정비하기' },
      { id: 5, day: 'Day 1', time: '18:00', location: '오도리 공원 (삿포로 여름 축제)', memo: '🍺 [축제] 비어가든에서 시원한 삿포로 생맥주와 축제 즐기기!' },

      // Day 2: 오타루 당일치기 코스 (추천 일정 & 교통편)
      { id: 6, day: 'Day 2', time: '09:00', location: '삿포로역 ➡ 오타루역 (JR 하코다테 본선)', memo: '🚇 [교통] 열차 진행 방향 기준 우측 창가 자리가 바다 뷰 명당!' },
      { id: 7, day: 'Day 2', time: '10:30', location: '오타루 운하 & 사카이마치도리 공방거리', memo: '📸 오르골당, 유리공예 투어 및 디저트(르타오) 맛보기' },
      { id: 8, day: 'Day 2', time: '13:00', location: '오타루 스시 거리 (스시야도리)', memo: '🍣 [식사] 만화 미스터 초밥왕의 배경지에서 신선한 스시 점심' },
      { id: 9, day: 'Day 2', time: '18:30', location: '미나미오타루역 ➡ 삿포로역 복귀', memo: '🚇 [교통] 복귀 열차 안에서 휴식' },
      { id: 10, day: 'Day 2', time: '20:00', location: '스스키노 다루마 (징기스칸)', memo: '🥩 [식사] 삿포로 여행 필수 코스 양고기 구이에 나마비루 한 잔' },

      // Day 3: 시내 쇼핑 및 랜드마크 (추천 일정 & 교통편)
      { id: 11, day: 'Day 3', time: '10:00', location: '삿포로 TV 타워 & 시계탑', memo: '🗼 시내 중심가 랜드마크 배경으로 기념사진 촬영' },
      { id: 12, day: 'Day 3', time: '11:30', location: '삿포로 맥주 박물관', memo: '🍺 [교통] 삿포로역 사포로에키마에 버스정류장에서 [Loop 88] 버스 탑승' },
      { id: 13, day: 'Day 3', time: '12:00', location: '맥주 박물관 투어 및 시음', memo: '🍻 오리지널 삿포로 맥주 3종 샘플러 시음 필수 (유료)' },
      { id: 14, day: 'Day 3', time: '15:00', location: '다누키코지 상점가 쇼핑', memo: '🛍️ 돈키호테 및 드럭스토어 기념품, 의류 쇼핑' },
      { id: 15, day: 'Day 3', time: '18:00', location: '삿포로역 ➡ 신치토세 공항 복귀', memo: '🚇 [교통] 비행기 출발 2시간 반 전에는 공항 도착하도록 출발' }
    ];
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('sapporo_expenses');
    return saved ? JSON.parse(saved) : [
      { id: 1, category: '식비', amount: 1500, memo: '점심 미소라멘' },
      { id: 2, category: '교통비', amount: 1150, memo: 'JR 공항 쾌속선 열차' },
      { id: 3, category: '식비', amount: 3500, memo: '오도리 비어가든 맥주/안주' },
      { id: 4, category: '교통비', amount: 750, memo: '삿포로-오타루 JR 편도' }
    ];
  });

  const [checklists, setChecklists] = useState(() => {
    const saved = localStorage.getItem('sapporo_checklists');
    return saved ? JSON.parse(saved) : [
      { id: 1, task: '여권 및 비자 확인', completed: true },
      { id: 2, task: '엔화 환전 및 트래블로그 카드 확인', completed: true },
      { id: 3, task: '돼지코(110V 어댑터) 챙기기', completed: false },
      { id: 4, task: '비어가든 축제 사전 정보 체크', completed: false },
      { id: 5, task: '일본 비짓재팬웹(Visit Japan Web) 등록', completed: false }
    ];
  });

  // 입력 폼 상태 변수들
  const [newLocation, setNewLocation] = useState('');
  const [newTime, setNewTime] = useState('12:00');
  const [newMemo, setNewMemo] = useState('');

  const [expCategory, setExpCategory] = useState('식비');
  const [expAmount, setExpAmount] = useState('');
  const [expMemo, setExpMemo] = useState('');

  const [newTodo, setNewTodo] = useState('');

  // 로컬스토리지 동기화
  useEffect(() => {
    localStorage.setItem('sapporo_itineraries', JSON.stringify(itineraries));
  }, [itineraries]);

  useEffect(() => {
    localStorage.setItem('sapporo_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('sapporo_checklists', JSON.stringify(checklists));
  }, [checklists]);

  useEffect(() => {
    localStorage.setItem('sapporo_rate', exchangeRate.toString());
  }, [exchangeRate]);

  // 핸들러 함수들
  const addItinerary = (e) => {
    e.preventDefault();
    if (!newLocation.trim()) return;
    const newItem = { id: Date.now(), day: activeDay, time: newTime, location: newLocation, memo: newMemo };
    setItineraries([...itineraries, newItem].sort((a, b) => a.time.localeCompare(b.time)));
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

  // 금액 계산
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenseKRW = Math.round((totalExpense * exchangeRate) / 100);

  const handleMapSearch = (location) => {
    if (!location) return;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
  };

  const filteredItineraries = itineraries.filter(item => item.day === activeDay);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', paddingBottom: '100px', fontFamily: 'sans-serif' }}>
      {/* 상단 헤더 */}
      <div style={{ background: 'linear-gradient(to right, #ea580c, #f59e0b)', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <p style={{ color: '#ffedd5', fontSize: '12px', fontWeight: 'bold', margin: '0 0 4px 0' }}>SAPPORO SUMMER FESTIVAL '26</p>
        <h1 style={{ fontSize: '28px', fontWeight: '900', margin: 0, color: '#ffffff' }}>삿포로 여름 축제 대시보드</h1>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div style={{ maxWidth: '448px', margin: '0 auto', padding: '16px' }}>
        
        {/* 1. 일정 관리 탭 */}
        {activeTab === 'itinerary' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* 날짜 선택 서브 탭 */}
            <div style={{ display: 'flex', gap: '8px', backgroundColor: '#0f172a', padding: '6px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              {['Day 1', 'Day 2', 'Day 3'].map((day) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: activeDay === day ? '#f97316' : 'transparent',
                    color: activeDay === day ? '#020617' : '#94a3b8',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* 일정 추가 폼 */}
            <form onSubmit={addItinerary} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#fb923c' }}>➕ {activeDay}에 새로운 일정 추가</h3>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} style={{ width: '80px', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px', color: '#fff' }} />
                <input type="text" placeholder="장소 또는 일정명" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} style={{ flex: 1, backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px', color: '#fff' }} />
              </div>
              <input type="text" placeholder="메모 (선택사항)" value={newMemo} onChange={(e) => setNewMemo(e.target.value)} style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px', color: '#fff', boxSizing: 'border-box', marginBottom: '12px' }} />
              <button type="submit" style={{ width: '100%', backgroundColor: '#f97316', border: 'none', borderRadius: '8px', padding: '12px', color: '#020617', fontWeight: 'bold', cursor: 'pointer' }}>일정 추가하기</button>
            </form>

            {/* 타임라인 일정 목록 */}
            <div style={{ borderLeft: '2px solid #1e293b', marginLeft: '12px', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredItineraries.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '14px', margin: '16px 0' }}>등록된 일정이 없습니다. 일정을 추가해 보세요!</p>
              ) : (
                filteredItineraries.map((item) => (
                  <div key={item.id} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#fb923c', backgroundColor: 'rgba(249,115,22,0.1)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>⏰ {item.time}</span>
                      <h4 style={{ margin: 0, flex: 1, fontSize: '16px', fontWeight: 'bold' }}>{item.location}</h4>
                      <div>
                        <button onClick={() => handleMapSearch(item.location)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px' }}>📍</button>
                        <button onClick={() => deleteItinerary(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px' }}>🗑️</button>
                      </div>
                    </div>
                    {item.memo && <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#cbd5e1', lineHeight: '1.4' }}>{item.memo}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 2. 가계부 탭 */}
        {activeTab === 'expense' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* 환율 정보 설정 카드 */}
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>💴 적용 환율 설정</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#cbd5e1' }}>100엔당 원화 환율 입력:</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input 
                  type="number" 
                  value={exchangeRate} 
                  onChange={(e) => setExchangeRate(Number(e.target.value))} 
                  style={{ width: '70px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '6px', color: '#fff', textAlign: 'center', fontWeight: 'bold' }}
                />
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#94a3b8' }}>원</span>
              </div>
            </div>

            {/* 가계부 요약 카드 (엔화/원화 동시 표시) */}
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>총 지출 합계 내역</p>
                <h2 style={{ margin: 0, fontSize: '26px', fontWeight: '900', color: '#fff' }}>
                  {totalExpense.toLocaleString()} <span style={{ color: '#fbbf24', fontSize: '16px', fontWeight: 'bold' }}>JPY</span>
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#a1a1aa', fontWeight: '500' }}>
                  약 {totalExpenseKRW.toLocaleString()} KRW
                </p>
              </div>
              <span style={{ fontSize: '28px', backgroundColor: 'rgba(251,191,36,0.1)', padding: '12px', borderRadius: '12px' }}>💰</span>
            </div>

            {/* 지출 내역 기록 폼 */}
            <form onSubmit={addExpense} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#fbbf24' }}>➕ 지출 내역 추가</h3>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <select value={expCategory} onChange={(e) => setExpCategory(e.target.value)} style={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px', color: '#fff' }}>
                  <option value="식비">식비</option>
                  <option value="교통비">교통비</option>
                  <option value="쇼핑">쇼핑</option>
                  <option value="숙박">숙박</option>
                  <option value="기타">기타</option>
                </select>
                <input type="number" placeholder="금액 (엔화만)" value={expAmount} onChange={(e) => setExpAmount(e.target.value)} style={{ flex: 1, backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px', color: '#fff' }} />
              </div>
              <input type="text" placeholder="내용 및 메모" value={expMemo} onChange={(e) => setExpMemo(e.target.value)} style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px', color: '#fff', boxSizing: 'border-box', marginBottom: '12px' }} />
              <button type="submit" style={{ width: '100%', backgroundColor: '#fbbf24', border: 'none', borderRadius: '8px', padding: '12px', color: '#020617', fontWeight: 'bold', cursor: 'pointer' }}>지출 내역 추가</button>
            </form>

            {/* 전체 지출 비용 리스트 내역 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ margin: '4px 0 4px 4px', fontSize: '13px', color: '#94a3b8', fontWeight: 'bold' }}>📋 상세 지출 내역 목록 ({expenses.length}건)</p>
              {expenses.map((item) => {
                const itemKRW = Math.round((item.amount * exchangeRate) / 100);
                return (
                  <div key={item.id} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '12px', color: '#fbbf24', backgroundColor: 'rgba(251,191,36,0.1)', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold', minWidth: '40px', textAlign: 'center' }}>{item.category}</span>
                      <div>
                        <span style={{ fontSize: '15px', fontWeight: 'bold', display: 'block' }}>{item.memo || item.category}</span>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>≈ {itemKRW.toLocaleString()}원</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 'bold', color: '#f1f5f9' }}>{item.amount.toLocaleString()} ¥</span>
                      <button onClick={() => deleteExpense(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '16px' }}>🗑️</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. 준비물 탭 */}
        {activeTab === 'checklist' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <form onSubmit={addChecklist} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px', display: 'flex', gap: '8px' }}>
              <input type="text" placeholder="예: 멀티탭 챙기기" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} style={{ flex: 1, backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px', color: '#fff' }} />
              <button type="submit" style={{ backgroundColor: '#10b981', border: 'none', borderRadius: '8px', padding: '8px 16px', color: '#020617', fontWeight: 'bold', cursor: 'pointer' }}>등록</button>
            </form>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '8px' }}>
              {checklists.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid #1e293b' }}>
                  <div onClick={() => toggleChecklist(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}>
                    <span>{item.completed ? '✅' : '⬜'}</span>
                    <span style={{ textDecoration: item.completed ? 'line-through' : 'none', color: item.completed ? '#64748b' : '#f8fafc' }}>{item.task}</span>
                  </div>
                  <button onClick={() => deleteChecklist(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>🗑️</button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 하단 고정 메뉴바 */}
      <div style={{ position: 'fixed', bottom: '16px', left: '16px', right: '16px', maxWidth: '448px', margin: '0 auto', backgroundColor: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(8px)', border: '1px solid #1e293b', borderRadius: '16px', padding: '8px', display: 'flex', justifyContent: 'space-around', zIndex: 100 }}>
        <button onClick={() => setActiveTab('itinerary')} style={{ background: 'none', border: 'none', color: activeTab === 'itinerary' ? '#fb923c' : '#94a3b8', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontWeight: activeTab === 'itinerary' ? 'bold' : 'normal' }}>
          <span style={{ fontSize: '20px' }}>🧭</span>
          <span style={{ fontSize: '10px' }}>일정 관리</span>
        </button>
        <button onClick={() => setActiveTab('expense')} style={{ background: 'none', border: 'none', color: activeTab === 'expense' ? '#fbbf24' : '#94a3b8', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontWeight: activeTab === 'expense' ? 'bold' : 'normal' }}>
          <span style={{ fontSize: '20px' }}>💳</span>
          <span style={{ fontSize: '10px' }}>가계부</span>
        </button>
        <button onClick={() => setActiveTab('checklist')} style={{ background: 'none', border: 'none', color: activeTab === 'checklist' ? '#34d399' : '#94a3b8', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontWeight: activeTab === 'checklist' ? 'bold' : 'normal' }}>
          <span style={{ fontSize: '20px' }}>✅</span>
          <span style={{ fontSize: '10px' }}>준비물</span>
        </button>
      </div>
    </div>
  );
}
