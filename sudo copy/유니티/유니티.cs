// ============================================================
// [React -> Unity 통신]
// React의 sendMessage("ReactReceiver", "함수명", "값")를 통해 호출됨
// ============================================================

public class ReactBridge : MonoBehaviour {
    [Header("UI & Particles")]
    public Text speechBubble;
    public Image tensionGauge; // 긴장도 게이지 (0.0 ~ 1.0)
    public ParticleSystem sweatParticle; // 불안함 연출
    public ParticleSystem angerEffet;    // 화남 연출
    public ParticleSystem reliefEffect;  // 안도 연출

    private Animator animator;

    void Start() {
        animator = GetComponent<Animator>();
    }

    // ------------------------------------------------------------
    // 1. NPC 대사 표시 및 말하기 애니메이션
    // ------------------------------------------------------------
    public void ShowDialogue(string speech) {
        StopAllCoroutines();
        StartCoroutine(TypeWriterEffect(speech));
        
        // 말하는 애니메이션 트리거
        animator.SetTrigger("Speak");
    }

    // ------------------------------------------------------------
    // 2. 실시간 감정 상태 연동 (AI 서버의 emotional_state 기반)
    // ------------------------------------------------------------
    public void SetEmotion(string emotionState) {
        // 모든 감정 파라미터 초기화
        ResetEmotions();

        switch (emotionState) {
            case "Anxious": // 불안함
                animator.SetBool("IsAnxious", true);
                sweatParticle.Play();
                break;
            case "Angry":   // 분노/공격적
                animator.SetBool("IsAngry", true);
                angerEffet.Play();
                break;
            case "Relieved": // 안도함
                animator.SetBool("IsHappy", true);
                reliefEffect.Play();
                break;
            case "Normal":  // 평범
            default:
                animator.SetBool("IsIdle", true);
                break;
        }
    }

    // ------------------------------------------------------------
    // 3. 긴장도 게이지 업데이트 (AI 서버의 tension_level 기반)
    // ------------------------------------------------------------
    public void SetTension(int tensionLevel) {
        // tensionLevel: 0 ~ 100
        float fillAmount = tensionLevel / 100f;
        tensionGauge.fillAmount = fillAmount;

        // 긴장도가 80 이상이면 빨간색으로 경고 효과
        if (tensionLevel >= 80) {
            tensionGauge.color = Color.red;
            animator.speed = 1.2f; // 호흡이 빨라지는 연출 등
        } else {
            tensionGauge.color = Color.yellow;
            animator.speed = 1.0f;
        }
    }

    // ------------------------------------------------------------
    // [Unity -> React 통신 가상함수]
    // ------------------------------------------------------------
    public void OnAnimationFinished() {
        // 애니메이션이 끝났음을 리액트에 알림 (다음 동작 유도)
        #if !UNITY_EDITOR && UNITY_WEBGL
            Application.ExternalCall("dispatchReactEvent", "AnimationComplete", "Idle");
        #endif
    }

    private void ResetEmotions() {
        animator.SetBool("IsAnxious", false);
        animator.SetBool("IsAngry", false);
        animator.SetBool("IsHappy", false);
    }

    IEnumerator TypeWriterEffect(string text) {
        speechBubble.text = "";
        foreach (char c in text.ToCharArray()) {
            speechBubble.text += c;
            yield return new WaitForSeconds(0.05f);
        }
    }
}