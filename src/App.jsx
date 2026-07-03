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
  const [icocaInput, setIcocaInput] = useState('');
  const [itineraries, setItineraries] = useState(() => JSON.parse(localStorage.getItem('sapporo_itineraries')) || masterItineraries);
  const [expenses, setExpenses] = useState(() => JSON.parse(localStorage.getItem('sapporo_expenses')) || [{ id: 1, category: '교통비', amount: 1300, memo: '공항 리무진 버스' }, { id: 2, category: '식비', amount: 3500, memo: '맥주축제' }]);
  const [checklists, setChecklists] = useState(() => JSON.parse(localStorage.getItem('sapporo_checklists')) || [{ id: 1, task: '여권 및 QR 코드 확인', completed: true }, { id: 2, task: '교통카드 챙기기', completed: true }, { id: 3, task: '돼지코 어댑터 챙기기', completed: false }]);

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
      .catch(console.error);
  }, []);

  useEffect(() => { localStorage.setItem('sapporo_itineraries', JSON.stringify(itineraries)); }, [itineraries]);
  useEffect(() => { localStorage.setItem('sapporo_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('sapporo_checklists', JSON.stringify(checklists)); }, [checklists]);
  useEffect(() => { localStorage.setItem('sapporo_icoca', icocaBalance.toString()); }, [icocaBalance]);

  const addItinerary = (e) => {
    e.preventDefault();
    setItineraries([...itineraries, { id: Date.now(), day: activeDay, time: newTime, location: newLocation, memo: newMemo }].sort((a, b) => a.time.localeCompare(b.time)));
    setNewLocation(''); setNewMemo('');
  };

  const deleteItinerary = (id) => setItineraries(itineraries.filter(i => i.id !== id));
  const addExpense = (e) => {
    e.preventDefault();
    setExpenses([...expenses, { id: Date.now(), category: expCategory, amount: parseInt(expAmount, 10), memo: expMemo }]);
    if (expCategory === '교통비') setIcocaBalance(prev => Math.max(0, prev - parseInt(expAmount, 10)));
    setExpAmount(''); setExpMemo('');
  };
  const deleteExpense = (id) => setExpenses(expenses.filter(i => i.id !== id));
  const toggleChecklist = (id) => setChecklists(checklists.map(i => i.id === id ? { ...i, completed: !i.completed } : i));
  const addChecklist = (e) => { e.preventDefault(); setChecklists([...checklists, { id: Date.now(), task: newTodo, completed: false }]); setNewTodo(''); };
  const deleteChecklist = (id) => setChecklists(checklists.filter(i => i.id !== id));
  const handleChargeIcoca = (e) => { e.preventDefault(); setIcocaBalance(prev => prev + parseInt(icocaInput, 10)); setIcocaInput(''); };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', paddingBottom: '110px', fontFamily: 'sans-serif' }}>
      <div style={{ background: 'linear-gradient(to right, #ea580c, #f59e0b)', padding: '24px', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '20px', color: '#fff' }}>삿포로 여름 축제 대시보드</h1>
      </div>

      <div style={{ maxWidth: '448px', margin: '0 auto', padding: '16px' }}>
        {activeTab === 'dashboard' && (
          <div>
            <h3>환율 (100엔): {exchangeRate}원</h3>
            <div style={{ background: '#0f172a', padding: '16px', borderRadius: '16px' }}>
              <h4>💳 카드 잔액: {icocaBalance.toLocaleString()} ¥</h4>
              <form onSubmit={handleChargeIcoca}>
                <input type="number" value={icocaInput} onChange={(e) => setIcocaInput(e.target.value)} placeholder="충전" />
                <button type="submit">충전</button>
              </form>
            </div>
            <h4>전체 일정 요약</h4>
            {itineraries.slice(0, 6).map(i => <div key={i.id}>{i.time} {i.location}</div>)}
          </div>
        )}

        {activeTab === 'itinerary' && (
          <div>
            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
              {['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'].map(day => (
                <button key={day} onClick={() => setActiveDay(day)}>{day}</button>
              ))}
            </div>
            {itineraries.filter(i => i.day === activeDay).map(i => (
              <div key={i.id} style={{ background: '#0f172a', margin: '8px 0', padding: '10px' }}>
                <p>{i.time} - {i.location}</p>
                <p style={{ fontSize: '12px' }}>{i.memo}</p>
                <button onClick={() => deleteItinerary(i.id)}>삭제</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'expense' && (
          <div>
            {expenses.map(i => <div key={i.id}>{i.memo}: {i.amount}¥ <button onClick={() => deleteExpense(i.id)}>삭제</button></div>)}
          </div>
        )}

        {activeTab === 'checklist' && (
          <div>
            {checklists.map(i => <div key={i.id} onClick={() => toggleChecklist(i.id)}>{i.completed ? '✅' : '⬜'} {i.task} <button onClick={() => deleteChecklist(i.id)}>삭제</button></div>)}
          </div>
        )}
      </div>

      <div style={{ position: 'fixed', bottom: 0, width: '100%', maxWidth: '448px', display: 'flex', background: '#0f172a', padding: '10px', margin: '0 auto', left: 0, right: 0 }}>
        <button onClick={() => setActiveTab('dashboard')}>🏠 대시보드</button>
        <button onClick={() => setActiveTab('itinerary')}>🧭 일정</button>
        <button onClick={() => setActiveTab('expense')}>💳 가계부</button>
        <button onClick={() => setActiveTab('checklist')}>✅ 준비물</button>
      </div>
    </div>
  );
}

export default App;
