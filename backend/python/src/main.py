import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def main():
    """
    Main entry point for the Python service.
    """
    print("🐍 Python service started")
    
    # Example environment variable check
    debug = os.getenv("DEBUG", "false").lower() == "true"
    if debug:
        print("Debug mode enabled")

if __name__ == "__main__":
    main()
