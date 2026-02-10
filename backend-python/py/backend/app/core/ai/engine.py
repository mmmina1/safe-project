import os
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from app.core.ai.config import AI_CONFIG, EMBEDDING_MODEL, LLM_MODEL, DATABASE_PATH

class AIEngine:
    def __init__(self, feature_name: str, collection_name: str = None):
        self.config = AI_CONFIG.get(feature_name)
        if not self.config:
            raise ValueError(f"Unknown feature: {feature_name}")
            
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.embeddings = OpenAIEmbeddings(model=EMBEDDING_MODEL)
        self.llm = ChatOpenAI(model_name=LLM_MODEL, temperature=0.5)
        
        self.db_path = DATABASE_PATH
        self.collection_name = collection_name or self.config.get("collection_name")
        
        # 시스템 빌드
        self.chains = self._initialize_chains()

    def _initialize_chains(self):
        if not self.api_key:
            return None

        # 1. 기본 체인 (Pure LLM)
        basic_prompt = ChatPromptTemplate.from_template(self.config["basic_prompt"])
        basic_chain = ({"question": RunnablePassthrough()} | basic_prompt | self.llm | StrOutputParser())

        # 2. RAG 체인 (Vector DB 기반)
        rag_chain = None
        retriever = None
        
        if os.path.exists(self.db_path):
            try:
                vectorstore = Chroma(
                    persist_directory=self.db_path,
                    embedding_function=self.embeddings,
                    collection_name=self.collection_name
                )
                # 실제 데이터가 있는지 확인 (검색 시도)
                retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 3})
                
                rag_prompt = ChatPromptTemplate.from_template(self.config["system_prompt"])
                
                def format_docs(docs):
                    if not docs: return "관련 정보를 찾을 수 없습니다."
                    return "\n\n".join(f"[출처: {d.metadata.get('source', 'Unknown')}] {d.page_content}" for d in docs)
                
                rag_chain = ({"context": retriever | format_docs, "question": RunnablePassthrough()} | rag_prompt | self.llm | StrOutputParser())
            except Exception as e:
                print(f"[AIEngine] RAG Init Error for {self.collection_name}: {e}")

        return {
            "basic": basic_chain,
            "rag": rag_chain,
            "retriever": retriever
        }

    def get_answer(self, message: str, use_rag: bool = True):
        if not self.chains:
            return "OpenAI API Key가 설정되지 않았습니다."

        try:
            # RAG 체인이 가능하고 사용 요청이 있을 때만 RAG 사용
            if use_rag and self.chains["rag"]:
                return self.chains["rag"].invoke(message)
            else:
                return self.chains["basic"].invoke(message)
        except Exception as e:
            return f"에러 발생: {str(e)}"

    def get_sources(self, message: str):
        """참조된 문서 목록 반환"""
        if self.chains and self.chains["retriever"]:
            return self.chains["retriever"].invoke(message)
        return []
