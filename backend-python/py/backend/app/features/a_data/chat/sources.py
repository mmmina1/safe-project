import os
import openai
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from app.features.a_domain.chat.entities import ChatResult, ChatSource

# 실제 AI 모델과 벡터 DB(ChromaDB)를 연동하는 데이터 소스 전담 클래스
class LLMChatSource:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        # /backend/chroma_db 경로 설정
        self.db_path = os.path.join(self.base_dir, "..", "..", "..", "..", "chroma_db")
        self.db_path = os.path.abspath(self.db_path)
        
        self.embedding_model = "text-embedding-3-small"
        self.llm_model = "gpt-4o"
        self.rag_system = self._initialize_system()

    def _initialize_system(self):
        """AI 체인 및 RAG 시스템 초기화 로직"""
        if not self.api_key:
            return None # Mock 모드는 레포지토리에서 처리
        
        embeddings = OpenAIEmbeddings(model=self.embedding_model)
        llm = ChatOpenAI(model_name=self.llm_model, temperature=0)

        # 1. 문서 검색 없이 답변하는 기본 프롬프트
        basic_template = """
        당신은 '보이스피싱/스미싱 예방 안내 AI'입니다.
        사용자의 질문에 대해 당신이 가진 지식을 바탕으로 친절하게 답변하세요.
        단, 답변 끝에 "정확한 정보는 반드시 공식 가이드라인을 확인하세요."라고 덧붙여주세요.

        [User Question]
        {question}
        """
        basic_prompt = ChatPromptTemplate.from_template(basic_template)
        basic_chain = ({"question": RunnablePassthrough()} | basic_prompt | llm | StrOutputParser())

        # 2. RAG (공식 가이드라인 검색 기반) 프롬프트
        rag_chain = None
        retriever = None
        if os.path.exists(self.db_path):
            vectorstore = Chroma(
                persist_directory=self.db_path,
                embedding_function=embeddings,
                collection_name="phishing_guidelines"
            )
            retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 3})
            
            rag_template = """
            당신은 '보이스피싱/스미싱 예방 안내 AI'입니다. 아래의 [공식 가이드라인]을 근거로 답변하세요.
            [Context]
            {context}
            [User Question]
            {question}
            [Answer]
            """
            rag_prompt = ChatPromptTemplate.from_template(rag_template)
            def format_docs(docs):
                return "\n\n".join(f"[출처: {d.metadata.get('source', 'Unknown')}] {d.page_content}" for d in docs)
            
            rag_chain = ({"context": retriever | format_docs, "question": RunnablePassthrough()} | rag_prompt | llm | StrOutputParser())

        return {
            "basic_chain": basic_chain,
            "rag_chain": rag_chain,
            "retriever": retriever
        }

    def get_response(self, message: str, use_rag: bool) -> ChatResult:
        """실제 AI 질문을 던지고 결과를 정제해서 반환하는 핵심 함수"""
        if not self.rag_system:
            return ChatResult(
                answer=f"[MockBot] API 키가 없습니다. 입력 내용: {message}",
                sources=[ChatSource(content="Mock Source", source="mock.txt")],
                mode="MOCK"
            )

        try:
            # RAG 사용 여부에 따라 적절한 체인 선택
            chain = self.rag_system["rag_chain"] if use_rag and self.rag_system["rag_chain"] else self.rag_system["basic_chain"]
            mode = "RAG" if use_rag and self.rag_system["rag_chain"] else "Pure-LLM"
            
            answer = chain.invoke(message)
            sources = []
            if mode == "RAG":
                docs = self.rag_system["retriever"].invoke(message)
                sources = [ChatSource(content=d.page_content[:100], source=d.metadata.get("source")) for d in docs]
            
            return ChatResult(answer=answer, sources=sources, mode=mode)
        except openai.RateLimitError:
            return ChatResult(answer="⚠️ OpenAI 할당량 초과", sources=[], mode="Error-Quota")
        except Exception as e:
            return ChatResult(answer=f"⚠️ 에러: {str(e)}", sources=[], mode="Error")

chat_source = LLMChatSource()

