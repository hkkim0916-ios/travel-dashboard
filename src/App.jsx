import React, { useState, useEffect } from 'react';

function App() {
  // 5일 차 마스터 풀 스케줄 데이터 기본 세트
  const masterItineraries = [
    { id: 1, day: 'Day 1', time: '15:45', location: '공항 ➡️ 삿포로역', memo: '🚌 [교통] 공항 리무진 버스 (1,300엔)' },
    { id: 2, day: 'Day 1', time: '17:00', location: '호텔 체크인', memo: '🏨 호텔 포르자 삿포로역 숙소 입실' },
    { id: 3, day: 'Day 1', time: '18:00', location: '오도리 공원 맥주축제 전야제', memo: '🍺 [축제] 삿포로 클래식 시원하게 한 잔' },
    { id: 4, day: 'Day 1', time: '19:30', location: '스스키노 이동 후 저녁', memo: '🥩 [식사] 징기스칸 양고기 맛집' },
    { id: 5, day: 'Day 2', time: '07:30', location: '아침 식사 후 이동', memo: '🍱 삿포로역 집결지로 이동 (~07:40)' },
    { id: 6, day: 'Day 2', time: '08:00', location: '비에이·후라노 버스 투어', memo: '🚌 대자연 정복의 날! (~19:00 종료)' },
    { id: 7, day: 'Day 2', time: '19:30', location: '삿포로역 복귀 후 저녁', memo: '🍛 [식사] 따끈한 스프카레' },
    { id: 8, day: 'Day 3', time: '11:00', location: '삿포로역 ➡️ 미나미오타루역', memo: '🚇 [교통] JR 쾌속 에어포트 탑승' },
    { id: 9, day: 'Day 3', time: '12:00', location: '오르골마을 투어', memo: '📸 오르골당 구경 및 점심 식사' },
    { id: 10, day: 'Day 3', time: '15:00', location: '오타루 운하 산책', memo: '🌅 일몰 야경까지 진득하게 감상' },
    { id: 11, day: 'Day 3', time: '19:00', location: '오타루역 ➡️ 삿포로역', memo: '🚇 [교통] JR 쾌속 에어포트 복귀' },
    { id: 12, day: 'Day 4', time: '12:00', location: '오도리 공원 맥주축제', memo: '🍺 [메인] 낮맥 점심 감성 도장깨기!' },
    { id: 13, day: 'Day 4', time: '14:30', location: '시원한 실내 쇼핑', memo: '🛍️ 스텔라플레이스 구경 또는 휴식' },
    { id: 14, day: 'Day 4', time: '18:00', location: '시내 ➡️ 로프웨이역 이동', memo: '🚊 [교통] 노면전차 트램 탑승' },
    { id: 15, day: 'Day 4', time: '19:00', location: '모이와야마 전망대 야경', memo: '✨ 역대급 삿포로 야경 감상' },
    { id: 16, day: 'Day 5', time: '09:30', location: '호텔 체크아웃 & 쇼핑', memo: '🛒 마지막 기념품 털기' },
    { id: 17, day: 'Day 5', time: '11:30', location: '삿포로역 ➡️ 공항역', memo: '🚇 [교통] JR 쾌속 에어포트 탑승' },
    { id: 18, day: 'Day 5', time: '12:15', location: '공항 국내선 청사 투어', memo: '🍜 라멘 도조에서 점심 식사 후 귀국' }
  ];

  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeDay, setActiveDay] = useState('Day 1');
  const [exchangeRate, setExchangeRate] = useState(900);

  const [icocaBalance, setIcocaBalance] = useState(() => {
    const saved = localStorage.getItem('sapporo_icoca');
    return saved ? parseInt(saved, 10) : 2000;
  });
  const [icocaInput, setIcocaInput] = useState('');

  // 🛡️ 로컬스토리지 빈 값 꼬임 방지 안전장치 적용
  const [itineraries, setItineraries] = useState(() => {
    const saved = localStorage.getItem('sapporo_itineraries');
    if (saved) {
      const parsed = JSON.parse(saved);
      // 빈 배열([]) 상태로 꼬여있다면 masterItineraries를 반환하도록 강제 수정
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => a.time.localeCompare(b.time));
      }
    }
    return masterItineraries;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('sapporo_expenses');
    return saved ? JSON.parse(saved) : [
      { id: 1, category: '교통비', amount: 1300, memo: '공항 리무진 버스' },
      { id: 2, category: '식비', amount: 3500, memo: '맥주축제' }
    ];
  });

  const [checklists, setChecklists] = useState(() => {
    const saved = localStorage.getItem('sapporo_checklists');
    return saved ? JSON.parse(saved) : [
      { id: 1, task: '여권 및 QR 코드 확인', completed: true },
      { id: 2, task: '교통카드 챙기기', completed: true },
      { id: 3, task: '돼지코 어댑터 챙기기', completed: false }
    ];
  });

  const [newLocation, setNewLocation] = useState('');
  const [newTime, setNewTime] = useState('12:00');
  const [newMemo, setNewMemo] = useState('');
  const [expCategory, setExpCategory] = useState('식비');
  const [expAmount, setExpAmount] = useState('');
  const [expMemo, setExpMemo] = useState('');
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/JPY')
      .then((res) => res.json())
      .then((data) => {
        if (data?.rates?.KRW) setExchangeRate(parseFloat((data.rates.KRW * 100).toFixed(2)));
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => { localStorage.setItem('sapporo_itineraries', JSON.stringify(itineraries)); }, [itineraries]);
  useEffect(() => { localStorage.setItem('sapporo_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('sapporo_checklists', JSON.stringify(checklists)); }, [checklists]);
  useEffect(() => { localStorage.setItem('sapporo_icoca', icocaBalance.toString()); }, [icocaBalance]);

  // 🔄 브라우저 데이터 강제 초기화용 헬퍼 함수
  const resetToMasterItineraries = () => {
    if (window.confirm('기존 브라우저 캐시를 비우고 기본 5일 차 일정을 다시 불러오시겠습니까?')) {
      setItineraries(masterItineraries);
      localStorage.setItem('sapporo_itineraries', JSON.stringify(masterItineraries));
    }
  };

  const addItinerary = (e) => {
    e.preventDefault();
    if (!newLocation.trim()) return;
    const newItem = { id: Date.now(), day: activeDay, time: newTime, location: newLocation, memo: newMemo };
    // 추가할 때 항상 시간순(time)으로 정렬되도록 보장
    setItineraries([...itineraries, newItem].sort((a, b) => a.time.localeCompare(b.time)));
    setNewLocation('');
    setNewMemo('');
  };

  const deleteItinerary = (id) => {
    if (window.confirm('삭제하시겠습니까?')) setItineraries(itineraries.filter(item => item.id !== id));
  };

  const addExpense = (e) => {
    e.preventDefault();
    if (!expAmount) return;
    const amountNum = parseInt(expAmount, 10);
    setExpenses([...expenses, { id: Date.now(), category: expCategory, amount: amountNum, memo: expMemo }]);
    if (expCategory === '교통비') setIcocaBalance(prev => Math.max(0, prev - amountNum));
    setExpAmount('');
    setExpMemo('');
  };

  const deleteExpense = (id) => setExpenses(expenses.filter(item => item.id !== id));

  const handleChargeIcoca = (e) => {
    e.preventDefault();
    if (!icocaInput) return;
    setIcocaBalance(prev => prev + parseInt(icocaInput, 10));
    setIcocaInput('');
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

  const deleteChecklist = (id) => setChecklists(checklists.filter(item => item.id !== id));

  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenseKRW = Math.round((totalExpense * exchangeRate) / 100);

  // 현재 선택된 일차(Day)에 맞는 일정 목록 필터링
  const filteredItineraries = itineraries.filter(item => item.day === activeDay);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', paddingBottom: '110px', fontFamily: 'sans-serif' }}>
      
      {/* 헤더 */}
      <div style={{ background: 'linear-gradient(to right, #ea580c, #f59e0b)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: '#ffedd5', fontSize: '12px', fontWeight: 'bold', margin: '0 0 4px 0' }}>SAPPORO 2026</p>
          <h1 style={{ fontSize: '24px', fontWeight: '900', margin: 0, color: '#ffffff' }}>삿포로 여름 축제 대시보드</h1>
        </div>
        {/* 🔄 수동 복구 버튼 추가 */}
        <button type="button" onClick={resetToMasterItineraries} style={{ backgroundColor: '#ffffff', color: '#020617', border: 'none', borderRadius: '20px', padding: '6px 12px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>🔄 일정 복원</button>
      </div>

      <div style={{ maxWidth: '448px', margin: '0 auto', padding: '16px' }}>
        
        {/* 1. 대시보드 탭 */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#fb923c' }}>🎉 스케줄 정상 동기화</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>총 {itineraries.length}개의 일정이 활성화됨</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: '#38bdf8', display: 'block' }}>환율 (100엔)</span>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{exchangeRate}원</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div onClick={() => setActiveTab('expense')} style={{ backgroundColor: '#0f172a', padding: '14px', borderRadius: '16px', cursor: 'pointer', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>💰 총 지출</span>
                <h4 style={{ margin: '4px 0 0 0', color: '#fbbf24', fontSize: '16px' }}>{totalExpense.toLocaleString()} ¥</h4>
              </div>
              <div onClick={() => setActiveTab('expense')} style={{ backgroundColor: '#0b1329', padding: '14px', borderRadius: '16px', cursor: 'pointer', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '12px', color: '#60a5fa' }}>💳 카드 잔액</span>
                <h4 style={{ margin: '4px 0 0 0', color: '#fff', fontSize: '16px' }}>{icocaBalance.toLocaleString()} ¥</h4>
              </div>
            </div>

            <div style={{ backgroundColor: '#0f172a', borderRadius: '16px', padding: '16px', border: '1px solid #1e293b' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#fb923c' }}>🧭 전체 일정 하이라이트 요약</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {itineraries.slice(0, 6).map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '10px', borderLeft: '2px solid #ea580c', paddingLeft: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#fb923c', fontWeight: 'bold', minWidth: '70px' }}>{item.day} {item.time}</span>
                    <span style={{ fontSize: '13px' }}>{item.location}</span>
                  </div>
                ))}
                {itineraries.length > 6 && <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#64748b', textAlign: 'center' }}>상세 타임라인은 하단 '일정 관리' 탭에서 확인 가능합니다.</p>}
              </div>
            </div>
          </div>
        )}

        {/* 2. 일정 관리 탭 */}
        {activeTab === 'itinerary' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 상단 일차 변경 탭 바 */}
            <div style={{ display: 'flex', gap: '4px', backgroundColor: '#0f172a', padding: '4px', borderRadius: '12px', overflowX: 'auto', border: '1px solid #1e293b' }}>
              {['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'].map(day => (
                <button key={day} type="button" onClick={() => setActiveDay(day)} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', backgroundColor: activeDay === day ? '#f97316' : 'transparent', color: activeDay === day ? '#020617' : '#94a3b8', fontWeight: 'bold', cursor: 'pointer', minWidth: '65px' }}>{day}</button>
              ))}
            </div>

            {/* 일정 직접 추가 폼 */}
            <form onSubmit={addItinerary} style={{ backgroundColor: '#0f172a', borderRadius: '16px', padding: '16px', border: '1px solid #1e293b' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#fb923c', fontWeight: 'bold' }}>➕ {activeDay} 일정 추가하기</p>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} style={{ width: '80px', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '6px', padding: '6px', color: '#fff' }} />
                <input type="text" placeholder="예: 스프카레 맛집 방문" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} style={{ flex: 1, backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '6px', padding: '6px', color: '#fff' }} />
              </div>
              <input type="text" placeholder="간단한 메모 (선택사항)" value={newMemo} onChange={(e) => setNewMemo(e.target.value)} style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '6px', padding: '6px', color: '#fff', boxSizing: 'border-box', marginBottom: '8px' }} />
              <button type="submit" style={{ width: '100%', backgroundColor: '#f97316', border: 'none', borderRadius: '6px', padding: '10px', fontWeight: 'bold', cursor: 'pointer', color: '#020617' }}>스케줄 등록</button>
            </form>

            {/* 시간별 타임라인 렌더링 리스트 */}
            <div style={{ borderLeft: '2px solid #334155', paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredItineraries.length === 0 ? (
                <div style={{ padding: '20px 0', textAlign: 'center' }}>
                  <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>📭 등록된 일정이 없습니다.</p>
                  <p style={{ color: '#475569', fontSize: '11px', margin: '4px 0 0 0' }}>위 입력창을 통해 첫 일정을 입력해보세요.</p>
                </div>
              ) : (
                filteredItineraries.map(item => (
                  <div key={item.id} style={{ backgroundColor: '#0f172a', borderRadius: '12px', padding: '14px', border: '1px solid #1e293b', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: '#fb923c', fontWeight: 'bold', backgroundColor: '#1e293b', padding: '2px 6px', borderRadius: '4px' }}>{item.time}</span>
                      <h4 style={{ margin: 0, flex: 1, marginLeft: '10px', fontSize: '15px', color: '#f8fafc' }}>{item.location}</h4>
                      <button type="button" onClick={() => deleteItinerary(item.id)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '14px' }}>🗑️</button>
                    </div>
                    {item.memo && <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#94a3b8', borderTop: '1px dashed #1e293b', paddingTop: '6px' }}>{item.memo}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 3. 가계부 탭 */}
        {activeTab === 'expense' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: '#0f172a', borderRadius: '16px', padding: '16px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>총 지출 합계</span>
              <h2 style={{ margin: '4px 0', color: '#fff' }}>{totalExpense.toLocaleString()} JPY</h2>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>≈ {totalExpenseKRW.toLocaleString()} 원</p>
            </div>

            <form onSubmit={addExpense} style={{ backgroundColor: '#0f172a', borderRadius: '16px', padding: '16px', border: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                <select value={expCategory} onChange={(e) => setExpCategory(e.target.value)} style={{ backgroundColor: '#020617', border: '1px solid #1e293b', color: '#fff', borderRadius: '6px', padding: '6px' }}>
                  <option value="식비">식비</option>
                  <option value="교통비">교통비</option>
                  <option value="쇼핑">쇼핑</option>
                </select>
                <input type="number" placeholder="금액 (엔화)" value={expAmount} onChange={(e) => setExpAmount(e.target.value)} style={{ flex: 1, backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '6px', padding: '6px', color: '#fff' }} />
              </div>
              <input type="text" placeholder="내역 설명" value={expMemo} onChange={(e) => setExpMemo(e.target.value)} style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '6px', padding: '6px', color: '#fff', boxSizing: 'border-box', marginBottom: '8px' }} />
              <button type="submit" style={{ width: '100%', backgroundColor: '#fbbf24', border: 'none', borderRadius: '6px', padding: '8px', fontWeight: 'bold', cursor: 'pointer', color: '#020617' }}>지출 등록</button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {expenses.map(item => (
                <div key={item.id} style={{ backgroundColor: '#0f172a', borderRadius: '12px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #1e293b' }}>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{item.memo || item.category}</span>
                    <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '6px' }}>({item.category})</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 'bold', marginRight: '8px' }}>{item.amount} ¥</span>
                    <button type="button" onClick={() => deleteExpense(item.id)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. 준비물 탭 */}
        {activeTab === 'checklist' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <form onSubmit={addChecklist} style={{ display: 'flex', gap: '6px' }}>
              <input type="text" placeholder="체크리스트 추가" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} style={{ flex: 1, backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px', color: '#fff' }} />
              <button type="submit" style={{ backgroundColor: '#10b981', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 'bold', color: '#020617' }}>추가</button>
            </form>

            <div style={{ backgroundColor: '#0f172a', borderRadius: '16px', padding: '4px', border: '1px solid #1e293b' }}>
              {checklists.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid #1e293b' }}>
                  <div onClick={() => toggleChecklist(item.id)} style={{ cursor: 'pointer', display: 'flex', gap: '8px' }}>
                    <span>{item.completed ? '✅' : '⬜'}</span>
                    <span style={{ textDecoration: item.completed ? 'line-through' : 'none', color: item.completed ? '#64748b' : '#fff' }}>{item.task}</span>
                  </div>
                  <button type="button" onClick={() => deleteChecklist(item.id)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>🗑️</button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 하단 고정 탭 바 */}
      <div style={{ position: 'fixed', bottom: '16px', left: '16px', right: '16px', maxWidth: '448px', margin: '0 auto', backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid #1e293b', borderRadius: '16px', padding: '8px 0', display: 'flex', justifyContent: 'space-around', zIndex: 100 }}>
        <button type="button" onClick={() => setActiveTab('dashboard')} style={{ background: 'none', border: 'none', color: activeTab === 'dashboard' ? '#ea580c' : '#94a3b8', cursor: 'pointer' }}>🏠<br/><span style={{ fontSize: '10px' }}>대시보드</span></button>
        <button type="button" onClick={() => setActiveTab('itinerary')} style={{ background: 'none', border: 'none', color: activeTab === 'itinerary' ? '#fb923c' : '#94a3b8', cursor: 'pointer' }}>🧭<br/><span style={{ fontSize: '10px' }}>일정 관리</span></button>
        <button type="button" onClick={() => setActiveTab('expense')} style={{ background: 'none', border: 'none', color: activeTab === 'expense' ? '#fbbf24' : '#94a3b8', cursor: 'pointer' }}>💳<br/><span style={{ fontSize: '10px' }}>가계부</span></button>
        <button type="button" onClick={() => setActiveTab('checklist')} style={{ background: 'none', border: 'none', color: activeTab === 'checklist' ? '#34d399' : '#94a3b8', cursor: 'pointer' }}>✅<br/><span style={{ fontSize: '10px' }}>준비물</span></button>
      </div>

    </div>
  );
}

export default App;
