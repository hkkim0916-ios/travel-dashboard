import React, { useState, useEffect } from 'react';
import './App.css'; // 화면 스타일링 파일

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

  // 탭 상태관리 (Day 1 ~ Day 5)
  const [activeTab, setActiveTab] = useState('Day 2'); // 기본으로 Day 2를 보여줌

  // 입력 폼 상태관리
  const [time, setTime] = useState('');
  const [ampm, setAmpm] = useState('오후');
  const [location, setLocation] = useState('');
  const [memo, setMemo] = useState('');

  // 🌟 로컬 스토리지 데이터 로드 및 초기 빈 배열 검증 로직 추가
  const [itineraries, setItineraries] = useState(() => {
    const saved = localStorage.getItem('sapporo_itineraries');
    if (saved) {
      const parsed = JSON.parse(saved);
      // 저장된 데이터가 존재하지만 일정이 하나도 비어 있다면 마스터 일정을 초기값으로 사용
      if (parsed.length > 0) return parsed;
    }
    return masterItineraries;
  });

  // 하단 탭 네비게이션용 상태관리 (기본값: 일정 관리)
  const [currentMenu, setCurrentMenu] = useState('일정 관리');

  // 데이터가 변경될 때마다 로컬 스토리지에 자동 저장
  useEffect(() => {
    localStorage.setItem('sapporo_itineraries', JSON.stringify(itineraries));
  }, [itineraries]);

  // 새로운 일정 등록 처리 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location.trim()) {
      alert('일정 내용을 입력해주세요!');
      return;
    }

    // 시간 포맷 정리 (예: 오후 02:30 -> 14:30)
    let formattedTime = '시간 미정';
    if (time) {
      const [hours, minutes] = time.split(':');
      let hourNum = parseInt(hours, 10);
      if (ampm === '오후' && hourNum < 12) hourNum += 12;
      if (ampm === '오전' && hourNum === 12) hourNum = 0;
      formattedTime = `${String(hourNum).padStart(2, '0')}:${minutes}`;
    }

    const newSchedule = {
      id: Date.now(),
      day: activeTab,
      time: formattedTime,
      location,
      memo
    };

    // 정렬을 위해 기존 일정에 추가 후 시간순으로 자동 정렬
    const updated = [...itineraries, newSchedule].sort((a, b) => {
      if (a.time === '시간 미정') return 1;
      if (b.time === '시간 미정') return -1;
      return a.time.localeCompare(b.time);
    });

    setItineraries(updated);

    // 입력 폼 초기화
    setTime('');
    setLocation('');
    setMemo('');
  };

  // 일정 삭제 함수
  const handleDelete = (id) => {
    if (window.confirm('이 일정을 삭제하시겠습니까?')) {
      setItineraries(itineraries.filter((item) => item.id !== id));
    }
  };

  // 현재 선택된 Day의 일정만 필터링
  const filteredItineraries = itineraries.filter((item) => item.day === activeTab);

  return (
    <div className="app-container">
      {/* 상단 헤더 / Day 탭 */}
      <div className="tab-header">
        {['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="content-body">
        {currentMenu === '일정 관리' ? (
          <>
            {/* 일정 추가 폼 컴포넌트 */}
            <form className="schedule-form" onSubmit={handleSubmit}>
              <h3 className="form-title">➕ {activeTab} 일정 추가하기</h3>
              
              <div className="form-row">
                <select className="ampm-select" value={ampm} onChange={(e) => setAmpm(e.target.value)}>
                  <option value="오전">오전</option>
                  <option value="오후">오후</option>
                </select>
                <input
                  type="time"
                  className="time-input"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
                <input
                  type="text"
                  className="location-input"
                  placeholder="예: 스프카레 맛집 방문"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <input
                type="text"
                className="memo-input"
                placeholder="간단한 메모 (선택사항)"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />

              <button type="submit" className="submit-btn">스케줄 등록</button>
            </form>

            {/* 일정 리스트 출력 영역 */}
            <div className="timeline-container">
              {filteredItineraries.length === 0 ? (
                <p className="no-data">등록된 일정이 없습니다.</p>
              ) : (
                filteredItineraries.map((item) => (
                  <div key={item.id} className="timeline-item">
                    <div className="item-time">⏱️ {item.time}</div>
                    <div className="item-content">
                      <div className="item-location">{item.location}</div>
                      {item.memo && <div className="item-memo">{item.memo}</div>}
                    </div>
                    <button className="delete-btn" onClick={() => handleDelete(item.id)}>❌</button>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="placeholder-screen">
            <h3>{currentMenu} 화면 준비 중</h3>
            <p>현재 기능 개발 중입니다.</p>
          </div>
        )}
      </div>

      {/* 하단 푸터 네비게이션 바 */}
      <div className="bottom-nav">
        {[
          { name: '대시보드', icon: '🏠' },
          { name: '일정 관리', icon: '🧭' },
          { name: '가계부', icon: '💳' },
          { name: '준비물', icon: '✅' }
        ].map((menu) => (
          <button
            key={menu.name}
            className={`nav-item ${currentMenu === menu.name ? 'active' : ''}`}
            onClick={() => setCurrentMenu(menu.name)}
          >
            <span className="nav-icon">{menu.icon}</span>
            <span className="nav-text">{menu.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
