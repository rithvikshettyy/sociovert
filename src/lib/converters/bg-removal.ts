import { execSync } from 'child_process';
import { ensureTempDir, generateFileId, getTempPath } from '../file-utils';

/**
 * Removes the background of an image using the 'rembg' Python library.
 * Outputs a transparent PNG.
 */
export async function removeBackground(
  inputPath: string
): Promise<{ filePath: string; fileId: string }> {
  await ensureTempDir();
  const fileId = generateFileId();
  const outputPath = getTempPath(fileId, 'png');

  try {
    // Determine command to execute rembg
    let cmd = `rembg i "${inputPath}" "${outputPath}"`;
    
    try {
      execSync('rembg --version', { stdio: 'ignore' });
    } catch {
      // Fallback to running as a python module if CLI binary is not in PATH
      cmd = `python -m rembg i "${inputPath}" "${outputPath}"`;
    }

    execSync(cmd, { timeout: 180000, stdio: 'pipe' });
  } catch (error) {
    console.error('Background removal error:', error);
    throw new Error(
      'Background removal failed. Make sure python and the "rembg" package are installed. Run "pip install rembg" on your system.'
    );
  }

  return { filePath: outputPath, fileId };
}
