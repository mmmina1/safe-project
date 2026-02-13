// [React -> Unity 통신]
// React가 sendMessage를 통해 아래 함수들을 호출함

public class ReactBridge : MonoBehaviour {
    // 1. NPC 대사 표시
    public void ShowDialogue(string speech) {
        speechBubble.text = speech;
        animator.SetTrigger("Speak");
    }

    // 2. 리액트 버튼 클릭에 따른 실시간 심리(감정) 변화
    public void SetEmotion(int rankScore) {
        // rankScore가 낮으면 사기꾼의 가스라이팅이 성공한 것으로 판단 -> 캐릭터가 불안해함
        if(rankScore < 50) {
            animator.SetBool("IsAnxious", true);
            fearParticle.Play();
        } else {
            animator.SetBool("IsAnxious", false);
            confidenceParticle.Play();
        }
    }
}