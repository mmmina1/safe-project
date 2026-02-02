<<<<<<< HEAD
import os
=======
# ============================================================
# 1. 임포트 및 설정 구역 (라이브러리 및 환경 설정)
# ============================================================
import os
import openai
>>>>>>> b0ab98293bedc6ec51b2aff874dc0d691bf6e534
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# 설정: DB 경로 및 임베딩 모델 (절대 경로로 통일)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "chroma_db")
EMBEDDING_MODEL = "text-embedding-3-small"
LLM_MODEL = "gpt-4o"

<<<<<<< HEAD
=======

# ============================================================
# 2. 클래스 및 함수 정의 구역 (비즈니스 로직)
# ============================================================

>>>>>>> b0ab98293bedc6ec51b2aff874dc0d691bf6e534
class MockChatService:
    """
    API 키가 없을 때 동작하는 가상의 챗봇 서비스입니다.
    외부 연결 없이 고정된 응답을 반환합니다.
    """
    def __init__(self):
        print("[System] Running in MOCK Mode (No External Config)")
        
    def get_answer(self, message: str):
        return {
            "answer": f"[MockBot] 안녕하세요! 현재 테스트 모드입니다. 입력하신 내용은 '{message}' 입니다. 실제 AI 연결은 되어있지 않습니다.",
            "context": [
                {"source": "mock_data.txt", "content": "This is a mock content needed for testing."}
            ]
        }

<<<<<<< HEAD
def initialize_rag_chain():
    """
    API Key Check -> Mock Mode or Real Mode
=======

def initialize_rag_chain():
    """
    API Key Check -> Mock Mode or Real Mode 시스템 초기화
>>>>>>> b0ab98293bedc6ec51b2aff874dc0d691bf6e534
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("\n" + "="*50)
        print("⛔ OPENAI_API_KEY not found in .env")
        print("✅ Switching to MOCK MODE (No external connection)")
        print("="*50 + "\n")
        return MockChatService()

    # --- Real RAG Initialization (Only if Key exists) ---
    print("🔑 API Key found. Initializing Real RAG System...")
    
    embeddings = OpenAIEmbeddings(model=EMBEDDING_MODEL)
<<<<<<< HEAD
    llm = ChatOpenAI(model_name=LLM_MODEL, temperature=0) # <--- Moved Here (Global in function)
    
    # --- 1. Basic LLM Chain (Pure GPT) ---

    template = """
    당신은 '보이스피싱/스미싱 예방 안내 AI'입니다.
    아래의 [공식 가이드라인]을 근거로 사용자의 질문에 답변하세요.
    
    [Context]
    {context}

    [User Question]
    {question}

    [Answer]
    """
    # --- 1. Basic LLM Chain (Pure GPT) ---
    # RAG 없이 그냥 대화하는 모드 (비교 테스트용)
=======
    llm = ChatOpenAI(model_name=LLM_MODEL, temperature=0)
    
    # 1. Basic LLM Chain (RAG 없이 대화하는 모드)
>>>>>>> b0ab98293bedc6ec51b2aff874dc0d691bf6e534
    basic_template = """
    당신은 '보이스피싱/스미싱 예방 안내 AI'입니다.
    사용자의 질문에 대해 당신이 가진 지식을 바탕으로 친절하게 답변하세요.
    단, 답변 끝에 "정확한 정보는 반드시 공식 가이드라인을 확인하세요."라고 덧붙여주세요.

    [User Question]
    {question}
    """
    basic_prompt = ChatPromptTemplate.from_template(basic_template)
    basic_chain = (
        {"question": RunnablePassthrough()}
        | basic_prompt
        | llm
        | StrOutputParser()
    )

<<<<<<< HEAD
    # --- 2. RAG Chain (With Chroma) ---
=======
    # 2. RAG Chain (Chroma DB 연동)
