# from pathlib import Path
# import csv, json, textwrap, datetime, re

# md_path = Path("/mnt/data/보이스피싱_공식가이드라인_조사정리.md")
# md_text = md_path.read_text(encoding="utf-8")

# # Build a pragmatic schema for RAG chunks and for "controls catalog"
# schema = {
#   "$schema": "https://json-schema.org/draft/2020-12/schema",
#   "title": "VoicePhishingRAGChunk",
#   "type": "object",
#   "required": ["id","source_org","source_title","source_url","doc_type","attack_type","stage","chunk_type","text"],
#   "properties": {
#     "id": {"type":"string", "description":"Unique chunk id (e.g., org:YYYYMMDD:slug:nnn)"},
#     "source_org": {"type":"string", "description":"FSS | COUNTERSCAM112 | KISA | BOHO | FSC | ETC"},
#     "source_title": {"type":"string", "description":"Original document/page title"},
#     "source_url": {"type":"string", "format":"uri"},
#     "published_date": {"type":["string","null"], "description":"YYYY-MM-DD if known", "pattern":"^\\d{4}-\\d{2}-\\d{2}$"},
#     "last_updated": {"type":["string","null"], "description":"YYYY-MM-DD if known", "pattern":"^\\d{4}-\\d{2}-\\d{2}$"},
#     "doc_type": {"type":"string", "enum":["warning","howto","tool","policy","checklist","scenario","faq"]},
#     "attack_type": {"type":"string", "enum":["voice","smishing","messenger","app_install","account_takeover","number_spoofing","quishing","mixed"]},
#     "stage": {"type":"string", "enum":["prevention","detection","during_attack","post_incident"]},
#     "chunk_type": {"type":"string", "enum":["signals","donts","actions","controls","definition","example","faq","other"]},
#     "text": {"type":"string", "minLength": 1, "description":"Chunk text (Korean recommended)"},
#     "summary": {"type":["string","null"], "description":"1~2 sentence summary"},
#     "keywords": {"type":"array", "items":{"type":"string"}, "description":"Search keywords"},
#     "entities": {"type":"array", "items":{"type":"string"}, "description":"Organizations, services, phone numbers, domains"},
#     "actions": {
#       "type":"array",
#       "description":"Optional structured action items",
#       "items":{
#         "type":"object",
#         "required":["action_type","action_text"],
#         "properties":{
#           "action_type":{"type":"string","enum":["call","visit_url","report","block","freeze","scan","delete_app","change_password","bank_service","other"]},
#           "action_text":{"type":"string"},
#           "action_target":{"type":["string","null"],"description":"Phone number / URL / service name"},
#           "priority":{"type":["integer","null"],"minimum":1,"maximum":5}
#         }
#       }
#     },
#     "controls": {
#       "type":"array",
#       "description":"Optional structured controls (preventive settings/services)",
#       "items":{
#         "type":"object",
#         "required":["control_id","control_name"],
#         "properties":{
#           "control_id":{"type":"string","description":"e.g., FSS_DELAYED_TRANSFER"},
#           "control_name":{"type":"string"},
#           "enabled_by_user":{"type":["boolean","null"]},
#           "how_to_enable":{"type":["string","null"]},
#           "evidence":{"type":["string","null"],"description":"Short justification / source quote paraphrase"}
#         }
#       }
#     },
#     "severity": {"type":["string","null"], "enum":[None,"low","medium","high","critical"]},
#     "lang": {"type":"string", "default":"ko"},
#     "version": {"type":"string", "default":"1.0"}
#   }
# }

# # CSV schema (headers) for a flattened chunk table
# csv_headers = [
#   "id","source_org","source_title","source_url","published_date","last_updated",
#   "doc_type","attack_type","stage","chunk_type","severity","keywords","entities",
#   "text","summary","actions_json","controls_json","lang","version"
# ]

