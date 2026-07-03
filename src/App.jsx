import React, { useState, useEffect } from 'react';

export default function App() {
  // 메인 메뉴 탭 ('dashboard': 종합 대시보드, 'itinerary': 일정 관리, 'expense': 가계부, 'checklist': 준비물)
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // 🌟 Day 1부터 Day 5까지 확장된 날짜별 서브 탭 상태 변수
  const [activeDay, setActiveDay] = useState('Day 1');
  
  // 실시간 환율 상태 (조회시점 환율 자동 반영용, 기본값 900원 설정)
  const [exchangeRate, setExchangeRate] = useState(900);
  const [rateLoading, setRateLoading] = useState(true);

  // 이코카(ICOCA) 카드 충전 및 잔액 상태 관리 (초기 금액 2,000엔 기본 세팅)
  const [icocaBalance, setIcocaBalance] = useState(() => {
    const saved = localStorage.getItem('sapporo_icoca');
    return saved ? parseInt(saved, 10) : 2000;
  });
  const [icocaInput, setIcocaInput] = useState('');

  // 🌟 보내주신 'SAPPORO TRAVEL MASTER SCHEDULE' 데이터 완벽 반영!
  const [itineraries, setItineraries] = useState(() => {
    const saved = localStorage.getItem('sapporo_itineraries');
    return saved ? JSON.parse(saved) : [
      // Day 1
      { id: 1, day: 'Day 1', time: '15:45', location: '공항 ➡ 삿포로역 이동', memo: '🚌 [교통] 공항 리무진 버스 탑승 (이코카/스이카 가능, 1,300엔)' },
      { id: 2, day: 'Day 1', time: '17:00', location: '호텔 체크인 (호텔 포르자 삿포로역)', memo: '🏨 숙소 짐 풀고 가벼운 복장으로 정비하기' },
      { id: 3, day: 'Day 1', time: '18:00', location: '오도리 공원 맥주축제 전야제', memo: '🍺 [축제] 삿포로 클래식 부스 조지기!' },
      { id: 4, day: 'Day 1', time: '19:30', location: '스스키노 저녁 식사', memo: '🥩 [식사] 삿포로 여행 필수 코스인 징기스칸 양고기 맛보기' },

      // Day 2
      { id: 5, day: 'Day 2', time: '07:40', location: '삿포로역 집결지 이동', memo: '🍱 든든하게 아침 식사 챙겨 먹고 출발하기' },
      { id: 6, day: 'Day 2', time: '08:00', location: '비에이·후라노 버스 투어 출발', memo: '🚌 [투어] 대자연 정복하기 (~19:00 종료, 추가 교통비 0원)' },
      { id: 7, day: 'Day 2', time: '19:30', location: '삿포로역 복귀 후 저녁 식사', memo: '🍛 [식사] 얼어붙은 몸을 녹여줄 따끈한 스프카레' },

      // Day 3
      { id: 8, day: 'Day 3', time: '11:00', location: '삿포로역 ➡ 미나미오타루역', memo: '🚇 [교통] JR 쾌속 에어포트 탑승 (사전 지정석)' },
      { id: 9, day: 'Day 3', time: '12:00', location: '오르골마을 투어 및 점심', memo: '📸 오르골당 관광, 르타오 디저트 폭발, 스시 맛집 점심 식사' },
      { id: 10, day: 'Day 3', time: '15:00', location: '오타루 운하 평지 산책', memo: '🌅 낮 풍경부터 노을빛, 그리고 환상적인 일몰 야경까지 감상하기' },
      { id: 11, day: 'Day 3', time: '19:00', location: '오타루역 ➡ 삿포로역 복귀', memo: '🚇 [교통] JR 쾌속 에어포트 탑승 (사전 지정석)' },

      // Day 4
      { id: 12, day: 'Day 4', time: '12:00', location: '오도리 공원 맥주축제 낮맥', memo: '🍺 [메인] 낮맥 감성 폭발! 점심 식사 겸 맥주 즐기기 (이코카 결제 가능)' },
      { id: 13, day: 'Day 4', time: '14:30', location: '실내 쇼핑 및 숙소 휴식', memo: '🛍️ 삿포로역 스텔라플레이스 구경 후 체력 안배용 낮잠/휴식' },
      { id: 14, day: 'Day 4', time: '18:00', location: '시내 ➡ 로프웨이역 이동', memo: '🚊 [교통] 감성 가득 노면전차 트램 탑승 (이코카 가능, 200엔)' },
      { id: 15, day: 'Day 4', time: '19:00', location: '모이와야마 전망대 야경', memo: '✨ [야경] 저녁 7시 정각 일몰 타이밍 저격하여 역대급 야경 감상 (~20:30)' },

      // Day 5
      { id: 16, day: 'Day 5', time: '09:30', location: '호텔 체크아웃 & 막판 쇼핑', memo: '🛒 역 근처 드러그스토어 및 돈키호테 마지막 기념품 쇼핑' },
      { id: 17, day: 'Day 5', time: '11:30', location: '삿포로역 ➡ 신치토세 공항역', memo: '🚇 [교통] JR 쾌속 에어포트 탑승 (사전 지정석)' },
      { id: 18, day: 'Day 5', time: '12:15', location: '공항 국내선 청사 투어 & 점심', memo: '🍜 [식사] 라멘 도조 골목에서 마지막 라멘 한 그릇 비우고 귀국길!' }
    ];
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('sapporo_expenses');
    return saved ? JSON.parse(saved) : [
      { id: 1, category: '교통비', amount: 1300, memo: '공항 리무진 버스' },
      { id: 2, category: '식비', amount: 3500, memo: '오도리 맥주축제 전야제 맥주/안주' },
      { id: 3, category: '식비', amount: 4000, memo: '스스키노 징기스칸 저녁' },
      { id: 4, category: '교통비', amount: 200, memo: '모이와야마 트램 편도' }
    ];
  });

  const [checklists, setChecklists] = useState(() => {
    const saved = localStorage.getItem('sapporo_checklists');
    return saved ? JSON.parse(saved) : [
      { id: 1, task: '여권 소지 및 비짓재팬웹 QR 코드 확인', completed: true },
      { id: 2, task: '이코카(ICOCA) 실물 교통카드 지갑 챙기기', completed: true },
      { id: 3, task: '돼지코(110V 어댑터) 가방 확인', completed: false },
      { id: 4, task: '비에이 투어 집결 위치 사전 파악', completed: false }
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

  // 실시간 환율 API 호출
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
    localStorage.setItem('sapporo_icoca', icocaBalance.toString());
  }, [icocaBalance]);

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

  // 계산 공식
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenseKRW = Math.round((totalExpense * exchangeRate) / 100);

  const handleMapSearch = (location) => {
    if (!location) return;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
  };

  const filteredItineraries = itineraries.filter(item => item.day === activeDay);
  const completedCheckCount = checklists.filter(c => c.completed).length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', paddingBottom: '110px', fontFamily: 'sans-serif' }}>
      {/* 상단 헤더 */}
      <div style={{ background: 'linear-gradient(to right, #ea580c, #f59e0b)', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <p style={{ color: '#ffedd5', fontSize: '12px', fontWeight: 'bold', margin: '0 0 4px 0' }}>SAPPORO SUMMER FESTIVAL '26</p>
        <h1 style={{ fontSize: '28px', fontWeight: '900', margin: 0, color: '#ffffff' }}>삿포로 여름 축제 대시보드</h1>
      </div>

      {/* 메인 뷰포트 영역 */}
      <div style={{ maxWidth: '448px', margin: '0 auto', padding: '16px' }}>
        
        {/* ==================== 1. 종합 대시보드 화면 탭 ==================== */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* 상단 환율 헤드 */}
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 'bold', color: '#fb923c' }}>🎉 마스터 일정 장착 완료!</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>삿포로 여름 축제를 스마트하게 즐겨봐요.</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: '#38bdf8', display: 'block', fontWeight: 'bold' }}>실시간 환율</span>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#f1f5f9' }}>{rateLoading ? '🔄 로딩중' : `¥100 = ${exchangeRate}원`}</span>
              </div>
            </div>

            {/* 자산 관리 섹션 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div onClick={() => setActiveTab('expense')} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '14px', cursor: 'pointer' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>💰 현재 가계부 지출</span>
                <h4 style={{ margin: '6px 0 2px 0', fontSize: '18px', fontWeight: 'bold', color: '#fbbf24' }}>{totalExpense.toLocaleString()} ¥</h4>
                <span style={{ fontSize: '11px', color: '#64748b' }}>≈ {totalExpenseKRW.toLocaleString()}원</span>
              </div>
              <div onClick={() => setActiveTab('expense')} style={{ backgroundColor: '#0b1329', border: '1px solid #1d4ed8', borderRadius: '16px', padding: '14px', cursor: 'pointer' }}>
                <span style={{ fontSize: '12px', color: '#60a5fa', fontWeight: 'bold' }}>💳 이코카 실시간 잔액</span>
                <h4 style={{ margin: '6px 0 2px 0', fontSize: '18px', fontWeight: 'bold', color: '#eff6ff' }}>{icocaBalance.toLocaleString()} ¥</h4>
                <span style={{ fontSize: '11px', color: '#3b82f6' }}>교통비 기입시 동시 차감</span>
              </div>
            </div>

            {/* 체크리스트 진행 표시바 */}
            <div onClick={() => setActiveTab('checklist')} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '16px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#34d399' }}>✅ 체크리스트 달성도</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{completedCheckCount} / {checklists.length}</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#020617', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${checklists.length ? (completedCheckCount / checklists.length) * 100 : 0}%`, height: '100%', backgroundColor: '#10b981', transition: 'width 0.3s' }}></div>
              </div>
            </div>

            {/* 🌟 새 일정 위주로 최적화된 마스터 타임라인 요약 뷰 */}
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#f8fafc' }}>🧭 마스터 일정 주요 라우트 미리보기</h4>
                <button onClick={() => setActiveTab('itinerary')} style={{ background: 'none', border: 'none', color: '#fb923c', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>전체 보기 ➡</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[0, 2, 5, 8, 12, 14, 17].map((idx) => {
                  const item = itineraries[idx];
                  if (!item) return null;
                  return (
                    <div key={item.id} style={{ display: 'flex', gap: '12px', borderLeft: '2px solid #334155', paddingLeft: '12px', marginLeft: '6px' }}>
                      <span style={{ fontSize: '11px', color: '#fb923c', fontWeight: 'bold', minWidth: '70px' }}>{item.day} ({item.time})</span>
                      <span style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: '500' }}>{item.location}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ==================== 2. 일정 관리 탭 (Day 1 ~ Day 5 완벽 대응) ==================== */}
        {activeTab === 'itinerary' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* 🌟 Day 5까지 완벽하게 확장된 스케줄 서브 가로 스크롤 탭 바 */}
            <div style={{ display: 'flex', gap: '6px', backgroundColor: '#0f172a', padding: '6px', borderRadius: '12px', border: '1px solid #1e293b', overflowX: 'auto' }}>
              {['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'].map((day) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  style={{
                    flex: '1 0 auto',
                    padding: '10px 14px',
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

            {/* 선택한 날짜 스케줄 한눈에 요약 브리핑 카드 */}
            <div style={{ backgroundColor: 'rgba(249, 115, 22, 0.06)', border: '1px dashed #f97316', borderRadius: '16px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <span style={{ fontSize: '16px' }}>📝</span>
                <h4 style={{ margin: 0, fontSize: '14px', color: '#fb923c', fontWeight: 'bold' }}>{activeDay} 스케줄 타임라인 요약 브리핑</h4>
              </div>
              {filteredItineraries.length === 0 ? (
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>해당 날짜에 등록된 일정이 없습니다.</p>
              ) : (
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.8' }}>
                  {filteredItineraries.map((item) => (
                    <li key={item.id}>
                      <strong>[{item.time}]</strong> {item.location} 
                      {item.memo && item.memo.includes('[교통]') && <span style={{ color: '#60a5fa', marginLeft: '4px' }}>(이동 🚇)</span>}
                      {item.memo && item.memo.includes('[식사]') && <span style={{ color: '#f59e0b', marginLeft: '4px' }}>(식사 🍛)</span>}
                      {item.memo && item.memo.includes('[축제]') && <span style={{ color: '#ef4444', marginLeft: '4px' }}>(축제 🔥)</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 일정 직접 추가 폼 */}
            <form onSubmit={addItinerary} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#fb923c' }}>➕ {activeDay}에 추가 커스텀 스케줄 등록</h3>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} style={{ width: '80px', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px', color: '#fff' }} />
                <input type="text" placeholder="장소 혹은 일정 타이틀" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} style={{ flex: 1, backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px', color: '#fff' }} />
              </div>
              <input type="text" placeholder="메모 기입 (예: [교통] 리무진 버스 탑승 등)" value={newMemo} onChange={(e) => setNewMemo(e.target.value)} style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px', color: '#fff', boxSizing: 'border-box', marginBottom: '12px' }} />
              <button type="submit" style={{ width: '100%', backgroundColor: '#f97316', border: 'none', borderRadius: '8px', padding: '12px', color: '#020617', fontWeight: 'bold', cursor: 'pointer' }}>일정 세부 추가</button>
            </form>

            {/* 타임라인 메인 상세 목록 */}
            <div style={{ borderLeft: '2px solid #1e293b', marginLeft: '12px', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredItineraries.map((item) => (
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
              ))}
            </div>
          </div>
        )}

        {/* ==================== 3. 가계부 탭 ==================== */}
        {activeTab === 'expense' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 'bold' }}>💱 조회시점 실시간 환율</span>
              <span style={{ fontSize: '14px', color: '#38bdf8', fontWeight: 'bold' }}>
                {rateLoading ? '🔄 로딩 중...' : `100¥ = ${exchangeRate.toLocaleString()}원`}
              </span>
            </div>

            <div style={{ backgroundColor: '#0b1329', border: '1px solid #1d4ed8', borderRadius: '16px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 'bold', backgroundColor: 'rgba(59,130,246,0.1)', padding: '2px 6px', borderRadius: '4px' }}>ICOCA CARD</span>
                  <h4 style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#eff6ff' }}>이코카 카드 잔액</h4>
                </div>
                <span style={{ fontSize: '20px', fontWeight: '900', color: '#60a5fa' }}>{icocaBalance.toLocaleString()} ¥</span>
              </div>
              <form onSubmit={handleChargeIcoca} style={{ display: 'flex', gap: '6px' }}>
                <input 
                  type="number" 
                  placeholder="충전할 엔화 입력" 
                  value={icocaInput}
                  onChange={(e) => setIcocaInput(e.target.value)}
                  style={{ flex: 1, backgroundColor: '#020617', border: '1px solid #1e4ed8', borderRadius: '6px', padding: '6px 10px', color: '#fff', fontSize: '13px' }}
                />
                <button type="submit" style={{ backgroundColor: '#2563eb', border: 'none', borderRadius: '6px', padding: '6px 12px', color: '#fff', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>충전</button>
              </form>
            </div>

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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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

        {/* ==================== 4. 준비물 탭 ==================== */}
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

      {/* 하단 내비게이션 바 */}
      <div style={{ position: 'fixed', bottom: '16px', left: '16px', right: '16px', maxWidth: '448px', margin: '0 auto', backgroundColor: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(8px)', border: '1px solid #1e293b', borderRadius: '16px', padding: '8px', display: 'flex', justifyContent: 'space-around', zIndex: 100 }}>
        <button onClick={() => setActiveTab('dashboard')} style={{ background: 'none', border: 'none', color: activeTab === 'dashboard' ? '#f43f5e' : '#94a3b8', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontWeight: activeTab === 'dashboard' ? 'bold' : 'normal' }}>
          <span style={{ fontSize: '20px' }}>🏠</span>
          <span style={{ fontSize: '10px' }}>대시보드</span>
        </button>
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
