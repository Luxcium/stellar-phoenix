# GitHub Copilot Custom Instructions

These instructions define the operational parameters and behavioral guidelines for GitHub Copilot when assisting with this project. They ensure consistent, high-quality, and contextually appropriate responses while maintaining project standards and best practices.

## General Guidelines

- Adapt outputs to respect the specific context of the current programming language or framework.
- Use precise, direct language to eliminate ambiguity.
- Interpret instructions while maintaining strict adherence to core principles.

## System Requirements

- Ensure compatibility with Fedora Linux and other Linux distributions.
- Follow standard filesystem hierarchy and respect system security contexts.
- Use standard configuration locations and leverage system service management.

## Package Management

- Use npm as the package manager for Node.js environments.
- Maintain package-lock.json for dependency versioning.
- Prefer LTS Node.js versions.
- Prioritize command-line tooling and perform regular security audits.

## Project Structure

- memory-bank/ contains all project documentation.
- src/ contains source code.
- tests/ contains test files.
- Maintain a modular structure without enforcing specific monorepo constraints.

## Documentation Patterns

- Reflect all changes in memory-bank/.
- Update activeContext.md with current work.
- Track completed and pending tasks in progress.md.
- Update systemPatterns.md with file structure changes.

## Version Control

- Use Git for version control.
- Write meaningful commit messages.
- Update documentation before committing code changes.
- Keep changes focused and atomic.

## Development Workflow

1. Check the Memory Bank for context.
2. Implement required changes.
3. Update the documentation.
4. Verify changes.
5. Commit updates.

## Project Preferences

- Use clear, descriptive names for files and directories.
- Maintain documentation alongside code changes.
- Adhere to the Memory Bank structure for consistency.
- Adopt a platform-agnostic approach, with Fedora Linux as the primary reference.
- Utilize npm as the package manager.

## Code Conventions

Establish and maintain consistent coding practices across all project components, ensuring readability, maintainability, and scalability of the codebase.

### JavaScript/TypeScript Standards

- Adopt strict TypeScript configuration.
- Use PascalCase for classes and types.
- Use camelCase for functions and variables.
- Prefer named exports over default exports.

### Shell Scripting Standards

- Use POSIX-compliant syntax.
- Include comprehensive comments.
- Avoid hardcoded paths when possible.

## Task Execution

- Prioritize command-line tools for project initialization, dependency management, and script execution.
- Minimize direct file manipulation.
- Maintain a non-destructive approach when handling existing resources.

## Modularity and Scalability

- Separate concerns into distinct modules.
- Implement clear, meaningful directory structures.
- Utilize dependency injection and modular design practices.
- Maintain clear architectural boundaries.

## Maintenance Guidelines

- Regularly assess and update documentation to reflect best practices.
- Implement incremental modifications that preserve valuable existing information.
- Maintain a clear hierarchical structure and use consistent markdown formatting.
- Evaluate the impact of changes and implement only high-value modifications after thorough consideration.

## Markdown Formatting Standards

- Adhere strictly to established linting rules as defined by markdownlint.
- Ensure every heading in a Markdown document is followed by one or more non-empty paragraphs.
- Provide descriptive, substantive content for each heading.
- Implement a review mechanism to ensure compliance with these rules.
- Automate corrections to enforce the rule that every heading must be followed by non-empty content.

## Summary of Approach

The approach combines strict adherence to project standards with intelligent adaptation to context, ensuring consistent high-quality output while maintaining flexibility where needed. This balance of structure and adaptability enables efficient development while preserving code quality and documentation standards.
