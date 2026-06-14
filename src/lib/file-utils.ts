import { mkdir, readdir, stat, unlink, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { TEMP_DIR, FILE_EXPIRY_MS } from './constants';

/**
 * Generate a unique file ID
 */
export function generateFileId(): string {
  return uuidv4();
}

/**
 * Get full path for a temp file
 */
export function getTempPath(fileId: string, ext: string): string {
  return join(TEMP_DIR, `${fileId}.${ext}`);
}

/**
 * Ensure the temp directory exists
 */
export async function ensureTempDir(): Promise<void> {
  if (!existsSync(TEMP_DIR)) {
    await mkdir(TEMP_DIR, { recursive: true });
  }
}

/**
 * Save an uploaded file to the temp directory.
 * Returns the file path and generated ID.
 */
export async function saveUploadedFile(
  file: File
): Promise<{ filePath: string; fileId: string; ext: string }> {
  await ensureTempDir();

  const fileId = generateFileId();
  const originalName = file.name || 'upload';
  const ext = originalName.split('.').pop()?.toLowerCase() || 'bin';
  const filePath = getTempPath(fileId, ext);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return { filePath, fileId, ext };
}

/**
 * Save a buffer to a temp file
 */
export async function saveTempBuffer(
  buffer: Buffer,
  ext: string
): Promise<{ filePath: string; fileId: string }> {
  await ensureTempDir();

  const fileId = generateFileId();
  const filePath = getTempPath(fileId, ext);
  await writeFile(filePath, buffer);

  return { filePath, fileId };
}

/**
 * Get file age in milliseconds
 */
export async function getFileAge(filePath: string): Promise<number> {
  const fileStat = await stat(filePath);
  return Date.now() - fileStat.mtimeMs;
}

/**
 * Clean up expired files (older than FILE_EXPIRY_MS)
 * Returns the number of files deleted.
 */
export async function cleanupExpiredFiles(): Promise<number> {
  if (!existsSync(TEMP_DIR)) return 0;

  const files = await readdir(TEMP_DIR);
  let deleted = 0;

  for (const file of files) {
    const filePath = join(TEMP_DIR, file);
    try {
      const age = await getFileAge(filePath);
      if (age > FILE_EXPIRY_MS) {
        await unlink(filePath);
        deleted++;
      }
    } catch {
      // File may have been deleted already, skip
    }
  }

  return deleted;
}

/**
 * Find a file by its ID (regardless of extension)
 */
export async function findFileById(
  fileId: string
): Promise<{ filePath: string; ext: string } | null> {
  if (!existsSync(TEMP_DIR)) return null;

  const files = await readdir(TEMP_DIR);
  const match = files.find((f) => f.startsWith(fileId));

  if (!match) return null;

  return {
    filePath: join(TEMP_DIR, match),
    ext: match.split('.').pop() || '',
  };
}

/**
 * Delete a file by path
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    await unlink(filePath);
  } catch {
    // Already deleted
  }
}
