export interface ParsedDescription {
  preamble: string;
  hasTechnicalDetails: boolean;
  sections: { title: string; content: string }[];
}

export function parseDescription(markdown: string): ParsedDescription {
  const lines = markdown.trim().split('\n');
  const sections: { title: string; content: string }[] = [];
  let preamble = '';
  let hasTechnicalDetails = false;
  let currentSection: { title: string; content: string } | null = null;
  let inPreamble = true;

  for (const line of lines) {
    // Check if line is an H2 header (## Title)
    const h2Match = line.match(/^##\s+(.+)$/);
    // Check if line is "Technical details:" (case insensitive)
    const technicalDetailsMatch = line.match(/^Technical details:?\s*$/i);

    if (technicalDetailsMatch && inPreamble) {
      hasTechnicalDetails = true;
      inPreamble = false;
      continue;
    }

    if (h2Match) {
      inPreamble = false;
      // Save previous section if it has content
      if (currentSection && (currentSection.content.trim() || currentSection.title)) {
        sections.push({
          title: currentSection.title,
          content: currentSection.content.trim(),
        });
      }
      // Start new section
      currentSection = {
        title: h2Match[1].trim(),
        content: '',
      };
    } else if (inPreamble) {
      preamble += line + '\n';
    } else if (currentSection) {
      currentSection.content += line + '\n';
    }
  }

  // Add the last section
  if (currentSection && (currentSection.content.trim() || currentSection.title)) {
    sections.push({
      title: currentSection.title,
      content: currentSection.content.trim(),
    });
  }

  return {
    preamble: preamble.trim(),
    hasTechnicalDetails,
    sections,
  };
}