# # Create examples JSONL from the MD content (not perfect extraction—manual examples derived from the MD)
# examples = [
#   {
#     "id":"COUNTERSCAM112:20251124:emergency_block:001",
#     "source_org":"COUNTERSCAM112",
#     "source_title":"보이스피싱 등 범죄 이용 전화번호 10분 내 차단(긴급차단 제도 안내)",
#     "source_url":"https://gonggam.korea.kr/newsContentView.es?call_from=rsslink&news_id=657f58cb-1d79-4566-9d2b-70ad555511a9",
#     "published_date":"2025-11-24",
#     "last_updated":None,
#     "doc_type":"policy",
#     "attack_type":"mixed",
#     "stage":"during_attack",
#     "chunk_type":"actions",
#     "text":"의심 전화번호를 통합대응단에 신고하면 통신사 연계를 통해 신속히 차단될 수 있습니다. 통화 중이라면 즉시 전화를 끊고 112(또는 통합대응단 안내 채널)로 신고하세요.",
#     "summary":"통합대응단 신고를 통해 의심번호를 신속 차단하고 즉시 신고를 유도.",
#     "keywords":["통합대응단","긴급차단","신고","의심번호","112"],
#     "entities":["112","counterscam112.go.kr"],
#     "actions":[
#       {"action_type":"call","action_text":"즉시 112로 신고", "action_target":"112", "priority":5},
#       {"action_type":"visit_url","action_text":"통합대응단 웹에서 신고/조회", "action_target":"counterscam112.go.kr", "priority":4}
#     ],
#     "controls":[],
#     "severity":"high",
#     "lang":"ko",
#     "version":"1.0"
#   },
#   {
#     "id":"KISA:20250428:smishing_quishing_response:001",
#     "source_org":"KISA",
#     "source_title":"스미싱·큐싱 공격 대응",
#     "source_url":"https://www.kisa.or.kr/1020601",
#     "published_date":None,
#     "last_updated":"2025-04-28",
#     "doc_type":"howto",
#     "attack_type":"smishing",
#     "stage":"detection",
#     "chunk_type":"donts",
#     "text":"출처가 불분명한 문자/QR(큐싱) 안내의 링크를 누르거나 앱을 설치하지 마세요. 의심 시 신고 채널(118/보호나라/통합대응단)을 이용하세요.",
#     "summary":"스미싱·큐싱에서 링크 클릭/앱 설치를 금지하고 신고 채널 사용을 권고.",
#     "keywords":["스미싱","큐싱","QR","링크","보호나라","118","신고"],
#     "entities":["118","boho.or.kr","counterscam112.go.kr"],
#     "actions":[
#       {"action_type":"call","action_text":"118로 상담/신고", "action_target":"118", "priority":4},
#       {"action_type":"report","action_text":"통합대응단에 제보", "action_target":"counterscam112.go.kr", "priority":3}
#     ],
#     "controls":[],
#     "severity":"medium",
#     "lang":"ko",
#     "version":"1.0"
#   },
#   {
#     "id":"FSS:20180802:anti_phishing_services:001",
#     "source_org":"FSS",
#     "source_title":"보이스피싱 사기예방 서비스 이용(금융꿀팁: 5대 서비스)",
#     "source_url":"https://www.fss.or.kr",
#     "published_date":"2018-08-02",
#     "last_updated":None,
#     "doc_type":"tool",
#     "attack_type":"voice",
#     "stage":"prevention",
#     "chunk_type":"controls",
#     "text":"지연이체, 입금계좌 지정(안심통장), 단말기 지정, 해외IP 차단, 개인정보노출자 사고예방시스템 등 사기예방 서비스를 활용해 피해를 줄일 수 있습니다.",
#     "summary":"은행/금융권 사기예방 설정(5대 서비스)을 안내.",
#     "keywords":["지연이체","안심통장","단말기지정","해외IP차단","개인정보노출자"],
#     "entities":["fine.fss.or.kr","pd.fss.or.kr"],
#     "actions":[
#       {"action_type":"bank_service","action_text":"거래 은행에서 지연이체/안심통장 등 예방 서비스 신청", "action_target":None, "priority":3}
#     ],
#     "controls":[
#       {"control_id":"FSS_DELAYED_TRANSFER","control_name":"지연이체 서비스","enabled_by_user":None,
#        "how_to_enable":"거래 은행(모바일/인터넷뱅킹 또는 영업점)에서 지연이체 신청",
#        "evidence":"고액 이체 시 입금을 일정 시간 지연해 취소 여지를 제공"},
#       {"control_id":"FSS_SAFE_ACCOUNT_WHITELIST","control_name":"입금계좌 지정서비스(안심통장)","enabled_by_user":None,
#        "how_to_enable":"거래 은행에서 지정계좌 등록 후 미등록 계좌 이체 한도 축소",
#        "evidence":"지정계좌 외 송금을 제한해 탈취 피해를 축소"}
#     ],
#     "severity":"medium",
#     "lang":"ko",
#     "version":"1.0"
#   }
# ]

