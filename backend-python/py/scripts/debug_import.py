import sys
import os
import traceback

# Setup paths
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))

print("Attempting to import app...")
try:
    from backend.main import app
    print("Import Success!")
except Exception:
    traceback.print_exc()
except SystemExit as e:
    print(f"SystemExit: {e}")
