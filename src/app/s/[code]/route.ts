import { NextRequest, NextResponse } from 'next/server';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

const LINKS_FILE_PATH = join(process.cwd(), 'src', 'data', 'links.json');

interface LinkMapping {
  shortCode: string;
  longUrl: string;
  createdAt: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code;

  if (!code) {
    return NextResponse.redirect(new URL('/', req.nextUrl.origin));
  }

  if (existsSync(LINKS_FILE_PATH)) {
    try {
      const fileData = await readFile(LINKS_FILE_PATH, 'utf-8');
      const links: LinkMapping[] = JSON.parse(fileData);
      
      const mapping = links.find((l) => l.shortCode.toLowerCase() === code.toLowerCase());
      if (mapping) {
        return NextResponse.redirect(new URL(mapping.longUrl));
      }
    } catch (error) {
      console.error('Error reading short links database:', error);
    }
  }

  // Fallback to home page if code is not found
  return NextResponse.redirect(new URL('/', req.nextUrl.origin));
}
