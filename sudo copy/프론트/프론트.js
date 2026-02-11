// 1. [진입] 사용자가 시뮬레이션 페이지(/ai/sim)로 들어옴
// 2. [로딩] Unity WebGL 인스턴스가 생성되고 로딩됨
// 3. [시작 요청]
//    useEffect(() => {
//        const startResult = await axios.get('/api/ai/simulator/start');
//        setDialogue(startResult.dialogue);
//        setChoices(startResult.choices); // [중요] AI가 생성한 3가지 대응 버튼 데이터
//    }, []);

// 4. [Unity 연동]
//    - sendMessage("UnityNPC", "PlaySpeech", dialogue); // AI 대사를 Unity 말풍선으로

// 5. [UI 렌더링]
//    - <div className="choice-container">
//    -   {choices.map(choice => (
//    -       <button onClick={() => handleChoice(choice.id)}>
//    -           {choice.text} (분석: {choice.type})
//    -       </button>
//    -   ))}
//    - </div>

// 6. [사용자 인터랙션]
//    const handleChoice = (id) => {
//        // (A) Unity 연출: 버튼의 성격(강력함/공감 등)에 따라 감정 수치 전달
//        sendMessage("UnityNPC", "UpdateEmotion", choice.score);
//        // (B) 백엔드 평가: 선택한 결과를 서버에 전송하여 다음 단계/평가 받기
//        const eval = await axios.post('/api/ai/simulator/evaluate', { choiceId: id });
//    }