export const diagnosisQuestions = [
    {
        id: "Q1",
        text: "최근 '부고장', '정부24' 사칭 문자에 포함된 링크(URL)를 눌러본 적이 있나요?",
        options: ["전혀 없다", "클릭만 해봤다", "클릭 후 앱(.apk)까지 설치했다"],
        scores: [1, 0.5, 0],
        recommendation: "출처 불명 문자 링크 클릭 금지 및 스미싱 신고",
        // KISA 공식: 스미싱·큐싱 대응 가이드
    },
    {
        id: "Q2",
        text: "검찰/경찰이 전화로 \"범죄에 연루되었으니 안전계좌로 송금하라\"고 한다면 어떻게 하시겠습니까?",
        options: ["즉시 끊고 112에 확인한다", "상황을 좀 더 지켜본다", "지시대로 송금한다"],
        scores: [1, 0.5, 0],
        recommendation: "수사기관 사칭 전화는 즉시 끊고 112 신고",
        // 경찰청 전기통신금융사기 통합대응단
        url: "https://www.counterscam112.go.kr/"
    },
    {
        id: "Q3",
        text: "내 명의로 몰래 개통된 휴대폰이 있는지 확인하는 '엠세이퍼(Msafer)' 서비스를 알고 계십니까?",
        options: ["이미 사용 중이다", "알고는 있다", "처음 들어본다"],
        scores: [1, 0.5, 0],
        recommendation: "엠세이퍼(Msafer)에서 명의도용 가입 제한 신청",
        // Msafer 공식
        url: "https://www.msafer.or.kr/"
    },
    {
        id: "Q4",
        text: "\"저금리 대출로 갈아타게 해주겠다\"며 직원을 보낼 테니 현금을 달라고 하면 어떻게 하시겠습니까?",
        options: ["금융권에 직접 확인하거나 신고한다", "생각해 보겠다고 한다", "직원을 만나 돈을 준다"],
        scores: [1, 0.5, 0],
        recommendation: "대출 빙자 현금 요구는 보이스피싱 → 즉시 신고",
        // 통합대응단: 피해 발생 시 대응방법
        url: "https://www.counterscam112.go.kr/board/CONTENT_000000000005.do"
    },
    {
        id: "Q5",
        text: "모르는 사람에게 받은 카카오톡 파일(.apk)을 설치한 경험이 있나요?",
        options: ["절대 없다", "호기심에 한두 번 있다", "필요할 때 가끔 한다"],
        scores: [1, 0.5, 0],
        recommendation: "출처 불명 앱 설치 금지 및 악성앱 점검",
        // KISA 공식: 악성앱·스미싱 대응
    },
    {
        id: "Q6",
        text: "금융감독원의 '개인정보노출자 사고예방시스템'에 대해 알고 계십니까?",
        options: ["이미 등록하여 관리 중이다", "들어본 적 있다", "전혀 모른다"],
        scores: [1, 0.5, 0],
        recommendation: "개인정보노출자 사고예방시스템 등록으로 2차 피해 차단",
        // 금감원 공식 시스템
        url: "https://pd.fss.or.kr/"
    },
    {
        id: "Q7",
        text: "보이스피싱 송금 피해를 입었을 때, 가장 먼저 해야 할 일은 무엇일까요?",
        options: ["은행에 즉시 지급정지 요청", "경찰서 방문 신고", "가족/지인에게 의논"],
        scores: [1, 0.5, 0],
        recommendation: "즉시 은행 지급정지 + 112 신고",
        // 통합대응단: 통합제보 가이드
        url: "https://www.counterscam112.go.kr/report/reportGuide.do?type=itg"
    },
    {
        id: "Q8",
        text: "내 명의의 모든 예금/대출 계좌를 한눈에 조회하는 '어카운트인포'를 쓰고 계십니까?",
        options: ["주기적으로 확인한다", "들어만 봤다", "모른다"],
        scores: [1, 0.5, 0],
        recommendation: "어카운트인포에서 미사용 계좌 점검",
        // 계좌정보통합관리 공식
        url: "https://www.payinfo.or.kr/gatePay.html"
    },
    {
        id: "Q9",
        text: "공공기관은 전화나 문자로 절대 계좌 이체나 현금 인출을 요구하지 않는다는 사실을 아시나요?",
        options: ["확실히 알고 있다", "상황에 따라 다를 것 같다", "몰랐다"],
        scores: [1, 0.5, 0],
        recommendation: "기관 사칭 전화는 즉시 끊고 의심번호 조회",
        // 통합대응단: 의심번호 검색
        url: "https://www.counterscam112.go.kr/phishing/searchPhone.do"
    },
    {
        id: "Q10",
        text: "휴대폰에 모바일 전용 백신(V3, 알약 등)이 설치되어 있고 정기적으로 검사하시나요?",
        options: ["설치되어 있고 항상 검사한다", "설치는 되어 있으나 안 한다", "없다"],
        scores: [1, 0.5, 0],
        recommendation: "모바일 백신 점검 및 118 상담",
        // KISA 118 공식 안내
        url: "https://www.kisa.or.kr/303"
    },
    {
        id: "Q11",
        text: "큰 금액을 이체할 때, 최소 3시간 후 입금되는 '지연이체 서비스'를 설정하셨나요?",
        options: ["설정되어 있다", "알지만 안 했다", "처음 듣는다"],
        scores: [1, 0.5, 0],
        recommendation: "지연이체 서비스로 피싱·착오송금 예방",
        // 금융위원회 공식 문서(지연이체·예방제도 정리)
        url: "https://www.fsc.go.kr/comm/getFile?fileNo=4&fileTy=ATTACH&srvcId=BBSTY1&upperNo=74163"
    },
    {
        id: "Q12",
        text: "해외에서 내 계좌 접속을 차단하는 '해외 IP 차단 서비스'를 이용 중이신가요?",
        options: ["이용 중이다", "해외 나갈 일이 없어 안 했다", "모른다"],
        scores: [1, 0.5, 0],
        recommendation: "해외 IP 차단으로 해킹·정보유출 대비",
        // 공공 법령 정보(금감원 보이스피싱 지킴이 근거)
        url: "https://easylaw.go.kr/CSP/CnpClsMain.laf?ccfNo=4&cciNo=1&cnpClsNo=2&csmSeq=1592&popMenu=ov"
    },
    {
        id: "Q13",
        text: "지정한 휴대폰에서만 금융거래가 가능한 '단말기 지정 서비스'를 쓰시나요?",
        options: ["이미 쓰고 있다", "불편할 것 같아 안 쓴다", "몰랐다"],
        scores: [1, 0.5, 0],
        recommendation: "단말기 지정으로 타 기기 부정이체 차단",
        // 금융위원회 공식 문서(단말기 지정 포함)
    }
];
