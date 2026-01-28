import React from 'react';

const Terms = () => {
  return (
    <div style={{ padding: '50px', lineHeight: '1.8', color: '#333', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px', borderBottom: '3px solid #0d6efd', paddingBottom: '10px' }}>
        Risk Watch 이용약관
      </h1>
      <p style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '30px' }}>시행일자: 2026년 1월 1일</p>
      
      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#0d6efd', fontSize: '1.3rem', marginBottom: '15px' }}>제 1 조 (목적)</h3>
        <p>
          본 약관은 Team SAFE(이하 "회사")가 제공하는 Risk Watch 서비스(이하 "서비스")의 이용과 관련하여 
          회사와 이용자 간의 권리, 의무 및 책임사항, 서비스 이용조건 및 절차, 기타 필요한 사항을 규정함을 목적으로 합니다.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#0d6efd', fontSize: '1.3rem', marginBottom: '15px' }}>제 2 조 (정의)</h3>
        <p>본 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
        <ol style={{ marginLeft: '25px', marginTop: '15px' }}>
          <li style={{ marginBottom: '12px' }}>
            <strong>"서비스"</strong>란 Risk Watch가 제공하는 스미싱(SMS Phishing) 탐지 및 분석 플랫폼, 
            문자 메시지 및 URL 위험도 분석 서비스를 의미합니다.
          </li>
          <li style={{ marginBottom: '12px' }}>
            <strong>"이용자"</strong>란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.
          </li>
          <li style={{ marginBottom: '12px' }}>
            <strong>"회원"</strong>이란 회사와 서비스 이용계약을 체결하고 아이디(ID)를 부여받은 이용자를 말합니다.
          </li>
          <li style={{ marginBottom: '12px' }}>
            <strong>"비회원"</strong>이란 회원가입 없이 회사가 제공하는 서비스를 이용하는 자를 말합니다.
          </li>
          <li style={{ marginBottom: '12px' }}>
            <strong>"콘텐츠"</strong>란 서비스에서 제공되는 부호, 문자, 음성, 음향, 이미지, 영상 등으로 표현된 
            자료 또는 정보를 말합니다.
          </li>
        </ol>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#0d6efd', fontSize: '1.3rem', marginBottom: '15px' }}>제 3 조 (약관의 효력 및 변경)</h3>
        <ol style={{ marginLeft: '25px', marginTop: '15px' }}>
          <li style={{ marginBottom: '12px' }}>
            본 약관은 서비스 화면에 게시하거나 기타의 방법으로 공지함으로써 효력이 발생합니다.
          </li>
          <li style={{ marginBottom: '12px' }}>
            회사는 필요한 경우 관련 법령(전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제에 관한 법률, 
            정보통신망 이용촉진 및 정보보호 등에 관한 법률 등)을 위배하지 않는 범위에서 본 약관을 변경할 수 있습니다.
          </li>
          <li style={{ marginBottom: '12px' }}>
            회사가 약관을 변경할 경우에는 적용일자 및 변경사유를 명시하여 현행약관과 함께 
            그 적용일자 7일 전부터 적용일자 전일까지 서비스 초기화면 또는 공지사항을 통해 공지합니다. 
            다만, 이용자에게 불리하게 약관 내용을 변경하는 경우에는 최소한 30일 이상의 사전 유예기간을 두고 공지합니다.
          </li>
          <li style={{ marginBottom: '12px' }}>
            이용자가 변경된 약관에 동의하지 않는 경우, 이용자는 서비스 이용을 중단하고 이용계약을 해지할 수 있습니다. 
            변경된 약관의 효력 발생일 이후에도 서비스를 계속 이용하는 경우에는 약관의 변경사항에 동의한 것으로 간주합니다.
          </li>
        </ol>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#0d6efd', fontSize: '1.3rem', marginBottom: '15px' }}>제 4 조 (서비스의 제공 및 변경)</h3>
        <ol style={{ marginLeft: '25px', marginTop: '15px' }}>
          <li style={{ marginBottom: '12px' }}>
            회사는 다음과 같은 서비스를 제공합니다:
            <ul style={{ marginLeft: '25px', marginTop: '10px' }}>
              <li>문자 메시지(SMS/MMS) 내용의 스미싱 위험도 분석</li>
              <li>URL 링크의 악성 여부 및 위험도 분석</li>
              <li>의심 문자 신고 및 데이터베이스 구축</li>
              <li>스미싱 예방을 위한 정보 및 가이드 제공</li>
              <li>통계 및 트렌드 정보 제공</li>
              <li>기타 회사가 추가 개발하거나 제휴계약 등을 통해 이용자에게 제공하는 일체의 서비스</li>
            </ul>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <strong>본 서비스는 사용자가 입력한 정보를 바탕으로 AI 및 머신러닝 기술을 활용하여 보안 위협 가능성을 분석하여 제공하며, 
            제공되는 분석 결과는 참고용으로만 사용되어야 합니다. 최종 판단 및 조치는 이용자의 책임 하에 이루어져야 합니다.</strong>
          </li>
          <li style={{ marginBottom: '12px' }}>
            회사는 서비스의 품질 향상을 위해 서비스의 내용을 변경할 수 있으며, 변경 전 해당 내용을 서비스 화면에 공지합니다.
          </li>
          <li style={{ marginBottom: '12px' }}>
            회사는 무료로 제공되는 서비스의 일부 또는 전부를 회사의 정책 및 운영의 필요상 수정, 중단, 변경할 수 있으며, 
            이에 대하여 관련 법령에 특별한 규정이 없는 한 이용자에게 별도의 보상을 하지 않습니다.
          </li>
        </ol>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#0d6efd', fontSize: '1.3rem', marginBottom: '15px' }}>제 5 조 (서비스의 중단)</h3>
        <ol style={{ marginLeft: '25px', marginTop: '15px' }}>
          <li style={{ marginBottom: '12px' }}>
            회사는 다음 각 호에 해당하는 경우 서비스의 전부 또는 일부를 제한하거나 중단할 수 있습니다:
            <ul style={{ marginLeft: '25px', marginTop: '10px' }}>
              <li>컴퓨터, 서버 등 정보통신설비의 보수점검, 교체, 정기점검 또는 고장</li>
              <li>정전, 제반 설비의 장애 또는 이용량의 폭주 등으로 정상적인 서비스 이용에 지장이 있는 경우</li>
              <li>서비스 제공업자와의 계약 종료 등과 같은 회사의 제반 사정으로 서비스를 유지할 수 없는 경우</li>
              <li>기타 천재지변, 국가비상사태 등 불가항력적 사유가 있는 경우</li>
            </ul>
          </li>
          <li style={{ marginBottom: '12px' }}>
            회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여는 
            회사의 고의 또는 중대한 과실이 없는 한 책임을 지지 않습니다.
          </li>
        </ol>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#0d6efd', fontSize: '1.3rem', marginBottom: '15px' }}>제 6 조 (회원가입 및 계정관리)</h3>
        <ol style={{ marginLeft: '25px', marginTop: '15px' }}>
          <li style={{ marginBottom: '12px' }}>
            이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관 및 개인정보처리방침에 동의한다는 
            의사표시를 함으로써 회원가입을 신청합니다.
          </li>
          <li style={{ marginBottom: '12px' }}>
            회원은 자신의 계정(ID 및 비밀번호)을 제3자에게 이용하게 해서는 안 되며, 계정의 관리 소홀, 부정사용에 의하여 
            발생하는 모든 결과에 대한 책임은 회원에게 있습니다.
          </li>
        </ol>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#0d6efd', fontSize: '1.3rem', marginBottom: '15px' }}>제 7 조 (회원 탈퇴 및 자격 상실)</h3>
        <ol style={{ marginLeft: '25px', marginTop: '15px' }}>
          <li style={{ marginBottom: '12px' }}>
            회원은 언제든지 회사에게 회원 탈퇴를 요청할 수 있으며, 회사는 관련 법령 등이 정하는 바에 따라 
            이를 즉시 처리합니다.
          </li>
          <li style={{ marginBottom: '12px' }}>
            회원이 다음 각 호의 사유에 해당하는 경우, 회사는 회원자격을 제한 및 정지시킬 수 있습니다:
            <ul style={{ marginLeft: '25px', marginTop: '10px' }}>
              <li>가입 신청 시에 허위 내용을 등록한 경우</li>
              <li>다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 경우</li>
              <li>서비스를 이용하여 법령 또는 본 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</li>
            </ul>
          </li>
        </ol>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#0d6efd', fontSize: '1.3rem', marginBottom: '15px' }}>제 8 조 (이용자의 의무)</h3>
        <p>이용자는 다음 각 호의 행위를 하여서는 안 됩니다:</p>
        <ol style={{ marginLeft: '25px', marginTop: '15px' }}>
          <li style={{ marginBottom: '12px' }}>신청 또는 변경 시 허위 내용의 등록</li>
          <li style={{ marginBottom: '12px' }}>타인의 정보 도용</li>
          <li style={{ marginBottom: '12px' }}>회사가 게시한 정보의 변경</li>
          <li style={{ marginBottom: '12px' }}>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
          <li style={{ marginBottom: '12px' }}>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
          <li style={{ marginBottom: '12px' }}>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
          <li style={{ marginBottom: '12px' }}>관련 법령에 위배되는 행위</li>
        </ol>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#0d6efd', fontSize: '1.3rem', marginBottom: '15px' }}>제 9 조 (저작권의 귀속)</h3>
        <ol style={{ marginLeft: '25px', marginTop: '15px' }}>
          <li style={{ marginBottom: '12px' }}>
            회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다.
          </li>
          <li style={{ marginBottom: '12px' }}>
            이용자는 서비스를 이용함으로써 얻은 정보 중 회사에게 지적재산권이 귀속된 정보를 회사의 사전 승낙 없이 
            복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.
          </li>
        </ol>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#0d6efd', fontSize: '1.3rem', marginBottom: '15px' }}>제 10 조 (면책 및 손해배상)</h3>
        <ol style={{ marginLeft: '25px', marginTop: '15px' }}>
          <li style={{ marginBottom: '12px' }}>
            회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 및 기타 이에 준하는 불가항력으로 인하여 
            서비스를 제공할 수 없는 경우에는 서비스 제공에 대한 책임이 면제됩니다.
          </li>
          <li style={{ marginBottom: '12px' }}>
            회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.
          </li>
          <li style={{ marginBottom: '12px' }}>
            <strong>본 서비스는 스미싱 위험도 분석 결과를 참고용으로만 제공하며, 제공되는 분석 결과의 정확성, 신뢰성, 
            완전성을 보장하지 않습니다. 이용자는 제공된 분석 결과를 바탕으로 한 최종 판단 및 조치에 대한 
            모든 책임을 스스로 부담합니다.</strong>
          </li>
          <li style={{ marginBottom: '12px' }}>
            회사는 이용자가 게재한 정보, 자료, 사실의 신뢰도, 정확성 등 내용에 관하여는 책임을 지지 않습니다.
          </li>
          <li style={{ marginBottom: '12px' }}>
            회사는 이용자 간 또는 이용자와 제3자 상호간에 서비스를 매개로 발생한 분쟁에 대해 개입할 의무가 없으며 
            이로 인한 손해를 배상할 책임도 없습니다.
          </li>
        </ol>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#0d6efd', fontSize: '1.3rem', marginBottom: '15px' }}>제 11 조 (분쟁의 해결)</h3>
        <ol style={{ marginLeft: '25px', marginTop: '15px' }}>
          <li style={{ marginBottom: '12px' }}>
            회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 
            피해보상처리기구를 설치·운영합니다.
          </li>
          <li style={{ marginBottom: '12px' }}>
            회사와 이용자 간에 발생한 전자상거래 분쟁과 관련하여 이용자의 피해구제신청이 있는 경우에는 
            공정거래위원회 또는 시·도지사가 의뢰하는 분쟁조정기관의 조정에 따를 수 있습니다.
          </li>
        </ol>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#0d6efd', fontSize: '1.3rem', marginBottom: '15px' }}>제 12 조 (재판권 및 준거법)</h3>
        <ol style={{ marginLeft: '25px', marginTop: '15px' }}>
          <li style={{ marginBottom: '12px' }}>
            이 약관의 해석 및 회사와 이용자 간의 분쟁에 대하여는 대한민국의 법을 적용합니다.
          </li>
          <li style={{ marginBottom: '12px' }}>
            서비스 이용으로 발생한 분쟁에 대해 소송이 제기되는 경우 회사의 본사 소재지를 관할하는 법원을 관할 법원으로 합니다.
          </li>
        </ol>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#0d6efd', fontSize: '1.3rem', marginBottom: '15px' }}>부칙</h3>
        <p>본 약관은 2026년 1월 1일부터 시행됩니다.</p>
      </section>

      <hr style={{ margin: '40px 0', borderTop: '2px solid #dee2e6' }} />

      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h4 style={{ color: '#495057', marginBottom: '15px' }}>문의사항</h4>
        <p style={{ margin: 0, lineHeight: '1.8' }}>
          본 약관에 관한 문의사항이 있으신 경우 아래 연락처로 문의해 주시기 바랍니다.<br />
          <strong>이메일:</strong> chlalsdk5743@gmail.com<br />
          <strong>전화:</strong> 1588-0000 (평일 09:00 ~ 18:00)<br />
          <strong>주소:</strong> 경기도 수원시 팔달구 중부대로 100 3층, 4층
        </p>
      </div>
    </div>
  );
};

export default Terms;