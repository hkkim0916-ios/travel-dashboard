import React, { useState, useEffect } from 'react';
// import './App.css'; ⬅️ 파일이 존재하지 않아 에러를 유발하던 라인을 완전히 제거했습니다.

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

  // 메인 메뉴 탭 설정 ('dashboard': 종합 대시보드, 'itinerary': 일정 관리, 'expense': 가계부, 'checklist': 준비물)
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Day 1부터 Day 5까지 날짜별 서브 탭 상태 변수 (기본값 Day 1)
  const [activeDay, setActiveDay] = useState('Day 1');
  
  // 실시간 환율 상태 (기본값 900원 설정)
  const [exchangeRate, setExchangeRate] = useState(900);
  const [rateLoading, setRateLoading] = useState(true);

  // 이코카(ICOCA) 카드 충전 및 잔액 상태 관리 (초기 금액 2,000엔 기본 세팅)
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

  // 오픈 환율 API 호출
  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/JPY')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates && data.rates.KRW) {
          const rate100Yen = data.rates.KRW * 100;
          setExchangeRate(parseFloat(rate100Yen.toFixed(2)));
        }
        setRateLoading(false)
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

  // 일정 핸들러 함수들
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

  // 가계부 핸들러 함수들
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

  // 준비물 핸들러 함수들
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

  // 금액 계산 공식
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenseKRW = Math.round((totalExpense * exchangeRate) / 100);

  // 구글 맵 새창 이동 오타 수정 완료
  const handleMapSearch = (locationName) => {
    if (!locationName) return;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`, '_blank');
  };

  // 현재 활성화된 날짜(Day 1 ~ Day 5)의 스케줄만 필터링
  const filteredItineraries = itineraries.filter(item => item.day === activeDay);
  const completedCheckCount = checklists.filter(c => c.completed).length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', paddingBottom: '110px', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      
      {/* 상단 타이틀 헤더 */}
      <div style={{ background: 'linear-gradient(to right, #ea580c, #f59e0b)', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <p style={{ color: '#ffedd5', fontSize: '12px', fontWeight: 'bold', margin: '0 0 4px 0' }}>SAPPORO SUMMER FESTIVAL '26</p>
        <h1 style={{ fontSize: '24px', fontWeight: '900', margin: 0, color: '#ffffff' }}>삿포로 여름 축제 대시보드</h1>
      </div>

      {/* 메인 콘텐츠 컨테이너 */}
      <div style={{ maxWidth: '448px', margin: '0 auto', padding: '16px', boxSizing: 'border-box' }}>
        
        {/* ==================== 1. 종합 대시보드 탭 ==================== */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
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

            {/* 자산 카드 매트릭스 */}
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

            {/* 준비물 진행률 프로그레스 */}
            <div onClick={() => setActiveTab('checklist')} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '16px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px
