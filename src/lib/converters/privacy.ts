import { execSync } from 'child_process';
import { ensureTempDir, generateFileId, getTempPath } from '../file-utils';

/**
 * Irreversibly purges EXIF metadata from images and documents using exiftool.
 */
export async function purgeExif(
  inputPath: string
): Promise<{ filePath: string; fileId: string }> {
  await ensureTempDir();
  const fileId = generateFileId();
  const ext = inputPath.split('.').pop()?.toLowerCase() || 'jpg';
  const outputPath = getTempPath(fileId, ext);

  try {
    // exiftool -all= writes clean version to output path without editing original
    execSync(`exiftool -all= -o "${outputPath}" "${inputPath}"`, {
      timeout: 60000,
      stdio: 'pipe',
    });
  } catch (error) {
    console.error('Exiftool error:', error);
    throw new Error('Metadata purging failed. Make sure exiftool is installed on the host.');
  }

  return { filePath: outputPath, fileId };
}
