# Technical Context

## Technology Stack

1. Core Technologies

   - TypeScript 5.3+
   - Node.js 20+
   - Python 3.11+
   - pnpm for workspace management

2. Testing Technologies

   - JavaScript/TypeScript:
     - Jest with @jest/globals for type-safe testing
     - ts-jest for TypeScript support
     - Coverage reporting
   - Python:
     - pytest for testing
     - pytest-cov for coverage
     - pytest-asyncio for async testing
   - Common:
     - Pre-commit hooks via Husky
     - Unified coverage reporting
     - Cross-language test execution

3. Type Safety

   - TypeScript:
     - Strict mode enabled
     - Zod for runtime validation
     - Type documentation tools
   - Python:
     - Type hints required
     - mypy for static type checking
     - pydantic for validation

4. Code Quality

   - JavaScript/TypeScript:
     - ESLint flat configuration
     - Prettier formatting
     - @stylistic/eslint-plugin
   - Python:
     - black for formatting
     - flake8 for linting
     - isort for import sorting
   - Common:
     - EditorConfig
     - Git hooks
     - Coverage thresholds

5. Documentation Tools
   - TypeDoc for API docs
   - Markdown documentation
   - Mermaid for diagrams
   - Memory Bank system
   - [TSDoc](https://tsdoc.org/)
   - [TypeDoc](https://typedoc.org/)
   - [Cline Memory Bank](https://docs.cline.bot/improving-your-prompting-skills/custom-instructions-library/cline-memory-bank)

## Development Environment

### VSCode Configuration

The project includes a `.vscode` directory with standardized configuration:

- `settings.json`

  - Enforces consistent code formatting
  - Configures TypeScript settings
  - Sets up testing environment
  - Manages workspace settings

- `extensions.json`

  - Required Extensions:
    - dbaeumer.vscode-eslint: TypeScript/JavaScript linting
    - esbenp.prettier-vscode: Code formatting
    - orta.vscode-jest: Jest test integration
    - davidanson.vscode-markdownlint: Markdown linting
    - yzhang.markdown-all-in-one: Markdown support
    - streetsidesoftware.code-spell-checker: Spell checking
    - eamodio.gitlens: Git integration
    - ms-vsliveshare.vsliveshare: Live collaboration

- `launch.json`

  - Debug configurations for:
    - Current test file
    - All tests
    - TypeScript debugging

- `tasks.json`
  - Memory bank verification
  - Documentation generation
  - Test running
  - Build process
  - Full CI check

### Project Structure

```text
stellar-phoenix/
├── src/               # TypeScript source code
│   ├── types/           # Type definitions
│   ├── core/            # Core logic
│   └── utils/           # Utilities
├── python/            # Python services
│   ├── src/             # Python source code
│   └── tests/           # Python tests
├── scripts/           # Shell scripts
│   ├── dev-all.sh       # Development script
│   ├── build-all.sh     # Build script
│   └── test-all.sh      # Test script
├── docs/             # Documentation
│   ├── api/            # API documentation
│   └── examples/       # Usage examples
└── memory-bank/      # Project context
```

## Build Process

1. Development

   ```bash
   # Start all development servers
   ./scripts/dev-all.sh

   # Start specific components
   pnpm build:ts:watch  # TypeScript watch mode
   cd python && python src/main.py  # Python service
   ```

2. Testing

   ```bash
   # Run all tests
   ./scripts/test-all.sh

   # Component-specific tests
   pnpm test  # TypeScript tests
   cd python && pytest  # Python tests
   ```

3. Building

   ```bash
   # Build all components
   ./scripts/build-all.sh

   # Component-specific builds
   pnpm build  # TypeScript build
   cd python && python -m build  # Python package
   ```

4. Documentation

   ```bash
   # Generate all documentation
   pnpm docs

   # Run specific generators
   pnpm typedoc  # TypeScript API docs
   cd python && pdoc src  # Python API docs
   ```

## Deployment Process

1. Local Development

   - Clone repository
   - Install dependencies
   - Run development build
   - Start development server

2. Continuous Integration

   - Run automated tests
   - Check code quality
   - Generate documentation
   - Verify memory bank

3. Package Publishing
   - Version bump
   - Build package
   - Generate documentation
   - Publish to npm

## Testing Strategy

1. Unit Testing

   - Test-Driven Development (TDD) first approach
   - Jest with @jest/globals for type safety
   - Pre-commit test execution via Husky
   - TypeScript support with isolatedModules
   - Coverage reporting and enforcement

2. Type Testing

   - No usage of 'any' in test files
   - Custom type assertions with strict checking
   - Type compatibility verification
   - Generic type testing
   - Type inference validation

3. Documentation Testing

   - Example code verification
   - Memory Bank validation
   - API documentation checks
   - Markdown linting

4. Integration Testing
   - Component integration
   - Type system validation
   - Documentation verification
   - Tool chain testing

## Dependencies

### TypeScript Dependencies

- Production:

  - `typescript`: TypeScript compiler
  - `zod`: Runtime validation
  - `pnpm`: Package management

- Development:
  - `jest`: Testing framework
  - `ts-jest`: TypeScript testing
  - `eslint`: Code linting
  - `prettier`: Code formatting

### Python Dependencies

- Production:

  - `python-dotenv`: Environment variables
  - `pydantic`: Data validation
  - `aiofiles`: Async file operations

- Development:
  - `pytest`: Testing framework
  - `black`: Code formatting
  - `flake8`: Code linting
  - `mypy`: Type checking

## Configuration

1. TypeScript Configuration

   - Strict mode enabled
   - Source maps
   - Declaration files
   - Path aliases

2. ESLint Configuration

   - Flat configuration system (eslint.config.mjs)
   - TypeScript and Stylistic rules
   - Jest plugin integration
   - Prettier compatibility
   - Custom rules

3. Jest Configuration

   - TypeScript support
   - Coverage settings
   - Custom matchers
   - Test environment

4. VSCode Configuration
   - Editor settings
   - Extension recommendations
   - Debug configurations
   - Task definitions

## Technical Constraints

1. Language Constraints

   - TypeScript strict mode required
   - ESLint rules enforcement
   - Code formatting standards
   - Documentation requirements

2. Testing Constraints

   - Test-Driven Development (TDD) mandatory
   - Tests must be written before implementation
   - Pre-commit test execution required
   - No usage of 'any' in test files
   - Minimum coverage threshold
   - Required type tests
   - Documentation tests
   - Performance benchmarks

3. Documentation Constraints

   - Memory Bank updates
   - API documentation
   - Example code
   - Diagram standards

4. Development Constraints
   - VSCode as primary IDE
   - Git version control
   - npm package management
   - Node.js environment

## Version Control

1. Repository Structure

   - Source code
   - Tests
   - Documentation
   - Configuration

2. Branch Strategy

   - main: Stable releases
   - develop: Integration
   - feature/\*: Features
   - fix/\*: Bug fixes

3. Commit Standards
   - Conventional commits
   - Type-scoped changes
   - Detailed descriptions
   - Issue references

## Monitoring and Logging

1. Development Monitoring

   - TypeScript errors
   - Test failures
   - Linting issues
   - Coverage reports

2. Documentation Monitoring

   - Memory Bank status
   - API documentation
   - Example verification
   - Markdown validation

3. Build Monitoring
   - Compilation errors
   - Test results
   - Documentation generation
   - Package validation

## AI Integration

1. Test Generation

   - Update AI algorithms to better understand the project's testing patterns
   - Incorporate feedback loops to improve the generated tests over time

2. Documentation Generation
   - Enhance AI suggestions for documentation consistency
   - Ensure AI-generated documentation aligns with project patterns
   - [Cline AI Documentation](https://docs.cline.bot/)
   - [Cline GitHub](https://github.com/cline/cline)

---

This document should be updated when there are changes to the technology stack, development environment, or technical processes.
