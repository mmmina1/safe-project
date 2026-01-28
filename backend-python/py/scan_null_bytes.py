import os

def scan_for_null_bytes(directory):
    print(f"Scanning {directory} for null bytes...")
    corrupted_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".py"):
                path = os.path.join(root, file)
                try:
                    with open(path, "rb") as f:
                        content = f.read()
                        if b'\x00' in content:
                            print(f"❌ CORRUPTED (Null bytes found): {path}")
                            corrupted_files.append(path)
                        else:
                            # Verify if it's text readable
                            try:
                                content.decode('utf-8')
                                print(f"✅ OK: {path}")
                            except UnicodeDecodeError:
                                print(f"⚠️ Non-UTF-8: {path}")
                except Exception as e:
                    print(f"Error reading {path}: {e}")
    
    if corrupted_files:
        print("\nSummary: Found corrupted files:")
        for f in corrupted_files:
            print(f"- {f}")
    else:
        print("\n✅ No corrupted files found.")

if __name__ == "__main__":
    scan_for_null_bytes("backend")
