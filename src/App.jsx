import React, { useState, useEffect } from 'react';

// 디자인 테마 설정
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
  const [icocaBalance, setIcocaBalance] = useState(() => { const s = localStorage.getItem('sapporo_icoca'); return s ? parseInt(s, 10) : 2000; });
  const [icocaInput, setIcocaInput] = useState('');
  const [itineraries, setItineraries] = useState(() => { const s = localStorage.getItem('sapporo_itineraries'); return s ? JSON.parse(s) : masterItineraries; });
  const [expenses, setExpenses] = useState(() => { const s = localStorage.getItem('sapporo_expenses'); return s ? JSON.parse(s) : [{ id: 1, category: '교통비', amount: 1300, memo: '공항 리무진 버스' }, { id: 2, category: '식비', amount: 3500, memo: '맥주축제' }]; });
  const [checklists, setChecklists] = useState(() => { const s = localStorage.getItem('sapporo_checklists'); return s ? JSON.parse(s) : [{ id: 1, task: '여권 및 QR 코드 확인', completed: true }, { id: 2, task: '교통카드 챙기기', completed: true }, { id: 3, task: '돼지코 어댑터 챙기기', completed: false }]; });

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
      .then((data) => { if (data?.rates?.KRW) setExchangeRate(parseFloat((data.rates.KRW * 100).toFixed(2))); })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => { localStorage.setItem('sapporo_itineraries', JSON.stringify(itineraries)); }, [itineraries]);
  useEffect(() => { localStorage.setItem('sapporo_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('sapporo_checklists', JSON.stringify(checklists)); }, [checklists]);
  useEffect(() => { localStorage.setItem('sapporo_icoca', icocaBalance.toString()); }, [icocaBalance]);

  const resetToMasterItineraries = () => { if (window.confirm('기존 데이터를 초기화하고 기본 일정으로 복구하시겠습니까?')) { setItineraries(masterItineraries); } };
  const addItinerary = (e) => { e.preventDefault(); if (!newLocation.trim()) return; setItineraries([...itineraries, { id: Date.now(), day: activeDay, time: newTime, location: newLocation, memo: newMemo }].sort((a, b) => a.time.localeCompare(b.time))); setNewLocation(''); setNewMemo(''); };
  const deleteItinerary = (id) => { if (window.confirm('삭제하시겠습니까?')) setItineraries(itineraries.filter(item => item.id !== id)); };
  const addExpense = (e) => { e.preventDefault(); if (!expAmount) return; const amountNum = parseInt(expAmount, 10); setExpenses([...expenses, { id: Date.now(), category: expCategory, amount: amountNum, memo: expMemo }]); if (expCategory === '교통비') setIcocaBalance(prev => Math.max(0, prev - amountNum)); setExpAmount(''); setExpMemo(''); };
  const deleteExpense = (id) => setExpenses(expenses.filter(item => item.id !== id));
  const handleChargeIcoca = (e) => { e.preventDefault(); if (!icocaInput) return; setIcocaBalance(prev => prev + parseInt(icocaInput, 10)); setIcocaInput(''); };
  const toggleChecklist = (id) => { setChecklists(checklists.map(item => item.id === id ? { ...item, completed: !item.completed } : item)); };
  const addChecklist = (e) => { e.preventDefault(); if (!newTodo.trim()) return; setChecklists([...checklists, { id: Date.now(), task: newTodo, completed: false }]); setNewTodo(''); };
  const deleteChecklist = (id) => setChecklists(checklists.filter(item => item.id !== id));

  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenseKRW = Math.round((totalExpense * exchangeRate) / 100);
  const filteredItineraries = itineraries.filter(item => item.day === activeDay);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.bg, color: theme.text, paddingBottom: '120px', fontFamily: 'sans-serif' }}>
      <div style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`, padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: '#ffedd5', fontSize: '10px', fontWeight: 'bold', margin: '0 0 4px 0' }}>SAPPORO 2026</p>
          <h1 style={{ fontSize: '20px', fontWeight: '900', margin: 0, color: '#ffffff' }}>삿포로 여행 대시보드</h1>
        </div>
        <button type="button" onClick={resetToMasterItineraries} style={{ backgroundColor: '#ffffff', color: '#020617', border: 'none', borderRadius: '20px', padding: '6px 12px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>🔄 초기화</button>
      </div>

      <div style={{ maxWidth: '448px', margin: '0 auto', padding: '16px' }}>
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '16px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: theme.accent }}>데이터 요약</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: 0, fontSize: '13px' }}>총 {itineraries.length}개 일정 활성화</p>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '10px', color: '#38bdf8' }}>환율 (100엔)</span>
                  <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{exchangeRate}원</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ backgroundColor: theme.card, padding: '14px', borderRadius: '16px', border: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: '12px', color: theme.subText }}>💰 총 지출</span>
                <h4 style={{ margin: '4px 0 0 0', color: theme.accent, fontSize: '16px' }}>{totalExpense.toLocaleString()} ¥</h4>
                <div style={{ fontSize: '11px', color: theme.primary }}>≈ {totalExpenseKRW.toLocaleString()}원</div>
              </div>
              <div style={{ backgroundColor: theme.card, padding: '14px', borderRadius: '16px', border: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: '12px', color: '#60a5fa' }}>💳 카드 잔액</span>
                <h4 style={{ margin: '4px 0 0 0', color: '#fff', fontSize: '16px' }}>{icocaBalance.toLocaleString()} ¥</h4>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'itinerary' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '4px', backgroundColor: theme.card, padding: '4px', borderRadius: '12px', overflowX: 'auto' }}>
              {['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'].map(day => (
                <button key={day} onClick={() => setActiveDay(day)} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', backgroundColor: activeDay === day ? theme.primary : 'transparent', color: activeDay === day ? '#fff' : theme.subText, fontWeight: 'bold', cursor: 'pointer' }}>{day}</button>
              ))}
            </div>
            <form onSubmit={addItinerary} style={{ backgroundColor: theme.card, borderRadius: '16px', padding: '16px', border: `1px solid ${theme.border}` }}>
              <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} style={{ width: '100%', marginBottom: '8px', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: '#fff', padding: '8px', borderRadius: '6px' }} />
              <input type="text" placeholder="장소명" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} style={{ width: '100%', marginBottom: '8px', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: '#fff', padding: '8px', borderRadius: '6px' }} />
              <input type="text" placeholder="메모" value={newMemo} onChange={(e) => setNewMemo(e.target.value)} style={{ width: '100%', marginBottom: '8px', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: '#fff', padding: '8px', borderRadius: '6px' }} />
              <button type="submit" style={{ width: '100%', backgroundColor: theme.primary, border: 'none', padding: '10px', color: '#fff', borderRadius: '6px', fontWeight: 'bold' }}>스케줄 등록</button>
            </form>
            {filteredItineraries.map(item => (
              <div key={item.id} style={{ backgroundColor: theme.card, padding: '16px', borderRadius: '16px', border: `1px solid ${theme.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: theme.accent, fontWeight: 'bold' }}>{item.time}</span>
                  <a href={`http://googleusercontent.com/maps.google.com/search?q=${encodeURIComponent(item.location)}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', fontSize: '11px', color: theme.subText, backgroundColor: theme.bg, padding: '4px 8px', borderRadius: '8px' }}>📍 지도 보기</a>
                </div>
                <div style={{ marginTop: '8px', fontSize: '15px', fontWeight: '600' }}>{item.location}</div>
                {item.memo && <div style={{ fontSize: '12px', color: theme.subText, marginTop: '8px', borderTop: `1px solid ${theme.border}`, paddingTop: '8px' }}>{item.memo}</div>}
                <button onClick={() => deleteItinerary(item.id)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '11px', marginTop: '10px', cursor: 'pointer' }}>삭제</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'expense' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: theme.card, padding: '16px', borderRadius: '16px', border: `1px solid ${theme.border}` }}>
              <span style={{ fontSize: '12px', color: theme.subText }}>총 지출 합계</span>
              <h2 style={{ margin: '4px 0', color: '#fff' }}>{totalExpense.toLocaleString()} JPY</h2>
              <p style={{ margin: 0, fontSize: '12px', color: theme.primary }}>≈ {totalExpenseKRW.toLocaleString()} 원</p>
            </div>
            <form onSubmit={addExpense} style={{ backgroundColor: theme.card, borderRadius: '16px', padding: '16px', border: `1px solid ${theme.border}` }}>
              <select value={expCategory} onChange={(e) => setExpCategory(e.target.value)} style={{ width: '100%', marginBottom: '8px', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: '#fff', padding: '8px' }}>
                <option value="식비">식비</option><option value="교통비">교통비</option><option value="쇼핑">쇼핑</option>
              </select>
              <input type="number" placeholder="금액" value={expAmount} onChange={(e) => setExpAmount(e.target.value)} style={{ width: '100%', marginBottom: '8px', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: '#fff', padding: '8px' }} />
              <input type="text" placeholder="내역" value={expMemo} onChange={(e) => setExpMemo(e.target.value)} style={{ width: '100%', marginBottom: '8px', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: '#fff', padding: '8px' }} />
              <button type="submit" style={{ width: '100%', backgroundColor: theme.accent, border: 'none', padding: '10px', color: theme.bg, borderRadius: '6px', fontWeight: 'bold' }}>지출 등록</button>
            </form>
            {expenses.map(item => (
              <div key={item.id} style={{ backgroundColor: theme.card, padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', border: `1px solid ${theme.border}` }}>
                <div><strong>{item.memo}</strong> <span style={{ fontSize: '11px', color: theme.subText }}>({item.category})</span></div>
                <div>{item.amount.toLocaleString()} ¥ <button onClick={() => deleteExpense(item.id)} style={{ background: 'none', border: 'none', color: '#64748b' }}>🗑️</button></div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'checklist' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <form onSubmit={addChecklist} style={{ display: 'flex', gap: '6px' }}>
              <input type="text" placeholder="준비물 추가" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} style={{ flex: 1, backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '8px', color: '#fff' }} />
              <button type="submit" style={{ backgroundColor: '#10b981', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 'bold' }}>추가</button>
            </form>
            <div style={{ backgroundColor: theme.card, borderRadius: '16px', border: `1px solid ${theme.border}` }}>
              {checklists.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: `1px solid ${theme.border}` }}>
                  <div onClick={() => toggleChecklist(item.id)} style={{ cursor: 'pointer', color: item.completed ? theme.subText : '#fff' }}>
                    {item.completed ? '✅' : '⬜'} <span style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>{item.task}</span>
                  </div>
                  <button onClick={() => deleteChecklist(item.id)} style={{ background: 'none', border: 'none', color: theme.subText }}>🗑️</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <nav style={{ position: 'fixed', bottom: '16px', left: '16px', right: '16px', maxWidth: '448px', margin: '0 auto', backgroundColor: 'rgba(15,23,42,0.95)', border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '16px 0', display: 'flex', justifyContent: 'space-around', zIndex: 100 }}>
        {[
          { id: 'dashboard', label: '대시보드', icon: '🏠' },
          { id: 'itinerary', label: '일정 관리', icon: '🧭' },
          { id: 'expense', label: '가계부', icon: '💳' },
          { id: 'checklist', label: '준비물', icon: '✅' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ background: 'none', border: 'none', color: activeTab === tab.id ? theme.primary : theme.subText, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '20px' }}>{tab.icon}</span>
            <span style={{ fontSize: '10px', marginTop: '4px' }}>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
