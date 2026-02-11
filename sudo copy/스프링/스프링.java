
// 4. [Controller] 프론트로부터 /api/ai/simulator/start 요청을 받음
// 5. [Service] 파이썬 AI 서버에게 "현실 사례 기반 시나리오" 생성을 위임

// @RestController
// class SimulatorController {
// @GetMapping("/start")
// public ResponseEntity<SimRes> start() {
// // (1) 사용자의 취약점 데이터나 연령대 정보를 파이썬에 함께 전달 가능
// // (2) 파이썬으로부터 { dialogue: "...", choices: [...] } 구조를 받음
// return pythonClient.getScenario(userProfile);
// }
//
// @PostMapping("/evaluate")
// public ResponseEntity<EvalRes> evaluate(@RequestBody ChoiceReq req) {
// // 사용자의 선택에 대한 AI의 실시간 피드백 + 점수 계산
// return pythonClient.evaluate(req);
// }
// }
