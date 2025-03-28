# Markdown Heading Content Rule Troubleshooting

A comprehensive troubleshooting guide designed to help users identify, understand, and resolve violations of the heading content rule in Markdown documents. The guide provides practical examples and solutions for maintaining well-structured documentation.

## Common Issues and Solutions

Let's explore common issues encountered with the heading content rule and their corresponding solutions with practical examples:

### HTML Comments After Headings

When working with HTML comments in Markdown, it's important to understand that comments alone don't satisfy the content requirement. Here's an invalid example:

<!-- markdownlint-disable heading-content-required -->
```markdown
# Heading
<!-- This is not valid content by default -->
```
<!-- markdownlint-enable heading-content-required -->

Solution: Add descriptive text between the heading and comment:

<!-- markdownlint-disable heading-content-required -->
```markdown
# Heading
This section covers important topics.
<!-- Additional notes can go here -->
```
<!-- markdownlint-enable heading-content-required -->

### Multiple Consecutive Headings

A common structural issue occurs when headings are used without intervening content. Here's what to avoid:

<!-- markdownlint-disable heading-content-required -->
```markdown
# Main Title
## Subsection
### Sub-subsection
```
<!-- markdownlint-enable heading-content-required -->

Solution: Add meaningful content between headings:

<!-- markdownlint-disable heading-content-required -->
```markdown
# Main Title
This is the main section of the document.

## Subsection
This subsection covers specific details.

### Sub-subsection
Here are the granular details.
```
<!-- markdownlint-enable heading-content-required -->

### Lists or Code Blocks Without Context

Adding lists or code blocks directly after headings without introduction creates readability issues. This is incorrect:

<!-- markdownlint-disable heading-content-required -->
```markdown
# Section
- Item 1
- Item 2
```
<!-- markdownlint-enable heading-content-required -->

Solution: Add introductory text:

<!-- markdownlint-disable heading-content-required -->
```markdown
# Section
The following items represent key points:
- Item 1
- Item 2
```
<!-- markdownlint-enable heading-content-required -->

## Automated Fixes

Several automated tools and methods are available to help maintain heading content compliance throughout your documentation:

1. Run `npm run fix:headings` to automatically add placeholder content
2. Use VS Code's "Quick Fix" feature (Ctrl+. or Cmd+.) when hovering over violations
3. Configure rule options in `.markdownlint.json` if needed:

```json
{
  "heading-content-required": {
    "allowComments": true,
    "allowLists": true,
    "allowCodeBlocks": true
  }
}
```

## Best Practices

Following these proven documentation practices will help you maintain high-quality, compliant Markdown documents:

1. Write section introductions before adding sub-headings
2. Ensure each heading represents a meaningful content division
3. Use the appropriate heading level for document hierarchy
4. Include descriptive content that explains the section's purpose
