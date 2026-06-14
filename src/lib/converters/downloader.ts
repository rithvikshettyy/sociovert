import { execSync } from 'child_process';
import { join } from 'path';
import { TEMP_DIR } from '../constants';
import { generateFileId, ensureTempDir } from '../file-utils';
import { readdir } from 'fs/promises';

/**
 * Downloads media from YouTube, Reels, TikTok, and Shorts using yt-dlp.
 */
export async function downloadMedia(
  url: string,
  format: 'mp4' | 'mp3'
): Promise<{ filePath: string; fileId: string; title: string; ext: string }> {
  await ensureTempDir();
  const fileId = generateFileId();

  // 1. Get video title
  let title = 'download';
  try {
    title = execSync(`yt-dlp --get-title --no-playlist "${url}"`, {
      timeout: 15000,
      encoding: 'utf-8',
    }).trim();
    // Sanitize title to make it safe for file systems
    title = title.replace(/[^a-zA-Z0-9-_ ]/g, '_').substring(0, 100);
  } catch (err) {
    console.warn('Failed to fetch video title:', err);
  }

  // 2. Download media using yt-dlp
  const outputTemplate = join(TEMP_DIR, `${fileId}.%(ext)s`);

  let command = '';
  if (format === 'mp3') {
    command = `yt-dlp -x --audio-format mp3 --audio-quality 0 --no-playlist -o "${outputTemplate}" "${url}"`;
  } else {
    // Force MP4 output and merge format
    command = `yt-dlp -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" --recode-video mp4 --no-playlist -o "${outputTemplate}" "${url}"`;
  }

  try {
    execSync(command, { timeout: 180000, stdio: 'pipe' });
  } catch (error) {
    console.error('yt-dlp error:', error);
    throw new Error('Failed to download media. Please make sure the URL is correct and valid.');
  }

  // 3. Find the downloaded file
  const files = await readdir(TEMP_DIR);
  const matchedFile = files.find((f) => f.startsWith(fileId));

  if (!matchedFile) {
    throw new Error('Downloaded file not found on disk');
  }

  const ext = matchedFile.split('.').pop() || format;
  const filePath = join(TEMP_DIR, matchedFile);

  return {
    filePath,
    fileId,
    title,
    ext,
  };
}
