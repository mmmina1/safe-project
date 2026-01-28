import React from 'react';

const Privacy = () => {
  return (
    <div style={{ 
      padding: '50px', 
      lineHeight: '1.8', 
      color: '#333', 
      maxWidth: '1000px', 
      margin: '0 auto',
      width: '100%',
      height: '100%',
      overflowY: 'auto',
      boxSizing: 'border-box'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px', borderBottom: '3px solid #0d6efd', paddingBottom: '10px' }}>
        개인정보처리방침
      </h1>
      <p style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '30px' }}>시행일자: 2026년 1월 1일</p>
      
      <div style={{ padding: '20px', backgroundColor: '#e7f3ff', borderRadius: '8px', marginBottom: '30px', borderLeft: '4px solid #0d6efd' }}>
        <p style={{ margin: 0, fontSize: '0.95rem' }}>
          <strong>Team SAFE</strong>는 이용자의 개인정보를 매우 중요시하며, 『개인정보 보호법』, 『정보통신망 이용촉진 및 정보보호 등에 관한 법률』 등 
          관련 법령을 준수하고 있습니다. 본 방침은 Risk Watch 서비스(이하 "서비스") 이용 시 수집·이용되는 개인정보의 처리에 관한 사항을 규정합니다.
        </p>
      </div>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#0d6efd', fontSize: '1.3rem', marginBottom: '15px' }}>제 1 조 (수집하는 개인정보의 항목 및 수집방법)</h3>
        <h4 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: '#495057' }}>1. 수집하는 개인정보 항목</h4>
        <p>회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집하고 있습니다:</p>
        
        <div style={{ marginLeft: '20px', marginTop: '15px' }}>
          <h5 style={{ fontSize: '1rem', marginBottom: '10px' }}>(1) 회원가입 시</h5>
          <ul style={{ marginLeft: '25px' }}>
            <li style={{ marginBottom: '8px' }}><strong>필수항목:</strong> 이메일 주소, 비밀번호, 닉네임</li>
            <li style={{ marginBottom: '8px' }}><strong>선택항목:</strong> 전화번호, 프로필 사진</li>
          </ul>

          <h5 style={{ fontSize: '1rem', marginTop: '20px', marginBottom: '10px' }}>(2) 서비스 이용 과정에서 자동으로 수집되는 정보</h5>
          <ul style={{ marginLeft: '25px' }}>
            <li style={{ marginBottom: '8px' }}>접속 IP 주소, 쿠키, 서비스 이용 기록</li>
            <li style={{ marginBottom: '8px' }}>기기 정보 (OS 버전, 기기 식별자, 브라우저 정보)</li>
            <li style={{ marginBottom: '8px' }}>앱 버전, 방문 일시, 서비스 이용 기록</li>
            <li style={{ marginBottom: '8px' }}>불량 이용 기록</li>
          </ul>

          <h5 style={{ fontSize: '1rem', marginTop: '20px', marginBottom: '10px' }}>(3) 스미싱 분석 서비스 이용 시</h5>
          <ul style={{ marginLeft: '25px' }}>
            <li style={{ marginBottom: '8px' }}>분석 요청 문자 메시지 내용 (발신번호, 수신번호 제외)</li>
            <li style={{ marginBottom: '8px' }}>분석 요청 URL 주소</li>
            <li style={{ marginBottom: '8px' }}>분석 결과 데이터</li>
            <li style={{ marginBottom: '8px' }}>신고 내역 및 신고 사유</li>
          </ul>
        </div>

        <h4 style={{ fontSize: '1.1rem', marginTop: '25px', marginBottom: '10px', color: '#495057' }}>2. 개인정보 수집 방법</h4>
        <p>회사는 다음과 같은 방법으로 개인정보를 수집합니다:</p>
        <ul style={{ marginLeft: '25px', marginTop: '10px' }}>
          <li style={{ marginBottom: '8px' }}>웹사이트 및 모바일 앱을 통한 회원가입, 서비스 이용 과정에서 이용자의 자발적 제공</li>
          <li style={{ marginBottom: '8px' }}>서비스 이용 과정에서 자동 수집 (쿠키, 로그 분석 등)</li>
          <li style={{ marginBottom: '8px' }}>고객센터를 통한 상담 과정에서 전화, 이메일, 팩스 등을 통한 수집</li>
          <li style={{ marginBottom: '8px' }}>제휴사로부터의 제공 (사전 동의를 받은 경우에 한함)</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#0d6efd', fontSize: '1.3rem', marginBottom: '15px' }}>제 2 조 (개인정보의 수집 및 이용 목적)</h3>
        <p>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다:</p>
        
        <h4 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: '#495057' }}>1. 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산</h4>
        <ul style={{ marginLeft: '25px', marginTop: '10px' }}>
          <li style={{ marginBottom: '8px' }}>스미싱 위험도 분석 서비스 제공</li>
          <li style={{ marginBottom: '8px' }}>URL 악성 여부 판단 서비스 제공</li>
          <li style={{ marginBottom: '8px' }}>맞춤형 콘텐츠 및 정보 제공</li>
          <li style={{ marginBottom: '8px' }}>본인인증 및 개인식별</li>
        </ul>

        <h4 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: '#495057' }}>2. 회원 관리</h4>
        <ul style={{ marginLeft: '25px', marginTop: '10px' }}>
          <li style={{ marginBottom: '8px' }}>회원제 서비스 이용에 따른 본인확인, 개인 식별</li>
          <li style={{ marginBottom: '8px' }}>불량회원의 부정 이용 방지와 비인가 사용 방지</li>
          <li style={{ marginBottom: '8px' }}>가입 의사 확인, 연령확인</li>
          <li style={{ marginBottom: '8px' }}>불만처리 등 민원처리, 고지사항 전달</li>
          <li style={{ marginBottom: '8px' }}>회원 탈퇴 의사의 확인</li>
        </ul>

        <h4 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: '#495057' }}>3. 서비스 개선 및 신규 서비스 개발</h4>
        <ul style={{ marginLeft: '25px', marginTop: '10px' }}>
          <li style={{ marginBottom: '8px' }}>AI 모델 학습 및 정확도 향상</li>
          <li style={{ marginBottom: '8px' }}>스미싱 패턴 분석 및 데이터베이스 구축</li>
          <li style={{ marginBottom: '8px' }}>서비스 이용 통계 및 분석</li>
          <li style={{ marginBottom: '8px' }}>신규 서비스 개발 및 특화</li>
          <li style={{ marginBottom: '8px' }}>이벤트 및 광고성 정보 제공 (사전 동의를 받은 경우에 한함)</li>
        </ul>

        <h4 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: '#495057' }}>4. 법적 의무 이행</h4>
        <ul style={{ marginLeft: '25px', marginTop: '10px' }}>
          <li style={{ marginBottom: '8px' }}>관련 법령 및 이용약관 위반 회원에 대한 이용 제한 조치</li>
          <li style={{ marginBottom: '8px' }}>부정 이용 행위를 포함하여 서비스의 원활한 운영에 지장을 주는 행위에 대한 방지 및 제재</li>
          <li style={{ marginBottom: '8px' }}>범죄 수사 또는 법령상 의무 이행을 위해 불가피한 경우</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#0d6efd', fontSize: '1.3rem', marginBottom: '15px' }}>제 3 조 (개인정보의 보유 및 이용기간)</h3>
        <p>
          회사는 이용자의 개인정보를 수집·이용 목적이 달성되면 지체없이 파기합니다. 
          단, 관계 법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계 법령에서 정한 일정한 기간 동안 회원정보를 보관합니다:
        </p>

        <h4 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: '#495057' }}>1. 회사 내부 방침에 의한 정보보유 사유</h4>
        <ul style={{ marginLeft: '25px', marginTop: '10px' }}>
          <li style={{ marginBottom: '8px' }}>
            <strong>부정 이용 기록:</strong> 보존 이유 - 부정 이용 방지 / 보존 기간 - 1년
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>서비스 이용 기록:</strong> 보존 이유 - 분쟁 해결 및 민원처리 / 보존 기간 - 회원 탈퇴 후 3개월
          </li>
        </ul>

        <h4 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: '#495057' }}>2. 관련 법령에 의한 정보보유 사유</h4>
        <p>전자상거래 등에서의 소비자 보호에 관한 법률, 통신비밀보호법 등 관계법령의 규정에 의하여 보존할 필요가 있는 경우:</p>
        <ul style={{ marginLeft: '25px', marginTop: '10px' }}>
          <li style={{ marginBottom: '8px' }}>
            <strong>계약 또는 청약철회 등에 관한 기록:</strong> 5년 (전자상거래 등에서의 소비자보호에 관한 법률)
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>대금결제 및 재화 등의 공급에 관한 기록:</strong> 5년 (전자상거래 등에서의 소비자보호에 관한 법률)
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>소비자의 불만 또는 분쟁처리에 관한 기록:</strong> 3년 (전자상거래 등에서의 소비자보호에 관한 법률)
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>웹사이트 방문기록:</strong> 3개월 (통신비밀보호법)
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>표시·광고에 관한 기록:</strong> 6개월 (전자상거래 등에서의 소비자보호에 관한 법률)
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#0d6efd', fontSize: '1.3rem', marginBottom: '15px' }}>제 4 조 (개인정보의 파기 절차 및 방법)</h3>
        <h4 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: '#495057' }}>1. 파기 절차</h4>
        <p>
          이용자가 회원가입 등을 위해 입력한 정보는 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 
          내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라 일정 기간 저장된 후 파기됩니다.
        </p>

        <h4 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: '#495057' }}>2. 파기 방법</h4>
        <ul style={{ marginLeft: '25px', marginTop: '10px' }}>
          <li style={{ marginBottom: '8px' }}>
            <strong>전자적 파일 형태의 정보:</strong> 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>종이에 출력된 개인정보:</strong> 분쇄기로 분쇄하거나 소각을 통하여 파기
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#0d6efd', fontSize: '1.3rem', marginBottom: '15px' }}>제 5 조 (개인정보의 제3자 제공)</h3>
        <p>
          회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다:
        </p>
        <ol style={{ marginLeft: '25px', marginTop: '10px' }}>
          <li style={{ marginBottom: '12px' }}>
            이용자가 사전에 동의한 경우
          </li>
          <li style={{ marginBottom: '12px' }}>
            법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우
          </li>
          <li style={{ marginBottom: '12px' }}>
            통계작성, 학술연구나 시장조사를 위하여 특정 개인을 식별할 수 없는 형태로 제공하는 경우
          </li>
        </ol>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#0d6efd', fontSize: '1.3rem', marginBottom: '15px' }}>제 6 조 (개인정보 처리의 위탁)</h3>
        <p>
          회사는 서비스 향상을 위해서 이용자의 개인정보를 외부에 위탁하여 처리할 수 있습니다. 
          개인정보의 처리를 위탁하는 경우에는 미리 그 사실을 이용자에게 고지하겠습니다.
        </p>
        <p style={{ marginTop: '15px' }}>
          회사는 위탁계약 체결 시 개인정보 보호법 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 
          기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 
          계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.
        </p>
        <p style={{ marginTop: '15px' }}>
          위탁업무의 내용이나 수탁자가 변경될 경우에는 지체없이 본 개인정보 처리방침을 통하여 공개하도록 하겠습니다.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#0d6efd', fontSize: '1.3rem', marginBottom: '15px' }}>제 7 조 (이용자 및 법정대리인의 권리와 그 행사방법)</h3>
        <ol style={{ marginLeft: '25px', marginTop: '10px' }}>
          <li style={{ marginBottom: '12px' }}>
            이용자 및 법정 대리인은 언제든지 등록되어 있는 자신 혹은 당해 만 14세 미만 아동의 개인정보를 조회하거나 수정할 수 있으며 
            가입 해지를 요청할 수도 있습니다.
          </li>
          <li style={{ marginBottom: '12px' }}>
            이용자 혹은 만 14세 미만 아동의 개인정보 조회·수정을 위해서는 '개인정보변경'(또는 '회원정보수정' 등)을, 
            가입 해지(동의철회)를 위해서는 "회원탈퇴"를 클릭하여 본인 확인 절차를 거치신 후 직접 열람, 정정 또는 탈퇴가 가능합니다.
          </li>
          <li style={{ marginBottom: '12px' }}>
            혹은 개인정보보호책임자에게 서면, 전화 또는 이메일로 연락하시면 지체없이 조치하겠습니다.
          </li>
          <li style={{ marginBottom: '12px' }}>
            이용자가 개인정보의 오류에 대한 정정을 요청하신 경우에는 정정을 완료하기 전까지 당해 개인정보를 이용 또는 제공하지 않습니다. 
            또한 잘못된 개인정보를 제3자에게 이미 제공한 경우에는 정정 처리결과를 제3자에게 지체없이 통지하여 정정이 이루어지도록 하겠습니다.
          </li>
          <li style={{ marginBottom: '12px' }}>
            회사는 이용자 혹은 법정 대리인의 요청에 의해 해지 또는 삭제된 개인정보는 "제3조 (개인정보의 보유 및 이용기간)"에 명시된 바에 따라 
            처리하고 그 외의 용도로 열람 또는 이용할 수 없도록 처리하고 있습니다.
          </li>
        </ol>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#0d6efd', fontSize: '1.3rem', marginBottom: '15px' }}>제 8 조 (개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)</h3>
        <h4 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: '#495057' }}>1. 쿠키(Cookie)의 사용 목적</h4>
        <p>
          회사는 이용자에게 보다 빠르고 편리한 웹사이트 사용을 지원하고 맞춤형 서비스를 제공하기 위해 쿠키를 사용합니다. 
          쿠키는 웹사이트를 운영하는데 이용되는 서버가 이용자의 브라우저에 보내는 아주 작은 텍스트 파일로 이용자의 컴퓨터 하드디스크에 저장됩니다.
        </p>

        <h4 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: '#495057' }}>2. 쿠키의 설치·운영 및 거부</h4>
        <p>
          이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서 이용자는 웹브라우저에서 옵션을 설정함으로써 
          모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.
        </p>
        <p style={{ marginTop: '10px' }}>다만, 쿠키의 저장을 거부할 경우에는 로그인이 필요한 일부 서비스는 이용에 어려움이 있을 수 있습니다.</p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#0d6efd', fontSize: '1.3rem', marginBottom: '15px' }}>제 9 조 (개인정보의 안전성 확보조치)</h3>
        <p>회사는 이용자의 개인정보를 안전하게 관리하기 위하여 최선을 다하며, 개인정보보호법에서 요구하는 다음과 같은 안전성 확보 조치를 취하고 있습니다:</p>
        
        <h4 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: '#495057' }}>1. 관리적 조치</h4>
        <ul style={{ marginLeft: '25px', marginTop: '10px' }}>
          <li style={{ marginBottom: '8px' }}>내부관리계획 수립 및 시행</li>
          <li style={{ marginBottom: '8px' }}>정기적인 직원 교육 실시</li>
          <li style={{ marginBottom: '8px' }}>개인정보 취급 직원의 최소화 및 교육</li>
        </ul>

        <h4 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: '#495057' }}>2. 기술적 조치</h4>
        <ul style={{ marginLeft: '25px', marginTop: '10px' }}>
          <li style={{ marginBottom: '8px' }}>개인정보의 암호화 (비밀번호는 암호화되어 저장 및 관리)</li>
          <li style={{ marginBottom: '8px' }}>해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위한 보안프로그램 설치 및 주기적 갱신·점검</li>
          <li style={{ marginBottom: '8px' }}>네트워크 구간 암호화(SSL 등)</li>
          <li style={{ marginBottom: '8px' }}>접근통제시스템 설치</li>
          <li style={{ marginBottom: '8px' }}>개인정보처리시스템 접근 권한의 관리</li>
        </ul>

        <h4 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: '#495057' }}>3. 물리적 조치</h4>
        <ul style={{ marginLeft: '25px', marginTop: '10px' }}>
          <li style={{ marginBottom: '8px' }}>전산실, 자료보관실 등의 접근통제</li>
          <li style={{ marginBottom: '8px' }}>개인정보가 포함된 서류, 보조저장매체 등의 잠금장치 사용</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#0d6efd', fontSize: '1.3rem', marginBottom: '15px' }}>제 10 조 (개인정보보호책임자 및 담당자)</h3>
        <p>
          회사는 이용자의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와 같이 개인정보보호책임자 및 담당자를 지정하고 있습니다.
        </p>
        
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #0d6efd' }}>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#495057' }}>개인정보보호책임자</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '8px' }}><strong>소속:</strong> Team SAFE</li>
            <li style={{ marginBottom: '8px' }}><strong>이메일:</strong> chlalsdk5743@gmail.com</li>
            <li style={{ marginBottom: '8px' }}><strong>전화:</strong> 1588-0000</li>
          </ul>
        </div>

        <p style={{ marginTop: '20px' }}>
          기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다:
        </p>
        <ul style={{ marginLeft: '25px', marginTop: '15px' }}>
          <li style={{ marginBottom: '8px' }}>개인정보침해신고센터 (privacy.kisa.or.kr / 국번없이 118)</li>
          <li style={{ marginBottom: '8px' }}>개인정보분쟁조정위원회 (www.kopico.go.kr / 1833-6972)</li>
          <li style={{ marginBottom: '8px' }}>대검찰청 사이버수사과 (www.spo.go.kr / 국번없이 1301)</li>
          <li style={{ marginBottom: '8px' }}>경찰청 사이버안전국 (cyberbureau.police.go.kr / 국번없이 182)</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#0d6efd', fontSize: '1.3rem', marginBottom: '15px' }}>제 11 조 (개인정보 처리방침의 변경)</h3>
        <p>
          이 개인정보 처리방침은 2026년 1월 1일부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 
          변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#0d6efd', fontSize: '1.3rem', marginBottom: '15px' }}>부칙</h3>
        <p>본 방침은 2026년 1월 1일부터 시행됩니다.</p>
      </section>

      <hr style={{ margin: '40px 0', borderTop: '2px solid #dee2e6' }} />

      <div style={{ padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px', borderLeft: '4px solid #ffc107', marginBottom: '50px' }}>
        <h4 style={{ color: '#856404', marginBottom: '15px' }}>중요 안내사항</h4>
        <p style={{ margin: 0, lineHeight: '1.8', color: '#856404' }}>
          본 개인정보 처리방침은 Risk Watch 서비스를 이용하시는 모든 분들에게 적용됩니다. 
          서비스 이용 시 개인정보 수집 및 이용에 동의한 것으로 간주되오니, 본 방침을 주의 깊게 읽어주시기 바랍니다.
        </p>
      </div>
    </div>
  );
};

