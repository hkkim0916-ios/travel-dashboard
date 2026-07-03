import React, { useState, useEffect, useMemo } from 'react';

const theme = {
  bg: '#020617',
  card: '#0f172a',
  border: '#1e293b',
  primary: '#f97316',
  accent: '#fbbf24',
  text: '#f8fafc',
  subText: '#94a3b8'
};

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
  const [itineraries, setItineraries] = useState(() => JSON.parse(localStorage.getItem('sapporo_itineraries')) || masterItineraries);
  const [expenses, setExpenses] = useState(() => JSON.parse(localStorage.getItem('sapporo_expenses')) || []);
  const [checklists, setChecklists] = useState(() => JSON.parse(localStorage.getItem('sapporo_checklists')) || []);
  const [icocaBalance, setIcocaBalance] = useState(() => parseInt(localStorage.getItem('sapporo_icoca') || 2000, 10));

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
      .then(data => data?.rates?.KRW && setExchangeRate(parseFloat((data.rates.KRW * 100).toFixed(2))));
  }, []);

  useEffect(() => {
    localStorage.setItem('sapporo_itineraries', JSON.stringify(itineraries));
    localStorage.setItem('sapporo_expenses', JSON.stringify(expenses));
    localStorage.setItem('sapporo_checklists', JSON.stringify(checklists));
    localStorage.setItem('sapporo_icoca', icocaBalance.toString());
  }, [itineraries, expenses, checklists, icocaBalance]);

  const addItinerary = (e) => { e.preventDefault(); if(!newLocation) return; setItineraries([...itineraries, { id: Date.now(), day: activeDay, time: newTime, location: newLocation, memo: newMemo }].sort((a,b) => a.time.localeCompare(b.time))); setNewLocation(''); };
  const addExpense = (e) => { e.preventDefault(); if(!expAmount) return; setExpenses([...expenses, { id: Date.now(), category: expCategory, amount: parseInt(expAmount), memo: expMemo }]); if(expCategory === '교통비') setIcocaBalance(p => Math.max(0, p - parseInt(expAmount))); setExpAmount(''); };
  const addChecklist = (e) => { e.preventDefault(); if(!newTodo) return; setChecklists([...checklists, { id: Date.now(), task: newTodo, completed: false }]); setNewTodo(''); };

  const totalExpense = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.bg, color: theme.text, fontFamily: 'sans-serif', paddingBottom: '80px' }}>
      <header style={{ padding: '20px', textAlign: 'center', borderBottom: `1px solid ${theme.border}` }}>
        <h1 style={{ fontSize: '18px', color: theme.primary, margin: 0 }}>삿포로 2026 관리 시스템</h1>
      </header>

      <main style={{ padding: '16px' }}>
        {activeTab === 'dashboard' && (
          <div>
            <h3>🏠 대시보드</h3>
            <p>환율: 100엔당 {exchangeRate}원</p>
            <p>총 지출: {totalExpense.toLocaleString()} ¥ (약 {Math.round((totalExpense * exchangeRate)/100).toLocaleString()}원)</p>
          </div>
        )}
        
        {activeTab === 'itinerary' && (
          <div>
            <h3>🧭 일정 ({activeDay})</h3>
            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
              {['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'].map(d => <button key={d} onClick={() => setActiveDay(d)} style={{ background: activeDay === d ? theme.primary : theme.card, border: 'none', color: 'white', padding: '5px 10px', borderRadius: '5px' }}>{d}</button>)}
            </div>
            <form onSubmit={addItinerary} style={{ background: theme.card, padding: '10px', borderRadius: '8px' }}>
              <input value={newTime} onChange={e => setNewTime(e.target.value)} type="time" />
              <input value={newLocation} onChange={e => setNewLocation(e.target.value)} placeholder="장소" />
              <button type="submit">추가</button>
            </form>
            {itineraries.filter(i => i.day === activeDay).map(i => <div key={i.id} style={{ padding: '10px', borderBottom: '1px solid #333' }}>{i.time} - {i.location}</div>)}
          </div>
        )}

        {activeTab === 'expense' && (
          <div>
            <h3>💳 가계부</h3>
            <form onSubmit={addExpense} style={{ background: theme.card, padding: '10px', borderRadius: '8px' }}>
              <input value={expAmount} onChange={e => setExpAmount(e.target.value)} placeholder="금액" type="number" />
              <input value={expMemo} onChange={e => setExpMemo(e.target.value)} placeholder="내역" />
              <button type="submit">지출 등록</button>
            </form>
            {expenses.map(e => <div key={e.id}>{e.memo}: {e.amount}¥</div>)}
          </div>
        )}

        {activeTab === 'checklist' && (
          <div>
            <h3>✅ 준비물</h3>
            <form onSubmit={addChecklist} style={{ background: theme.card, padding: '10px', borderRadius: '8px' }}>
              <input value={newTodo} onChange={e => setNewTodo(e.target.value)} placeholder="새 준비물" />
              <button type="submit">추가</button>
            </form>
            {checklists.map(c => <div key={c.id} onClick={() => setChecklists(checklists.map(x => x.id === c.id ? {...x, completed: !x.completed} : x))}>{c.completed ? '✅' : '⬜'} {c.task}</div>)}
          </div>
        )}
      </main>

      <nav style={{ position: 'fixed', bottom: 0, width: '100%', backgroundColor: theme.card, display: 'flex', justifyContent: 'space-around', padding: '15px 0', borderTop: `1px solid ${theme.border}` }}>
        {['dashboard', 'itinerary', 'expense', 'checklist'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', opacity: activeTab === tab ? 1 : 0.4 }}>
            {tab === 'dashboard' ? '🏠' : tab === 'itinerary' ? '🧭' : tab === 'expense' ? '💳' : '✅'}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
