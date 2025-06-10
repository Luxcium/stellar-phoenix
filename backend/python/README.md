# Stellar Phoenix Python Services

This directory contains the Python backend services for the Stellar Phoenix project.

## Development Setup

1. Create and activate virtual environment:

   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Install package in development mode:
   ```bash
   pip install -e ".[dev]"
   ```

## Running Tests

Run tests with coverage:

```bash
pytest --cov=src --cov-report=html
```

Coverage report will be available in `htmlcov/` directory.

## Code Style

This project uses:

- Black for code formatting
- Flake8 for code linting
- MyPy for type checking
- isort for import sorting

Format code:

```bash
black src tests
isort src tests
```

Check code:

```bash
flake8 src tests
mypy src tests
```
