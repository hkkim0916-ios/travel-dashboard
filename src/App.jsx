import React, { useState, useEffect } from 'react';

function App() {
  // 5일 차 마스터 풀 스케줄 데이터
  const masterItineraries = [
    // 📅 1일 차 (7/21, 화)
    { id: 1, day: 'Day 1', time: '15:45', location: '공항 ➡️ 삿포로역', memo: '🚌 [교통] 공항 리무진 버스 (스이카/이코카 1,300엔)' },
    { id: 2, day: 'Day 1', time: '17:00', location: '호텔 체크인', memo: '🏨 호텔 포르자 삿포로역 숙소 입실 및 짐 풀기' },
    { id: 3, day: 'Day 1', time: '18:00', location: '오도리 공원 맥주축제 전야제', memo: '🍺 [축제] 삿포로 클래식 부스 띡! 시원하게 한 잔' },
    { id: 4, day: 'Day 1', time: '19:30', location: '스스키노 이동 후 저녁', memo: '🥩 [식사] 징기스칸 양고기 맛집 조지기' },

    // 📅 2일 차 (7/22, 수)
    { id: 5, day: 'Day 2', time: '07:30', location: '아침 식사 후 이동', memo: '🍱 든든하게 아침 챙겨 먹고 삿포로역 집결지로 이동 (~07:40)' },
    { id: 6, day: 'Day 2', time: '08:00', location: '비에이·후라노 버스 투어', memo: '🚌 대자연 정복의 날! (~19:00 종료 / 추가 교통비 0원)' },
    { id: 7, day: 'Day 2', time: '19:30', location: '삿포로역 복귀 후 저녁', memo: '🍛 [식사] 투어 후 피로를 날려줄 따끈한 스프카레' },

    // 📅 3일 차 (7/23, 목)
    { id: 8, day: 'Day 3', time: '11:00', location: '삿포로역 ➡️ 미나미오타루역', memo: '🚇 [교통] JR 쾌속 에어포트 탑승 (사전 지정석)' },
    { id: 9, day: 'Day 3', time: '12:00', location: '오르골마을 투어', memo: '📸 오르골당 구경, 르타오 디저트, 스시로 맛있는 점심 식사 (~15:00)' },
    { id: 10, day: 'Day 3', time: '15:00', location: '오타루 운하 산책', memo: '🌅 평지 산책하며 낮 풍경부터 일몰 야경까지 진득하게 감상 (~18:30)' },
    { id: 11, day: 'Day 3', time: '19:00', location: '오타루역 ➡️ 삿포로역', memo: '🚇 [교통] JR 쾌속 에어포트 탑승 (사전 지정석 / ~19:40 복귀)' },

    // 📅 4일 차 (7/24, 금)
    { id: 12, day: 'Day 4', time: '12:00', location: '오도리 공원 맥주축제', memo: '🍺 [메인] 낮맥 점심 감성 도장깨기! (스이카/이코카 결제 완료)' },
    { id: 13, day: 'Day 4', time: '14:30', location: '시원한 실내 쇼핑', memo: '🛍️ 삿포로역 스텔라플레이스 구경 혹은 숙소에서 꿀맛 같은 휴식 (~17:30)' },
    { id: 14, day: 'Day 4', time: '18:00', location: '시내 ➡️ 로프웨이역 이동', memo: '🚊 [교통] 노면전차 트램 탑승 (스이카/이코카 200엔 / ~18:45)' },
    { id: 15, day: 'Day 4', time: '19:00', location: '모이와야마 전망대 야경', memo: '✨ 저녁 7시 정각 일몰 타이밍 저격! 역대급 삿포로 야경 감상 (~20:30)' },

    // 📅 5일 차 (7/25, 토)
    { id: 16, day: 'Day 5', time: '09:30', location: '호텔 체크아웃 & 쇼핑', memo: '🛒 역 근처에서 마지막 기념품 및 드럭스토어 털기 (~11:00)' },
    { id: 17, day: 'Day 5', time: '11:30', location: '삿포로역 ➡️ 공항역', memo: '🚇 [교통] JR 쾌속 에어포트 탑승 (사전 지정석 / ~12:10)' },
    { id: 18, day: 'Day 5', time: '12:15', location: '공항 국내선 청사 투어', memo: '🍜 라멘 도조에서 든든하게 점심 식사 후 비행기 타고 귀국 (~14:30)' }
  ];

  // 메인 메뉴 탭 설정 ('dashboard', 'itinerary', 'expense', 'checklist')
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Day 서브 탭 상태 변수 (기본값 Day 1)
  const [activeDay, setActiveDay] = useState('Day 1');
  
  // 실시간 환율 상태 (기본값 900원)
  const [exchangeRate, setExchangeRate] = useState(900);
  const [rateLoading, setRateLoading] = useState(true);

  // 이코카 카드 잔액 상태 관리
  const [icocaBalance, setIcocaBalance] = useState(() => {
    const saved = localStorage.getItem('sapporo_icoca');
    return saved ? parseInt(saved, 10) : 2000;
  });
  const [icocaInput, setIcocaInput] = useState('');

  // 로컬 스토리지 연동 및 초기 데이터 바인딩
  const [itineraries, setItineraries] = useState(() => {
    const saved = localStorage.getItem('sapporo_itineraries');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) return parsed;
    }
    return masterItineraries;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('sapporo_expenses');
    return saved ? JSON.parse(saved) : [
      { id: 1, category: '교통비', amount: 1300, memo: '공항 리무진 버스' },
      { id: 2, category: '식비', amount: 3500, memo: '오도리 맥주축제 전야제' },
      { id: 3, category: '교통비', amount: 200, memo: '모이와야마 트램' }
    ];
  });

  const [checklists, setChecklists] = useState(() => {
    const saved = localStorage.getItem('sapporo_checklists');
    return saved ? JSON.parse(saved) : [
      { id: 1, task: '여권 소지 및 비짓재팬웹 QR 코드 확인', completed: true },
      { id: 2, task: '이코카(ICOCA) 또는 스이카 카드 챙기기', completed: true },
      { id: 3, task: '돼지코(110V 어댑터) 챙기기', completed: false },
      { id: 4, task: '비에이 투어 집결 위치 및 시간 재확인', completed: false }
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

  // 환율 API 호출
  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/JPY')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates && data.rates.KRW) {
          const rate100Yen = data.rates.KRW * 100;
          setExchangeRate(parseFloat(rate100Yen.toFixed(2)));
        }
        setRateLoading(false);
      })
      .catch((err) => {
        console.error('환율 로드 실패:', err);
        setRateLoading(false);
      });
  }, []);

  // 로컬스토리지 저장 동기화
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
    localStorage.setItem('sapporo_icoca', icocaBalance.toString());
  }, [icocaBalance]);

  // 일정 추가 함수
  const addItinerary = (e) => {
    e.preventDefault();
    if (!newLocation.trim()) return;
    const newItem = { id: Date.now(), day: activeDay, time: newTime, location: newLocation, memo: newMemo };
    setItineraries([...itineraries, newItem].sort((a, b) => a.time.localeCompare(b.time)));
    setNewLocation('');
    setNewMemo('');
  };

  const deleteItinerary = (id) => {
    if (window.confirm('이 일정을 삭제하시겠습니까?')) {
      setItineraries(itineraries.filter(item => item.id !== id));
    }
  };

  // 가계부 지출 추가 함수
  const addExpense = (e) => {
    e.preventDefault();
    if (!expAmount || isNaN(expAmount)) return;
    const amountNum = parseInt(expAmount, 10);
    setExpenses([...expenses, { id: Date.now(), category: expCategory, amount: amountNum, memo: expMemo }]);
    if (expCategory === '교통비') {
      setIcocaBalance(prev => Math.max(0, prev - amountNum));
    }
    setExpAmount('');
    setExpMemo('');
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(item => item.id !== id));
  };

  const handleChargeIcoca = (e) => {
    e.preventDefault();
    if (!icocaInput || isNaN(icocaInput)) return;
    setIcocaBalance(prev => prev + parseInt(icocaInput, 10));
    setIcocaInput('');
  };

  // 준비물 체크 토글 및 관리 함수
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

  // 금액 계산용 변수들
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenseKRW = Math.round((totalExpense * exchangeRate) / 100);

  // 구글 지도 새창 검색용 안전 백틱 문법 수정 적용
  const handleMapSearch = (locationName) => {
    if (!locationName) return;
    const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`;
    window.open(searchUrl, '_blank');
  };

  // 필터 및 진행률 데이터
  const filteredItineraries = itineraries.filter(item => item.day === activeDay);
  const completedCheckCount = checklists.filter(c => c.completed).length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', paddingBottom: '110px', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      
      {/* 상단 헤더 배너 */}
      <div style={{ background: 'linear-gradient(to right, #ea580c, #f59e0b)', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <p style={{ color: '#ffedd5', fontSize: '12px', fontWeight: 'bold', margin: '0 0 4px 0' }}>SAPPORO SUMMER FESTIVAL '26</p>
        <h1 style={{ fontSize: '24px', fontWeight: '900', margin: 0, color: '#ffffff' }}>삿포로 여름 축제 대시보드</h1>
      </div>

      {/* 모바일 뷰 전용 중앙 배치 래퍼 */}
      <div style={{ maxWidth: '448px', margin: '0 auto', padding: '16px', boxSizing: 'border-box' }}>
        
        {/* ==================== 1. 종합 대시보드 탭 ==================== */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* 상태 바 알림 */}
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '17px', fontWeight: 'bold', color: '#fb923c' }}>🎉 스케줄 로드 완료!</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>삿포로 마스터 일정이 정상 반영되었습니다.</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: '#38bdf8', display: 'block', fontWeight: 'bold' }}>실시간 환율</span>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#f1f5f9' }}>{rateLoading ? '🔄 로딩중' : `¥100 = ${exchangeRate}원`}</span>
              </div>
            </div>

            {/* 자산 현황 요약 매트릭스 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div onClick={() => setActiveTab('expense')} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '14px', cursor: 'pointer' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>💰 현재 가계부 지출</span>
                <h4 style={{ margin: '6px 0 2px 0', fontSize: '18px', fontWeight: 'bold', color: '#fbbf24' }}>{totalExpense.toLocaleString()} ¥</h4>
                <span style={{ fontSize: '11px', color: '#64748b' }}>≈ {totalExpenseKRW.toLocaleString()}원</span>
              </div>
              <div onClick={() => setActiveTab('expense')} style={{ backgroundColor: '#0b1329', border: '1px solid #1d4ed8', borderRadius: '16px', padding: '14px', cursor: 'pointer' }}>
                <span style={{ fontSize: '12px', color: '#60a5fa', fontWeight: 'bold' }}>💳 교통카드 잔액</span>
                <h4 style={{ margin: '6px 0 2px 0', fontSize: '18px', fontWeight: 'bold', color: '#eff6ff' }}>{icocaBalance.toLocaleString()} ¥</h4>
                <span style={{ fontSize: '11px', color: '#3b82f6' }}>스이카 / 이코카 연동</span>
              </div>
            </div>

            {/* 준비물 달성 그래프 바 */}
            <div onClick={() => setActiveTab('checklist')} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '16px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#34d399' }}>✅ 체크리스트 달성도</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{completedCheckCount} / {checklists.length}</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#020617', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${checklists.length ? (completedCheckCount / checklists.length) * 100 : 0}%`, height: '100%', backgroundColor: '#10b981', transition: 'width 0.3s' }}></div>
              </div>
            </div>

            {/* 하이라이트 동선 목록 */}
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#f8fafc' }}>🧭 주요 하이라이트 동선</h4>
                <button onClick={() => setActiveTab('itinerary')} style={{ background: 'none', border: 'none', color: '#fb923c', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>전체 보기 ➡</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {itineraries.filter(i => [1, 3, 6, 9, 12, 15, 18].includes(i.id)).map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: '12px', borderLeft: '2px solid #334155', paddingLeft: '12px', marginLeft: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#fb923c', fontWeight: 'bold', minWidth: '75px' }}>{item.day} {item.time}</span>
                    <span style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: '500' }}>{item.location}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================== 2. 일정 관리 탭 ==================== */}
        {activeTab === 'itinerary' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Day 1 ~ 5 선택 상단 서브 슬라이더 */}
            <div style={{ display: 'flex', gap: '6px', backgroundColor: '#0f172a', padding: '6px', borderRadius: '12px', border: '1px solid #1e293b', overflowX: 'auto' }}>
              {['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'].map((day) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  style={{
                    flex: '1 0 auto',
                    padding: '10px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: activeDay === day ? '#f97316' : 'transparent',
                    color: activeDay === day ? '#020617' : '#94a3b8',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* 스케줄 추가 폼 */}
            <form onSubmit={addItinerary} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '16px' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#fb923c' }}>➕ {activeDay} 일정 추가하기</h3>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} style={{ width: '80px', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px', color: '#fff' }} />
                <input type="text" placeholder="예: 스프카레 맛집 방문" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} style={{ flex: 1, backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px', color: '#fff' }} />
              </div>
              <input type="text" placeholder="간단한 메모 (선택사항)" value={newMemo} onChange={(e) => setNewMemo(e.target.value)} style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px', color: '#fff', boxSizing: 'border-box', marginBottom: '10px' }} />
              <button type="submit" style={{ width: '100%', backgroundColor: '#f97316', border: 'none', borderRadius: '8px', padding: '10px', color: '#020617', fontWeight: 'bold', cursor: 'pointer' }}>스케줄 등록</button>
            </form>

            {/* 타임라인 보드 영역 */}
            <div style={{ borderLeft: '2px solid #334155', marginLeft: '12px', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredItineraries.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '14px', fontStyle: 'italic' }}>등록된 일정이 없습니다.</p>
              ) : (
                filteredItineraries.map((item) => (
                  <div key={item.id} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#fb923c', backgroundColor: 'rgba(249,115,22,0.1)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{item.time}</span>
                      <h4 style={{ margin: 0, flex: 1, fontSize: '15px', fontWeight: 'bold', color: '#f8fafc' }}>{item.location}</h4>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button type="button" onClick={() => handleMapSearch(item.location)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px' }}>📍</button>
                        <button type="button" onClick={() => deleteItinerary(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px' }}>🗑️</button>
                      </div>
                    </div>
                    {item.memo && <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.4' }}>{item.memo}</p>}
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* ==================== 3. 가계부 탭 ==================== */}
        {activeTab === 'expense' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* 교통카드 잔액 확인 및 충전단 */}
            <div style={{ backgroundColor: '#0b1329', border: '1px solid #1d4ed8', borderRadius: '16px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 'bold', backgroundColor: 'rgba(59,130,246,0.1)', padding: '2px 6px', borderRadius: '4px' }}>IC CARD BALANCE</span>
                  <h4 style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: 'bold', color: '#eff6ff' }}>스이카/이코카 카드 잔액</h4>
                </div>
                <span style={{ fontSize: '20px', fontWeight: '900', color: '#60a5fa' }}>{icocaBalance.toLocaleString()} ¥</span>
              </div>
              <form onSubmit={handleChargeIcoca} style={{ display: 'flex', gap: '6px' }}>
                <input 
                  type="number" 
                  placeholder="충전금액(엔화) 입력" 
                  value={icocaInput}
                  onChange={(e) => setIcocaInput(e.target.value)}
                  style={{ flex: 1, backgroundColor: '#020617', border: '1px solid #1e4ed8', borderRadius: '6px', padding: '6px 10px', color: '#fff', fontSize: '13px' }}
                />
                <button type="submit" style={{ backgroundColor: '#2563eb', border: 'none', borderRadius: '6px', padding: '6px 12px', color: '#fff', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>충전</button>
              </form>
            </div>

            {/* 총 예산 합계 */}
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>총 지출 내역 합계</p>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: '#fff' }}>
                  {totalExpense.toLocaleString()} <span style={{ color: '#fbbf24', fontSize: '16px' }}>JPY</span>
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#a1a1aa' }}>
                  약 {totalExpenseKRW.toLocaleString()} KRW (환율 반영)
                </p>
              </div>
              <span style={{ fontSize: '24px', backgroundColor: 'rgba(251,191,36,0.1)', padding: '12px', borderRadius: '12px' }}>💰</span>
            </div>

            {/* 영수증 등록 입력 폼 */}
            <form onSubmit={addExpense} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '16px' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#fbbf24' }}>➕ 지출 등록</h3>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <select value={expCategory} onChange={(e) => setExpCategory(e.target.value)} style={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px', color: '#fff' }}>
                  <option value="식비">식비</option>
                  <option value="교통비">교통비</option>
                  <option value="쇼핑">쇼핑</option>
                  <option value="기타">기타</option>
                </select>
                <input type="number" placeholder="금액 (¥)" value={expAmount} onChange={(e) => setExpAmount(e.target.value)} style={{ flex: 1, backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding
