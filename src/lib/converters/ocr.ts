import { ocrPdf } from './pdf';
import { readFile, writeFile } from 'fs/promises';
import { generateFileId, getTempPath, ensureTempDir } from '../file-utils';
import { unlink } from 'fs/promises';

/**
 * Runs OCR on images or PDFs and formats the output into clean, structured Markdown.
 */
export async function convertOcrToMarkdown(
  inputPath: string
): Promise<{ filePath: string; fileId: string }> {
  // Step 1: Run standard OCR using Tesseract to extract TXT
  const txtResult = await ocrPdf(inputPath, 'txt');

  // Step 2: Read the OCR output text
  const rawText = await readFile(txtResult.filePath, 'utf-8');

  // Step 3: Parse and format to clean Markdown
  const lines = rawText.split('\n');
  const markdownLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (line === '') {
      markdownLines.push('');
      continue;
    }

    // Detect headers (all caps or short lines with strong visual separation)
    const isHeading = line.length < 60 && 
                      (line === line.toUpperCase() && /[A-Z]/.test(line)) && 
                      !line.startsWith('-') && !line.startsWith('*');

    if (isHeading) {
      markdownLines.push(`## ${line}`);
      continue;
    }

    // Detect list items
    const listMatch = line.match(/^([•\*\-\+])\s*(.*)/);
    if (listMatch) {
      markdownLines.push(`- ${listMatch[2]}`);
      continue;
    }

    // Standard text paragraph line: handle line continuation
    if (i < lines.length - 1 && lines[i+1].trim() !== '') {
      // If next line is not empty and doesn't look like a new list/header, merge with space
      const nextLine = lines[i+1].trim();
      const nextLineIsSpecial = nextLine.startsWith('-') || nextLine.startsWith('*') || 
                               (nextLine.length < 60 && nextLine === nextLine.toUpperCase() && /[A-Z]/.test(nextLine));
      
      if (!nextLineIsSpecial) {
        line += ' ' + nextLine;
        i++; // skip next line in the loop
      }
    }

    markdownLines.push(line);
  }

  const cleanMarkdown = markdownLines.join('\n')
    .replace(/\n{3,}/g, '\n\n') // Remove excessive empty lines
    .trim();

  // Step 4: Save to a new .md file
  await ensureTempDir();
  const fileId = generateFileId();
  const outputPath = getTempPath(fileId, 'md');
  await writeFile(outputPath, cleanMarkdown, 'utf-8');

  // Cleanup the temp TXT file
  try {
    await unlink(txtResult.filePath);
  } catch {}

  return { filePath: outputPath, fileId };
}
