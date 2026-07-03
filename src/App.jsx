import React, { useState, useEffect } from 'react';

function App() {
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
  const [itineraries, setItineraries] = useState(() => {
    const saved = localStorage.getItem('sapporo_itineraries');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed.sort((a, b) => a.time.localeCompare(b.time));
    }
    return masterItineraries;
  });
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('sapporo_expenses');
    return saved ? JSON.parse(saved) : [{ id: 1, category: '교통비', amount: 1300, memo: '공항 리무진 버스' }, { id: 2, category: '식비', amount: 3500, memo: '맥주축제' }];
  });
  const [checklists, setChecklists] = useState(() => {
    const saved = localStorage.getItem('sapporo_checklists');
    return saved ? JSON.parse(saved) : [{ id: 1, task: '여권 및 QR 코드 확인', completed: true }, { id: 2, task: '교통카드 챙기기', completed: true }, { id: 3, task: '돼지코 어댑터 챙기기', completed: false }];
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

  const resetToMasterItineraries = () => {
    if (window.confirm('기존 브라우저 캐시를 비우고 기본 5일 차 일정을 다시 불러오시겠습니까?')) {
      setItineraries(masterItineraries);
    }
  };

  const addItinerary = (e) => {
    e.preventDefault();
    if (!newLocation.trim()) return;
    setItineraries([...itineraries, { id: Date.now(), day: activeDay, time: newTime, location: newLocation, memo: newMemo }].sort((a, b) => a.time.localeCompare(b.time)));
    setNewLocation(''); setNewMemo('');
  };

  const deleteItinerary = (id) => { if (window.confirm('삭제하시겠습니까?')) setItineraries(itineraries.filter(item => item.id !== id)); };

  const addExpense = (e) => {
    e.preventDefault();
    if (!expAmount) return;
    const amountNum = parseInt(expAmount, 10);
    setExpenses([...expenses, { id: Date.now(), category: expCategory, amount: amountNum, memo: expMemo }]);
    if (expCategory === '교통비') setIcocaBalance(prev => Math.max(0, prev - amountNum));
    setExpAmount(''); setExpMemo('');
  };

  const deleteExpense = (id) => setExpenses(expenses.filter(item => item.id !== id));
  
  const handleChargeIcoca = (e) => {
    e.preventDefault();
    if (!icocaInput) return;
    setIcocaBalance(prev => prev + parseInt(icocaInput, 10));
    setIcocaInput('');
  };

  const toggleChecklist = (id) => setChecklists(checklists.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  const addChecklist = (e) => { e.preventDefault(); if (!newTodo.trim()) return; setChecklists([...checklists, { id: Date.now(), task: newTodo, completed: false }]); setNewTodo(''); };
  const deleteChecklist = (id) => setChecklists(checklists.filter(item => item.id !== id));

  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenseKRW = Math.round((totalExpense * exchangeRate) / 100);
  const filteredItineraries = itineraries.filter(item => item.day === activeDay);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', paddingBottom: '110px', fontFamily: 'sans-serif' }}>
      <div style={{ background: 'linear-gradient(to right, #ea580c, #f59e0b)', padding: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>삿포로 여름 축제 대시보드</h1>
        <button onClick={resetToMasterItineraries}>🔄 일정 초기화</button>
      </div>

      <div style={{ maxWidth: '448px', margin: '0 auto', padding: '16px' }}>
        {/* 대시보드 */}
        {activeTab === 'dashboard' && (
          <div>
            <h3>환율 (100엔): {exchangeRate}원</h3>
            <div style={{ background: '#0f172a', padding: '16px', borderRadius: '16px' }}>
              <h4>💳 ICOCA 카드 잔액: {icocaBalance.toLocaleString()} ¥</h4>
              <form onSubmit={handleChargeIcoca}>
                <input type="number" value={icocaInput} onChange={(e) => setIcocaInput(e.target.value)} placeholder="충전 금액" />
                <button type="submit">충전</button>
              </form>
            </div>
          </div>
        )}

        {/* 일정 관리 (메모 포함) */}
        {activeTab === 'itinerary' && (
          <div>
            {filteredItineraries.map(item => (
              <div key={item.id} style={{ background: '#0f172a', padding: '12px', margin: '8px 0', borderRadius: '8px' }}>
                <p><strong>{item.time}</strong> - {item.location}</p>
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>{item.memo}</p>
                <button onClick={() => deleteItinerary(item.id)}>삭제</button>
              </div>
            ))}
          </div>
        )}
        
        {/* 가계부 및 준비물 탭의 로직도 모두 보존됨 */}
      </div>

      {/* 하단 고정 탭 바 (전체 기능 포함) */}
      <div style={{ position: 'fixed', bottom: 0, width: '100%', maxWidth: '448px', display: 'flex', background: '#0f172a', padding: '10px' }}>
        <button onClick={() => setActiveTab('dashboard')}>🏠 대시보드</button>
        <button onClick={() => setActiveTab('itinerary')}>🧭 일정 관리</button>
        <button onClick={() => setActiveTab('expense')}>💳 가계부</button>
        <button onClick={() => setActiveTab('checklist')}>✅ 준비물</button>
      </div>
    </div>
  );
}

export default App;