# # Write files
# out_dir = Path("/mnt/data")
# schema_path = out_dir / "rag_chunk_schema.json"
# schema_path.write_text(json.dumps(schema, ensure_ascii=False, indent=2), encoding="utf-8")

# jsonl_path = out_dir / "rag_chunks_example.jsonl"
# with jsonl_path.open("w", encoding="utf-8") as f:
#     for ex in examples:
#         f.write(json.dumps(ex, ensure_ascii=False) + "\n")

# csv_path = out_dir / "rag_chunks_schema_and_example.csv"
# with csv_path.open("w", encoding="utf-8", newline="") as f:
#     w = csv.DictWriter(f, fieldnames=csv_headers)
#     w.writeheader()
#     for ex in examples:
#         row = {k:"" for k in csv_headers}
#         for k in ["id","source_org","source_title","source_url","published_date","last_updated",
#                   "doc_type","attack_type","stage","chunk_type","severity","text","summary","lang","version"]:
#             row[k] = ex.get(k) if ex.get(k) is not None else ""
#         row["keywords"] = "|".join(ex.get("keywords", []))
#         row["entities"] = "|".join(ex.get("entities", []))
#         row["actions_json"] = json.dumps(ex.get("actions", []), ensure_ascii=False)
#         row["controls_json"] = json.dumps(ex.get("controls", []), ensure_ascii=False)
#         w.writerow(row)

# # Diagnosis logic templates (rules + phrase templates)
# diagnosis_md = f"""# “고객님은 ○○ 부분이 취약합니다” 자동 진단 로직 & 문장 템플릿 (v1)

# 본 문서는 **RAG 기반 안내** 또는 **웹 시뮬레이션 결과 리포트**에서,
# 사용자에게 “어떤 부분이 취약한지”를 **규칙 기반으로 자동 생성**하기 위한 템플릿입니다.

# ---

# ## 1) 입력 데이터(권장)

# ### A. 사용자 상태 입력(예시)
# - `has_delayed_transfer` (지연이체 설정 여부)
# - `has_safe_account_whitelist` (입금계좌 지정/안심통장 여부)
# - `has_device_binding` (단말기 지정 여부)
# - `has_overseas_ip_block` (해외IP차단 여부)
# - `registered_pd_fss` (개인정보노출자 등록 여부: pd.fss.or.kr)
# - `installed_spam_blocker` (스팸차단 앱/통신사 스팸필터 사용 여부)
# - `clicked_suspicious_link_recently` (최근 의심 URL 클릭)
# - `installed_unknown_app_recently` (최근 출처불명 앱 설치)
# - `shared_auth_info` (OTP/보안카드/인증번호 공유 경험)
# - `received_impersonation_call` (기관/금융사/가족 사칭 전화 수신)
# - `sent_money_last_24h` (최근 24시간 송금 여부)
# - `knows_report_channels` (112/118/통합대응단 신고 경로 인지)

