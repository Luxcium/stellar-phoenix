# Custom Markdownlint Rules

A collection of custom rules extending markdownlint's capabilities with robust validation features. These rules enhance document quality by enforcing project-specific standards and best practices for Markdown formatting.

## heading-content-required

A specialized rule that ensures every heading has meaningful content, preventing empty or insufficiently documented sections. The rule intelligently handles special cases like code examples and documentation snippets while enforcing consistent content standards.

### Configuration Options

Configuration options allow customizing content validation behavior:

```json
{
  "heading-content-required": {
    "allowComments": false,
    "allowLists": true,
    "allowCodeBlocks": true
  }
}
```

- `allowComments` (default: `false`): When true, HTML comments count as valid content
- `allowLists` (default: `true`): When true, lists count as valid content
- `allowCodeBlocks` (default: `true`): When true, code blocks count as valid content

### Special Handling

Advanced features support documentation best practices:

- Intelligent detection of example sections
- Proper handling of nested code blocks
- Markdown code fence detection
- Example content exclusion

### Examples

The following examples illustrate proper and improper heading usage:

#### Invalid (by default)

The following pattern violates the rule:

<!-- markdownlint-disable heading-content-required -->
```markdown
# Heading 1
<!-- Just a comment -->
## Heading 2
```
<!-- markdownlint-enable heading-content-required -->

#### Valid

These patterns satisfy the rule requirements:

<!-- markdownlint-disable heading-content-required -->
```markdown
# Heading 1
This is proper content.

## Heading 2
- List items are valid content by default

### Heading 3
\`\`\`js
// Code blocks are valid content by default
\`\`\`
```
<!-- markdownlint-enable heading-content-required -->
