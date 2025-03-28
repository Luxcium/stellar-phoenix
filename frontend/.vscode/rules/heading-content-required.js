"use strict";

module.exports = {
  names: ["heading-content-required"],
  description: "Headings must be immediately followed by non-empty content (one or more paragraphs) before any subsequent heading.",
  tags: ["headings"],
  function: function MD099(params, onError) {
    // Get config from params
    const config = params.config || {};
    
    // Allow configuring what counts as content
    const allowComments = config.allowComments || false;
    const allowLists = config.allowLists !== false;
    const allowCodeBlocks = config.allowCodeBlocks !== false;
    
    const lines = params.lines;
    let codeBlockDepth = 0;
    let inExample = false;
    let parentHeadingType = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Look for headings that indicate example sections
      if (/^#{1,6}\s+(Invalid|Valid|Examples?)/.test(line)) {
        parentHeadingType = 'example';
        continue;
      }
      
      // Reset parent heading type when leaving an example section
      if (parentHeadingType === 'example' && /^#{1,6}\s+/.test(line) && !/^#{1,6}\s+(Invalid|Valid|Examples?)/.test(line)) {
        parentHeadingType = null;
      }
      
      // Track code block state
      if (line.startsWith('```')) {
        if (codeBlockDepth === 0 && line.toLowerCase().includes('markdown')) {
          inExample = parentHeadingType === 'example';
        }
        codeBlockDepth = codeBlockDepth === 0 ? 1 : 0;
        continue;
      }
      
      // Skip processing inside code blocks that are examples
      if (codeBlockDepth > 0 && (inExample || parentHeadingType === 'example')) {
        continue;
      }
      
      // Identify heading lines outside example blocks
      if (/^#{1,6}\s+\S/.test(line)) {
        let hasContent = false;
        let j = i + 1;
        let nestedCodeDepth = 0;
        
        while (j < lines.length) {
          const nextLine = lines[j].trim();
          
          // Track nested code blocks
          if (nextLine.startsWith('```')) {
            nestedCodeDepth = nestedCodeDepth === 0 ? 1 : 0;
            if (allowCodeBlocks && nestedCodeDepth > 0) {
              hasContent = true;
              break;
            }
            j++;
            continue;
          }
          
          // Skip content in nested code blocks that are examples
          if (nestedCodeDepth > 0 && (inExample || parentHeadingType === 'example')) {
            j++;
            continue;
          }
          
          // Stop if we hit another heading
          if (/^#{1,6}\s+/.test(nextLine) && nestedCodeDepth === 0) {
            break;
          }
          
          // Handle HTML comments
          if (/^<!--.*-->$/.test(nextLine)) {
            if (allowComments) {
              hasContent = true;
              break;
            }
            j++;
            continue;
          }
          
          // Handle lists
          if (allowLists && /^[-*+]|\d+\.\s/.test(nextLine)) {
            hasContent = true;
            break;
          }
          
          // Any non-blank line outside code/example blocks counts as content
          if (nextLine.length > 0 && !inExample) {
            hasContent = true;
            break;
          }
          
          j++;
        }
        
        // Only report errors for headings not in example sections
        if (!hasContent && !inExample && parentHeadingType !== 'example') {
          onError({
            lineNumber: i + 1,
            detail: "Heading must be followed by non-empty content (at least one paragraph) before another heading appears.",
            context: line
          });
        }
      }
    }
  }
}