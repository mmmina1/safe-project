using UnityEngine;
using System;

// 1. AI 응답을 받기 위한 데이터 구조 (JSON 매핑용)
[Serializable]
public class AIScenarioData
{
    public string dialogue;           // 유니티 대화창에 표시될 리얼한 대사
    public string visual_cue;         // 캐릭터 애니메이션/연출용 힌트
    public bool is_victim;            // 피해 의심 여부
    public string scam_type;          // 사기 유형
    public string document_status;    // 서류 지참 및 누락 상태
    public string contradiction_point; // 결정적 모순점 (Papers Please 핵심 단서)
    public string[] unusual_points;   // 이상 징후 목록
    public string internal_state;     // 심리 상태 설명
}

// 2. 유니티에서 AI 데이터를 처리하는 매니저
public class AIInteractionManager : MonoBehaviour
{
    public void HandleAIResponse(string jsonResponse)
    {
        try 
        {
            AIScenarioData data = JsonUtility.FromJson<AIScenarioData>(jsonResponse);
            ExecuteUnityScenario(data);
        }
        catch (Exception e)
        {
            Debug.LogError("AI JSON 파싱 실패: " + e.Message);
        }
    }

    private void ExecuteUnityScenario(AIScenarioData data)
    {
        // A. 연출 실행 (애니메이션, BGM 등)
        switch (data.unity_action_tag)
        {
            case "NPC_ANGRY":
                // NPC가 화내는 애니메이션 실행
                break;
            case "SHOW_DOCUMENT":
                // 가짜 공문 UI 띄우기
                break;
        }

        // B. 대사 렌더링 (안전한 템플릿 사용)
        string finalDialogue = GetSafeDialogue(data.suggested_template, data.scam_logic);
        Debug.Log("최종 출력 대사: " + finalDialogue);
    }

    private string GetSafeDialogue(string templateKey, string logic)
    {
        // 실제 유해한 문장은 여기서 로컬 템플릿으로 안전하게 변환
        if (templateKey == "PRESSURE_MONEY")
            return $"[경고] 상대방이 {logic}을(를) 근거로 자금 이체를 압박하고 있습니다.";
        
        return "알 수 없는 요청입니다.";
    }
}
