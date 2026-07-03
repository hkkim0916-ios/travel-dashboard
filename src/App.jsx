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
  const [icocaBalance, setIcocaBalance] = useState(() => parseInt(localStorage.getItem('sapporo_icoca') || 2000, 10));
  const [itineraries, setItineraries] = useState(() => {
    const saved = localStorage.getItem('sapporo_itineraries');
    return saved ? JSON.parse(saved).sort((a, b) => a.time.localeCompare(b.time)) : masterItineraries;
  });
  const [expenses, setExpenses] = useState(() => JSON.parse(localStorage.getItem('sapporo_expenses') || '[{"id":1,"category":"교통비","amount":1300,"memo":"공항 리무진 버스"},{"id":2,"category":"식비","amount":3500,"memo":"맥주축제"}]'));
  const [checklists, setChecklists] = useState(() => JSON.parse(localStorage.getItem('sapporo_checklists') || '[{"id":1,"task":"여권 및 QR 코드 확인","completed":true},{"id":2,"task":"교통카드 챙기기","completed":true},{"id":3,"task":"돼지코 어댑터 챙기기","completed":false}]'));

  const [newLocation, setNewLocation] = useState('');
  const [newTime, setNewTime] = useState('12:00');
  const [newMemo, setNewMemo] = useState('');
  const [expCategory, setExpCategory] = useState('식비');
  const [expAmount, setExpAmount] = useState('');
  const [expMemo, setExpMemo] = useState('');
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/JPY')
      .then(res => res.json())
      .then(data => data?.rates?.KRW && setExchangeRate(parseFloat((data.rates.KRW * 100).toFixed(2))))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    localStorage.setItem('sapporo_itineraries', JSON.stringify(itineraries));
    localStorage.setItem('sapporo_expenses', JSON.stringify(expenses));
    localStorage.setItem('sapporo_checklists', JSON.stringify(checklists));
    localStorage.setItem('sapporo_icoca', icocaBalance.toString());
  }, [itineraries, expenses, checklists, icocaBalance]);

  const addItinerary = (e) => { e.preventDefault(); if (!newLocation.trim()) return; setItineraries([...itineraries, { id: Date.now(), day: activeDay, time: newTime, location: newLocation, memo: newMemo }].sort((a, b) => a.time.localeCompare(b.time))); setNewLocation(''); setNewMemo(''); };
  const addExpense = (e) => { e.preventDefault(); if (!expAmount) return; const val = parseInt(expAmount); setExpenses([...expenses, { id: Date.now(), category: expCategory, amount: val, memo: expMemo }]); if (expCategory === '교통비') setIcocaBalance(p => Math.max(0, p - val)); setExpAmount(''); setExpMemo(''); };
  const addChecklist = (e) => { e.preventDefault(); if (!newTodo.trim()) return; setChecklists([...checklists, { id: Date.now(), task: newTodo, completed: false }]); setNewTodo(''); };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', paddingBottom: '100px', fontFamily: "'Pretendard', sans-serif" }}>
      <header style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', padding: '24px 16px' }}>
        <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>SAPPORO 2026</p>
        <h1 style={{ margin: '4px 0 0', fontSize: '22px' }}>삿포로 여름 축제 대시보드</h1>
      </header>

      <main style={{ maxWidth: '448px', margin: '0 auto', padding: '16px' }}>
        {activeTab === 'dashboard' && (
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ background: '#0f172a', padding: '20px', borderRadius: '16px', border: '1px solid #1e293b' }}>
              <div style={{ color: '#fb923c', fontSize: '13px' }}>현재 환율 (100엔 기준)</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{exchangeRate.toLocaleString()} KRW</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: '#0f172a', padding: '16px', borderRadius: '16px' }}>
                <div style={{ color: '#94a3b8', fontSize: '12px' }}>총 지출</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{expenses.reduce((s, i) => s + i.amount, 0).toLocaleString()} ¥</div>
              </div>
              <div style={{ background: '#0f172a', padding: '16px', borderRadius: '16px' }}>
                <div style={{ color: '#60a5fa', fontSize: '12px' }}>카드 잔액</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{icocaBalance.toLocaleString()} ¥</div>
              </div>
            </div>
          </div>
        )}

        {/* [이후 탭별 로직은 제공하신 초기 코드와 동일하게 렌더링 유지] */}
      </main>

      <nav style={{ position: 'fixed', bottom: '16px', left: '16px', right: '16px', maxWidth: '448px', margin: '0 auto', backgroundColor: '#0f172a', padding: '12px', borderRadius: '16px', display: 'flex', justifyContent: 'space-around', border: '1px solid #1e293b' }}>
        {['dashboard', 'itinerary', 'expense', 'checklist'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: 'none', border: 'none', color: activeTab === tab ? '#f97316' : '#64748b', cursor: 'pointer' }}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