>>>>>>> b0ab98293bedc6ec51b2aff874dc0d691bf6e534
    rag_chain = None
    retriever = None

    if os.path.exists(DB_PATH):
        print("📁 DB found. Initializing RAG components...")
        vectorstore = Chroma(
            persist_directory=DB_PATH,
            embedding_function=embeddings,
            collection_name="phishing_guidelines"
        )
        retriever = vectorstore.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 3}
        )

        rag_template = """
        당신은 '보이스피싱/스미싱 예방 안내 AI'입니다.
        아래의 [공식 가이드라인]을 근거로 사용자의 질문에 답변하세요.
        
        [Context]
        {context}

        [User Question]
        {question}

        [Answer]
        근거가 부족하면 솔직하게 모른다고 답하고 112/118 신고를 안내하세요.
        """
        rag_prompt = ChatPromptTemplate.from_template(rag_template)
        
        def format_docs(docs):
            return "\n\n".join(f"[출처: {d.metadata.get('source', 'Unknown')}] {d.page_content}" for d in docs)

        rag_chain = (
            {"context": retriever | format_docs, "question": RunnablePassthrough()}
            | rag_prompt
            | llm
            | StrOutputParser()
        )
    else:
        print("⚠️ No DB found. RAG mode will be disabled.")

    return {
        "basic_chain": basic_chain,
        "rag_chain": rag_chain,
        "retriever": retriever
    }

<<<<<<< HEAD
import openai # 추가

# ... (omitted)

def get_answer(rag_system, message: str, use_rag: bool = True):
    """
    RAG 응답 생성 (에러 핸들링 추가)
=======

def get_answer(rag_system, message: str, use_rag: bool = True):
    """
    RAG 응답 생성 (에러 핸들링 포함)
>>>>>>> b0ab98293bedc6ec51b2aff874dc0d691bf6e534
    """
    # 1. Mock Mode Check
    if isinstance(rag_system, MockChatService):
        return rag_system.get_answer(message)

    # 2. Decide Mode
    chain = rag_system.get("rag_chain")
    retriever = rag_system.get("retriever")

    if use_rag and not chain:
        print("[Info] RAG requested but DB not ready. Falling back to Basic LLM.")
        use_rag = False

    try:
        if use_rag and chain:
<<<<<<< HEAD
            # RAG Mode
=======
            # RAG Mode 실행
>>>>>>> b0ab98293bedc6ec51b2aff874dc0d691bf6e534
            print(f"[Mode] RAG (Searching DB for: {message[:20]}...)")
            answer = chain.invoke(message)
            docs = retriever.invoke(message)
            sources = [
                {"content": d.page_content[:100] + "...", "source": d.metadata.get("source")} 
                for d in docs
            ]
            return {"answer": answer, "context": sources, "mode": "RAG"}
        else:
<<<<<<< HEAD
            # Pure LLM Mode
=======
            # Pure LLM Mode 실행
>>>>>>> b0ab98293bedc6ec51b2aff874dc0d691bf6e534
            print("[Mode] Pure LLM (No DB Search)")
            answer = rag_system["basic_chain"].invoke(message)
            return {"answer": answer, "context": [], "mode": "Pure-LLM"}

    except openai.RateLimitError:
        print("❌ OpenAI Quota Exceeded")
        return {
            "answer": "⚠️ 죄송합니다. 현재 OpenAI API 사용 한도(예산)가 초과되어 응답할 수 없습니다. (Billing 확인 필요)",
            "context": [],
            "mode": "Error-Quota"
        }
    except Exception as e:
        print(f"❌ Error during generation: {e}")
        return {
            "answer": f"⚠️ 에러가 발생했습니다: {str(e)}",
            "context": [],
            "mode": "Error"
        }
<<<<<<< HEAD
=======


# ============================================================
# 3. 테스트 및 실행 구역 (직접 실행 시에만)
# ============================================================

if __name__ == "__main__":
    # .env 로드 (테스트용)
    from dotenv import load_dotenv
    load_dotenv()
    
    # 시스템 초기화
    rag_system = initialize_rag_chain()
    
    # 테스트 질문
    test_q = "모르는 번호로 택배 문자가 왔는데 링크를 눌러도 돼?"
    print(f"\nQ: {test_q}")
    
    res = get_answer(rag_system, test_q)
    print(f"A: {res['answer']}")
    print("-" * 50)
>>>>>>> b0ab98293bedc6ec51b2aff874dc0d691bf6e534