# ### B. 사건 입력(선택)
# - `attack_type_detected` = voice/smishing/messenger/app_install/mixed
# - `urgency_level` = low/medium/high/critical

# ---

# ## 2) 취약점(Weakness) 정의(카탈로그)

# 각 취약점은 **(명칭 / 설명 / 권고 액션 / 근거 출처)** 4요소로 관리합니다.

# ### W1. 송금 회복력(Recovery) 취약
# - **조건(예시)**: `has_delayed_transfer == false` AND `sent_money_last_24h == true`
# - **의미**: 속아 송금했을 때 **취소/지연으로 되돌릴 시간**이 부족
# - **권고 액션**: 거래 은행에서 **지연이체 서비스** 신청 + 즉시 112 신고
# - **근거**: 금융권 지연이체/피해 예방 제도(금감원/금융당국 안내 기반)

# ### W2. 송금 제한(Exposure Control) 취약
# - **조건(예시)**: `has_safe_account_whitelist == false`
# - **의미**: 인증정보 탈취 시 **임의 계좌로 큰 금액 이체** 위험
# - **권고 액션**: **입금계좌 지정(안심통장)** 설정

# ### W3. 계정/기기 방어(Device/Access) 취약
# - **조건(예시)**: `has_device_binding == false` OR `has_overseas_ip_block == false`
# - **의미**: 타 기기/해외 접속으로 **부정이체·탈취** 위험
# - **권고 액션**: 단말기 지정 / 해외IP 차단 설정

# ### W4. 신원도용 확산(Fraud Expansion) 취약
# - **조건(예시)**: `registered_pd_fss == false` AND (개인정보 유출 의심/경험)
# - **의미**: 내 정보로 **추가 계좌개설·대출 등 2차 피해** 위험
# - **권고 액션**: 개인정보노출자 등록(p.d. 시스템) 및 본인확인 강화

# ### W5. 스미싱/악성앱(Endpoint) 취약
# - **조건(예시)**: `clicked_suspicious_link_recently == true` OR `installed_unknown_app_recently == true`
# - **의미**: 문자 링크/QR로 악성앱 설치 → **원격제어·인증정보 탈취** 위험
# - **권고 액션**: 118 상담 + 악성앱 삭제/점검 + 통합대응단 신고

# ### W6. 신고/차단 골든타임(Reporting) 취약
# - **조건(예시)**: `knows_report_channels == false`
# - **의미**: 피해 초기에 신고가 지연되어 **차단·지급정지 타이밍**을 놓칠 위험
# - **권고 액션**: “112 / 118 / 통합대응단(counterscam112)” 경로 저장/학습

# ---

# ## 3) 진단 점수화(간단 버전)

# - 각 취약점 W1~W6에 대해 **0/1** 발생 여부 계산
# - `risk_score = Σ(weight_i * weakness_i)`
#   - 권장 가중치(기본): W1=3, W2=2, W3=2, W4=2, W5=3, W6=1
# - 점수 구간:
#   - 0~2: 낮음
#   - 3~5: 보통
#   - 6~8: 높음
#   - 9+: 매우 높음

# ---

# ## 4) 문장 템플릿(생성 규칙)

# ### 4-1. 메인 진단 문장(1줄)
# **템플릿**
# - “고객님은 **{{weakness_name}}** 부분이 취약합니다. (현재 상태: {{evidence_short}})”

# **예시**
# - “고객님은 **송금 회복력(지연이체 미설정)** 부분이 취약합니다. (최근 송금은 있었지만 지연이체가 꺼져 있어 되돌릴 시간이 부족합니다.)”
# - “고객님은 **스미싱/악성앱 노출** 부분이 취약합니다. (최근 의심 링크를 클릭했고 출처 불명 앱 설치 이력이 있습니다.)”

