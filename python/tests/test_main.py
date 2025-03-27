from src.main import main
import pytest

def test_main(capsys):
    """Test that the main function runs without error and outputs expected message."""
    main()
    captured = capsys.readouterr()
    assert "Python service started" in captured.out

def test_debug_mode(monkeypatch, capsys):
    """Test debug mode behavior with environment variable."""
    # Set DEBUG environment variable
    monkeypatch.setenv("DEBUG", "true")
    
    main()
    captured = capsys.readouterr()
    assert "Debug mode enabled" in captured.out
