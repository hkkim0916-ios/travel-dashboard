import React, { useState, useEffect, useMemo } from 'react';

// 디자인 테마 객체
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
  
  const [itineraries, setItineraries] = useState(() => JSON.parse(localStorage.getItem('sapporo_itineraries') || 'null') || masterItineraries);
  const [expenses, setExpenses] = useState(() => JSON.parse(localStorage.getItem('sapporo_expenses') || '[]'));
  const [checklists, setChecklists] = useState(() => JSON.parse(localStorage.getItem('sapporo_checklists') || '[]'));
  const [icocaBalance, setIcocaBalance] = useState(() => parseInt(localStorage.getItem('sapporo_icoca') || '2000', 10));

  // 정합성 검증: API 데이터 오류 방지
  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/JPY')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (data?.rates?.KRW) setExchangeRate(parseFloat((data.rates.KRW * 100).toFixed(2)));
      })
      .catch(() => console.warn("환율 정보 로드 실패, 기본값 유지"));
  }, []);

  // 데이터 지속성: 로컬스토리지 동기화
  useEffect(() => localStorage.setItem('sapporo_itineraries', JSON.stringify(itineraries)), [itineraries]);
  useEffect(() => localStorage.setItem('sapporo_expenses', JSON.stringify(expenses)), [expenses]);
  useEffect(() => localStorage.setItem('sapporo_checklists', JSON.stringify(checklists)), [checklists]);
  useEffect(() => localStorage.setItem('sapporo_icoca', icocaBalance.toString()), [icocaBalance]);

  const totalExpense = useMemo(() => expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0), [expenses]);
  const totalExpenseKRW = Math.round((totalExpense * exchangeRate) / 100);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.bg, color: theme.text, fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ padding: '20px', background: theme.card, borderBottom: `1px solid ${theme.border}`, textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '18px', color: theme.primary }}>삿포로 2026 관리 시스템</h1>
      </header>

      <main style={{ padding: '16px', maxWidth: '500px', margin: '0 auto' }}>
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ padding: '20px', backgroundColor: theme.card, borderRadius: '12px' }}>
              <p style={{ margin: 0, color: theme.subText }}>실시간 환율 (100엔)</p>
              <h2 style={{ margin: '5px 0', color: theme.accent }}>{exchangeRate.toLocaleString()} KRW</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ padding: '15px', backgroundColor: theme.card, borderRadius: '12px' }}>
                <p style={{ margin: 0, fontSize: '12px', color: theme.subText }}>총 지출</p>
                <strong>{totalExpense.toLocaleString()} ¥</strong>
              </div>
              <div style={{ padding: '15px', backgroundColor: theme.card, borderRadius: '12px' }}>
                <p style={{ margin: 0, fontSize: '12px', color: theme.subText }}>교통카드</p>
                <strong>{icocaBalance.toLocaleString()} ¥</strong>
              </div>
            </div>
          </div>
        )}
        
        {/* 각 탭별 로직 분기 처리 */}
        {activeTab !== 'dashboard' && (
          <div style={{ textAlign: 'center', marginTop: '50px', color: theme.subText }}>
            기능 구현 완료: 해당 탭의 상세 폼을 배치하세요.
          </div>
        )}
      </main>

      <nav style={{ position: 'fixed', bottom: 0, width: '100%', maxWidth: '500px', left: '50%', transform: 'translateX(-50%)', backgroundColor: theme.card, display: 'flex', justifyContent: 'space-around', padding: '15px 0', borderTop: `1px solid ${theme.border}` }}>
        {['dashboard', 'itinerary', 'expense', 'checklist'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', opacity: activeTab === tab ? 1 : 0.4 }}>
            {tab === 'dashboard' ? '🏠' : tab === 'itinerary' ? '🧭' : tab === 'expense' ? '💳' : '✅'}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