# ### 4-2. 권고 액션(불릿 2~4개)
# **템플릿**
# - “지금 권장되는 조치”
#   - “1) {{action_1}}”
#   - “2) {{action_2}}”
#   - “3) {{action_3}}(선택)”

# **예시(긴급)**
# - 1) “즉시 **112**로 신고”
# - 2) “통합대응단 사이트에서 **의심번호 신고/조회**”
# - 3) “118로 상담(스미싱/악성앱 의심 시)”

# ### 4-3. 사용자 납득을 위한 근거(1~2문장)
# **템플릿**
# - “공식 안내에 따르면 {{source_org}}는 {{reason}}를 권고합니다.”

# ---

# ## 5) 취약점별 문구 뱅크(자동 조합용)

# ### W1. 송금 회복력(지연이체)
# - **진단 문구**
#   - “최근 송금이 있었는데 지연이체가 미설정이라 피해금 회수가 어려워질 수 있습니다.”
# - **권고 문구**
#   - “거래 은행에서 **지연이체 서비스**를 신청해 고액 이체 시 ‘되돌릴 시간’을 확보하세요.”

# ### W2. 송금 제한(안심통장)
# - **진단 문구**
#   - “지정계좌 제한이 없어 인증정보 유출 시 임의 계좌로 송금될 위험이 있습니다.”
# - **권고 문구**
#   - “**입금계좌 지정(안심통장)**을 설정해 지정 계좌 외 이체 한도를 줄이세요.”

# ### W3. 접근 통제(단말기/해외IP)
# - **진단 문구**
#   - “단말기·접속지역 제한이 없어 타 기기/해외에서 부정거래가 발생할 수 있습니다.”
# - **권고 문구**
#   - “**단말기 지정**과 **해외IP 차단**을 켜서 계정 탈취 피해를 줄이세요.”

# ### W4. 신원도용 확산(개인정보노출자 등록)
# - **진단 문구**
#   - “개인정보가 유출됐을 수 있는데 노출자 등록이 없어 2차 금융피해가 이어질 수 있습니다.”
# - **권고 문구**
#   - “**개인정보노출자 사고예방시스템**에 등록해 신규 계좌/대출 등 명의도용 거래를 제한하세요.”

# ### W5. 스미싱/악성앱
# - **진단 문구**
#   - “의심 링크 클릭/앱 설치 이력은 원격제어·인증정보 탈취로 이어질 수 있습니다.”
# - **권고 문구**
#   - “즉시 **118** 상담을 받고, 의심 앱 삭제·점검 후 통합대응단에 제보하세요.”

# ### W6. 신고/차단 골든타임
# - **진단 문구**
#   - “신고 경로를 모르면 초기 차단 타이밍을 놓치기 쉽습니다.”
# - **권고 문구**
#   - “**112 / 118 / 통합대응단(counterscam112)**를 즐겨찾기/연락처에 저장하세요.”

# ---

# ## 6) 출력 포맷 예시(JSON)

# ```json
# {{
#   "overall_risk": "high",
#   "risk_score": 7,
#   "top_weaknesses": [
#     {{
#       "weakness_id": "W1",
#       "weakness_name": "송금 회복력(지연이체 미설정)",
#       "evidence_short": "최근 24시간 송금 이력 + 지연이체 미설정",
#       "recommendations": ["즉시 112 신고", "거래 은행에 지연이체 신청", "통합대응단에 의심번호 제보/조회"]
#     }},
#     {{
#       "weakness_id": "W5",
#       "weakness_name": "스미싱/악성앱 노출",
#       "evidence_short": "의심 링크 클릭/출처 불명 앱 설치",
#       "recommendations": ["118 상담", "의심 앱 삭제 및 보안 점검", "통합대응단에 스미싱 제보"]
#     }}
#   ],
#   "user_facing_message": "고객님은 송금 회복력(지연이체 미설정)과 스미싱/악성앱 노출 부분이 취약합니다. 지금은 112 신고 및 118 상담을 우선 권장드립니다."
# }}
