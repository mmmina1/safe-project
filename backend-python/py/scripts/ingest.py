import os
import glob
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from dotenv import load_dotenv

# 설정 (절대 경로로 통합)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
DB_PATH = os.path.join(BASE_DIR, "backend", "chroma_db")
EMBEDDING_MODEL = "text-embedding-3-small"

# .env 파일 로드 (backend 폴더의 .env 파일을 절대 경로로 지정)
load_dotenv(os.path.join(BASE_DIR, "backend", ".env"))

def ingest_data():
    print(f"Loading data from {DATA_DIR}...")
    
    # 1. 데이터 로드 (모든 .txt 파일 읽기)
    documents = []
    # 데이터 폴더가 없으면 생성 안내
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
        print(f"Created {DATA_DIR}. Please put your .txt guideline files there.")
        return

    files = glob.glob(os.path.join(DATA_DIR, "*.txt"))
    if not files:
        print("No .txt files found in ./data folder.")
        print("Please add files like 'police_guide.txt' or 'kisa_manual.txt'.")
        return

    for file_path in files:
        try:
            loader = TextLoader(file_path, encoding='utf-8')
            docs = loader.load()
            # 파일명을 메타데이터 source로 저장
            for doc in docs:
                doc.metadata["source"] = os.path.basename(file_path)
            documents.extend(docs)
            print(f"Loaded: {file_path}")
        except Exception as e:
            print(f"Error loading {file_path}: {e}")

    # 2. 텍스트 분할 (Chunking)
    # 가이드라인은 문단 단위로 의미가 있으므로 적절히 자릅니다.
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        separators=["\n\n", "\n", " ", ""]
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Split into {len(chunks)} chunks.")

    # 3. 임베딩 및 저장
    print("Embedding and storing in ChromaDB...")
    embeddings = OpenAIEmbeddings(model=EMBEDDING_MODEL)
    
    # DB 생성 및 저장
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=DB_PATH,
        collection_name="phishing_guidelines"
    )
    
    # persist()는 최신 버전에서는 자동 저장되지만 명시적으로 호출 가능
    # vectorstore.persist() 
    print(f"Successfully saved to {DB_PATH}")

if __name__ == "__main__":
    # 이 블록은 '데이터 관리 도구(Ingest)'를 실행하는 진입점입니다.
    # 새로운 가이드라인 파일이 추가되었을 때 수동으로 실행합니다.
    print("\n" + "="*50)
    print("🧹 [Maintenance] Running Data Ingestion Tool...")
    print("="*50)
    ingest_data()
    print("="*50 + "\n")
