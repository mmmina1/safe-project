import os
import glob
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from dotenv import load_dotenv

# 설정
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
DB_PATH = os.path.join(BASE_DIR, "backend", "chroma_db")
EMBEDDING_MODEL = "text-embedding-3-small"

# 폴더명과 벡터 DB 컬렉션명 매핑
CATEGORY_MAPPING = {
    "chat": "phishing_guidelines",
    "simulation": "simulation_scenarios",
    "diagnosis": "diagnosis_patterns"
}

load_dotenv(os.path.join(BASE_DIR, "backend", ".env"))

def ingest_category(category_name, collection_name):
    category_path = os.path.join(DATA_DIR, category_name)
    if not os.path.exists(category_path):
        return

    print(f"📦 Processing category: {category_name} -> Collection: {collection_name}")
    
    files = glob.glob(os.path.join(category_path, "*.txt"))
    if not files:
        print(f"   - No .txt files in {category_name}")
        return

    documents = []
    for file_path in files:
        try:
            loader = TextLoader(file_path, encoding='utf-8')
            docs = loader.load()
            for doc in docs:
                doc.metadata["source"] = os.path.basename(file_path)
            documents.extend(docs)
            print(f"   - Loaded: {os.path.basename(file_path)}")
        except Exception as e:
            print(f"   - Error loading {file_path}: {e}")

    if not documents:
        return

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        separators=["\n\n", "\n", " ", ""]
    )
    chunks = text_splitter.split_documents(documents)
    
    embeddings = OpenAIEmbeddings(model=EMBEDDING_MODEL)
    
    # 해당 컬렉션에 저장
    Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=DB_PATH,
        collection_name=collection_name
    )
    print(f"   ✅ Successfully saved {len(chunks)} chunks to {collection_name}")

def main():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
        print(f"Created {DATA_DIR}. Please add subfolders (chat, simulation, diagnosis).")
        return

    for folder_name, collection_name in CATEGORY_MAPPING.items():
        ingest_category(folder_name, collection_name)

if __name__ == "__main__":
    print("\n" + "="*50)
    print("🧹 [Maintenance] Running Multi-Category Data Ingestion Tool...")
    print("="*50)
    main()
    print("="*50 + "\n")
