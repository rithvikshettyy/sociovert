interface ToolSeoInfo {
  title: string;
  description: string;
  keywords: string[];
}

export const SEO_METADATA_REGISTRY: Record<string, ToolSeoInfo> = {
  // ── PDF Tools ──
  'pdf/merge': {
    title: 'Merge PDF Files Online Free - Combine PDF | AnyFormat',
    description: 'Combine multiple PDF files into a single document online. Free, secure, no registration or watermark. Best ILovePDF & SmallPDF alternative for merging PDFs.',
    keywords: ['merge pdf', 'combine pdf', 'join pdf files', 'free pdf merger', 'combine pdf online', 'ilovepdf merge alternative', 'smallpdf merge alternative', 'adobe acrobat merge pdf free'],
  },
  'pdf/split': {
    title: 'Split PDF Online Free - Extract PDF Pages | AnyFormat',
    description: 'Split PDF documents into separate pages or extract specific page ranges online. Free alternative to ILovePDF and Sejda PDF splitter.',
    keywords: ['split pdf', 'extract pdf pages', 'cut pdf file', 'free pdf splitter', 'split pdf online', 'ilovepdf split alternative', 'sejda split alternative'],
  },
  'pdf/compress': {
    title: 'Compress PDF Online Free - Reduce PDF File Size | AnyFormat',
    description: 'Reduce PDF file size online while maintaining quality. Free alternative to SmallPDF, ILovePDF, and PDF24 compressor. No watermarks.',
    keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf', 'free pdf compressor', 'compress pdf online', 'smallpdf compress alternative', 'ilovepdf compress alternative', 'pdf24 alternative'],
  },
  'pdf/pdf-to-word': {
    title: 'PDF to Word Converter Free Online - No Watermark | AnyFormat',
    description: 'Convert PDF to editable Word DOCX files free. No signup, no watermark. Better than SmallPDF and Zamzar for PDF to Word conversion.',
    keywords: ['pdf to word', 'pdf to docx', 'convert pdf to word', 'free pdf to word converter', 'pdf to editable word', 'smallpdf pdf to word alternative', 'zamzar alternative'],
  },
  'pdf/pdf-to-image': {
    title: 'Convert PDF to Image (JPG/PNG) Online Free | AnyFormat',
    description: 'Convert PDF pages to high-quality JPG or PNG images online. Free alternative to CloudConvert and PDF2Go for PDF to image conversion.',
    keywords: ['pdf to image', 'pdf to jpg', 'pdf to png', 'convert pdf to jpg', 'pdf extraction', 'cloudconvert pdf to jpg alternative', 'pdf2go alternative'],
  },
  'pdf/image-to-pdf': {
    title: 'Convert JPG/PNG Images to PDF Online Free | AnyFormat',
    description: 'Convert JPG, PNG, WebP images into a single PDF document. Free, no watermarks. Best ILovePDF and SmallPDF image-to-PDF alternative.',
    keywords: ['image to pdf', 'jpg to pdf', 'png to pdf', 'convert image to pdf', 'images to pdf', 'ilovepdf jpg to pdf alternative', 'smallpdf image to pdf alternative'],
  },
  'pdf/ocr': {
    title: 'Free OCR PDF Online - Extract Text from Scanned PDFs | AnyFormat',
    description: 'Extract editable text from scanned PDFs and images using OCR. Free alternative to Adobe Acrobat OCR, OnlineOCR, and Sejda.',
    keywords: ['ocr pdf', 'scanned pdf to text', 'extract text from pdf', 'free online ocr', 'image to text converter', 'adobe acrobat ocr alternative', 'sejda ocr alternative'],
  },
  'pdf/rotate': {
    title: 'Rotate PDF Pages Online Free - Turn PDF Pages | AnyFormat',
    description: 'Rotate PDF pages clockwise or counter-clockwise online. Free alternative to ILovePDF and SmallPDF rotate tools.',
    keywords: ['rotate pdf', 'turn pdf page', 'flip pdf online', 'free pdf rotater', 'rotate pdf pages', 'ilovepdf rotate alternative', 'smallpdf rotate alternative'],
  },
  'pdf/watermark': {
    title: 'Add Watermark to PDF Online Free | AnyFormat',
    description: 'Add text watermarks to PDF pages online. Customize position, color, and text. Free alternative to ILovePDF and PDFCandy watermark tools.',
    keywords: ['watermark pdf', 'add watermark to pdf', 'pdf watermark tool', 'protect pdf online', 'free pdf watermarker', 'ilovepdf watermark alternative', 'pdfcandy alternative'],
  },
  'pdf/pdf-to-excel': {
    title: 'PDF to Excel Converter Free Online - No Watermark | AnyFormat',
    description: 'Convert PDF tables to editable Excel XLSX spreadsheets. Free alternative to SmallPDF, Zamzar, and Adobe PDF to Excel converter.',
    keywords: ['pdf to excel', 'pdf to xlsx', 'convert pdf to excel', 'free pdf to excel converter', 'pdf to spreadsheet', 'smallpdf pdf to excel alternative', 'zamzar pdf to excel alternative'],
  },
  'pdf/ppt-to-pdf': {
    title: 'PowerPoint PPT to PDF Converter Free Online | AnyFormat',
    description: 'Convert PPT, PPTX, and ODP presentations to PDF. Free alternative to SmallPDF, CloudConvert, and Convertio PPT converter.',
    keywords: ['ppt to pdf', 'pptx to pdf', 'convert powerpoint to pdf', 'free ppt to pdf converter', 'convert presentation to pdf', 'cloudconvert ppt alternative', 'convertio ppt alternative'],
  },
  'pdf/protect': {
    title: 'Protect PDF Online Free - Encrypt PDF with Password | AnyFormat',
    description: 'Encrypt and password-protect PDF files online. Free alternative to Sejda, ILovePDF, and Adobe Acrobat PDF protection.',
    keywords: ['protect pdf', 'encrypt pdf', 'password protect pdf', 'pdf lock', 'secure pdf file online', 'sejda protect pdf alternative', 'ilovepdf protect alternative'],
  },

  // ── Image Tools ──
  'image/convert': {
    title: 'Convert Image Formats Online Free - JPG, PNG, WebP, AVIF | AnyFormat',
    description: 'Convert between JPG, PNG, WebP, AVIF, SVG, and GIF formats. Free alternative to CloudConvert, Convertio, and Online-Convert for image conversion.',
    keywords: ['image converter', 'convert image format', 'jpg to png', 'png to webp', 'avif converter', 'free image converter', 'cloudconvert image alternative', 'convertio image alternative', 'online-convert alternative'],
  },
  'image/compress': {
    title: 'Compress Image Online Free - Reduce Image Size | AnyFormat',
    description: 'Reduce image file sizes (JPG, PNG, WebP) with adjustable quality. Free alternative to TinyPNG, Compressor.io, and Squoosh.',
    keywords: ['compress image', 'reduce image size', 'optimize image', 'free image compressor', 'compress png', 'compress jpeg', 'tinypng alternative', 'compressor.io alternative', 'squoosh alternative'],
  },
  'image/resize': {
    title: 'Resize Image Online Free - Change Image Dimensions | AnyFormat',
    description: 'Resize images to exact pixel dimensions or percentage scaling. Free alternative to iLoveIMG and BeFunky image resizer.',
    keywords: ['resize image', 'image resizer', 'change image resolution', 'crop image online', 'free image scale', 'iloveimg alternative', 'befunky resize alternative'],
  },
  'image/exif-purge': {
    title: 'Deep EXIF Purger Online Free - Strip Image Metadata | AnyFormat',
    description: 'Remove EXIF, GPS location, camera data, and metadata from images and documents. Privacy-first alternative to ExifTool online and metadata2go.',
    keywords: ['exif purger', 'remove image metadata', 'strip gps from photo', 'remove exif data', 'metadata remover', 'exiftool online alternative', 'metadata2go alternative'],
  },
  'image/bg-removal': {
    title: 'Remove Image Background Online Free - AI Bg Remover | AnyFormat',
    description: 'Remove background from images automatically using AI. Free alternative to Remove.bg, Canva background remover, and PhotoRoom.',
    keywords: ['remove background', 'bg removal', 'transparent background', 'free bg remover', 'ai background removal', 'remove.bg alternative', 'canva bg remover alternative', 'photoroom alternative'],
  },
  'image/color-palette': {
    title: 'Color Palette Extractor Free - Extract Colors from Image | AnyFormat',
    description: 'Extract dominant color palettes and hex codes from any image. Free alternative to Coolors, Adobe Color, and Color Hunt palette tools.',
    keywords: ['color palette extractor', 'extract color from image', 'image color picker', 'get palette from photo', 'hex code finder', 'coolors alternative', 'adobe color alternative'],
  },
  'image/qr-generator': {
    title: 'QR Code Generator Free Online - Create Custom QRs | AnyFormat',
    description: 'Generate high-quality custom QR codes for URLs, text, Wi-Fi, and contacts. Free alternative to QR Code Monkey and QRCode Generator.',
    keywords: ['qr code generator', 'create qr code', 'free qr maker', 'custom qr code', 'qr generator online', 'qr code monkey alternative', 'qrcode generator alternative'],
  },

  // ── Document Tools ──
  'document/to-pdf': {
    title: 'Convert Word/Excel/PPT to PDF Online Free | AnyFormat',
    description: 'Convert Office documents (DOCX, XLSX, PPTX) to PDF. Free alternative to SmallPDF, Zamzar, and CloudConvert document converter.',
    keywords: ['document to pdf', 'docx to pdf', 'word to pdf', 'convert docx to pdf', 'xlsx to pdf', 'smallpdf word to pdf alternative', 'zamzar docx to pdf alternative', 'cloudconvert alternative'],
  },
  'document/from-pdf': {
    title: 'Convert PDF to Word/Excel/PPT Online Free | AnyFormat',
    description: 'Convert PDF back to Word, Excel, and PowerPoint. Free alternative to Adobe Acrobat, Convertio, and FreeConvert PDF converter.',
    keywords: ['pdf to docx', 'pdf to word', 'pdf to excel', 'pdf to powerpoint', 'convert pdf to document', 'adobe acrobat alternative', 'convertio pdf alternative', 'freeconvert alternative'],
  },
  'document/to-latex': {
    title: 'Convert DOCX/PDF to LaTeX Code Online Free | AnyFormat',
    description: 'Transform Word documents and PDFs into structured LaTeX code (.tex). Free alternative to Pandoc online and Mathpix.',
    keywords: ['convert to latex', 'word to latex', 'pdf to latex', 'docx to tex', 'latex converter online', 'pandoc alternative', 'mathpix alternative'],
  },
  'document/ocr-to-md': {
    title: 'Convert Scan/PDF to Markdown Online Free | AnyFormat',
    description: 'Extract text from scanned PDFs and images into structured Markdown. Free alternative to Marker, Nougat, and other PDF-to-Markdown tools.',
    keywords: ['ocr to markdown', 'pdf to markdown', 'image to markdown', 'extract text to md', 'scan to markdown', 'marker pdf alternative', 'pdf to md converter'],
  },
  'document/word-counter': {
    title: 'Word Counter Online Free - Count Words & Characters | AnyFormat',
    description: 'Count words, characters, lines, and paragraphs from text or files (PDF, DOCX, TXT). Free alternative to WordCounter.net and CharacterCountOnline.',
    keywords: ['word counter', 'character counter', 'count words in pdf', 'word count tool', 'reading time calculator', 'wordcounter.net alternative', 'character count online alternative'],
  },

  // ── Video Tools ──
  'video/convert': {
    title: 'Convert Video Formats Online Free - MP4, WebM, GIF | AnyFormat',
    description: 'Convert between MP4, WebM, MOV, AVI, and GIF formats. Free alternative to CloudConvert, Convertio, and FreeConvert video converter.',
    keywords: ['video converter', 'convert mp4 to webm', 'mov to mp4', 'video format changer', 'mp4 to gif', 'cloudconvert video alternative', 'convertio video alternative', 'freeconvert video alternative', 'handbrake alternative online'],
  },
  'video/compress': {
    title: 'Compress Video Online Free - Reduce Video Size | AnyFormat',
    description: 'Reduce video file size with customizable quality. Free alternative to HandBrake, Clideo, and FreeConvert video compressor.',
    keywords: ['compress video', 'reduce video size', 'shrink mp4', 'free video compressor', 'optimize video online', 'handbrake alternative', 'clideo compress alternative', 'freeconvert compress alternative'],
  },
  'video/extract-audio': {
    title: 'Extract Audio from Video Online Free - MP3/WAV | AnyFormat',
    description: 'Extract audio tracks from MP4, MOV, WebM into MP3, WAV, or FLAC. Free alternative to Online Audio Converter and Kapwing.',
    keywords: ['extract audio from video', 'video to mp3', 'mp4 to mp3', 'convert video to audio', 'audio extractor', 'online audio converter alternative', 'kapwing audio alternative'],
  },
  'video/social-download': {
    title: 'Social Video Downloader Free - Download Reels/TikToks | AnyFormat',
    description: 'Download videos from YouTube, Instagram Reels, TikTok, and Shorts. Free alternative to SaveFrom, SnapSave, and SSSTik downloader.',
    keywords: ['social downloader', 'download reels', 'tiktok downloader', 'youtube shorts downloader', 'download video online', 'savefrom alternative', 'snapsave alternative', 'ssstik alternative'],
  },

  // ── Audio Tools ──
  'audio/convert': {
    title: 'Convert Audio Formats Online Free - MP3, WAV, FLAC | AnyFormat',
    description: 'Convert between MP3, WAV, FLAC, AAC, OGG, and M4A audio files. Free alternative to Online Audio Converter, CloudConvert, and Zamzar.',
    keywords: ['audio converter', 'convert mp3 to wav', 'flac to mp3', 'wav to mp3', 'audio converter online', 'online audio converter alternative', 'cloudconvert audio alternative', 'zamzar audio alternative'],
  },

  // ── Archive Tools ──
  'archive/create': {
    title: 'Create ZIP/TAR Archive Online Free - Compress Files | AnyFormat',
    description: 'Compress files into ZIP or TAR archives online. Free alternative to ezyZip, Archive Extractor, and WinZip online.',
    keywords: ['create zip file', 'make zip online', 'compress files to zip', 'tar creator', 'free file archiver', 'ezyzip alternative', 'winzip online alternative'],
  },
  'archive/extract': {
    title: 'Extract ZIP/RAR/7Z Archives Online Free | AnyFormat',
    description: 'Extract files from ZIP, RAR, 7Z, and TAR archives. Free alternative to ezyZip, Archive Extractor, and Unzip-Online.',
    keywords: ['extract zip file', 'rar extractor', 'unzip files online', '7z extractor', 'free archive unpacker', 'ezyzip extract alternative', 'archive extractor alternative', 'unzip-online alternative'],
  },

  // ── Utility Tools ──
  'utility/seo-generator': {
    title: 'SEO Meta Tag & robots.txt Generator Free | AnyFormat',
    description: 'Generate optimized HTML meta tags, OpenGraph, Twitter cards, and robots.txt. Free alternative to Metatags.io and SEOptimer.',
    keywords: ['seo generator', 'meta tag generator', 'robots.txt creator', 'generate meta tags', 'seo tool', 'metatags.io alternative', 'seoptimer alternative'],
  },
  'utility/link-shortener': {
    title: 'Self-Hosted Link Shortener Free - Short URLs | AnyFormat',
    description: 'Create custom short URLs securely. Free alternative to Bitly, TinyURL, and Rebrandly link shortener.',
    keywords: ['link shortener', 'short url generator', 'custom alias link', 'free URL shortener', 'shorten links', 'bitly alternative', 'tinyurl alternative', 'rebrandly alternative'],
  },

  // ── Additional Image Tools ──
  'image/crop': {
    title: 'Crop Image Online Free - Pixel-Precise Image Cropper | AnyFormat',
    description: 'Crop images to exact dimensions with pixel-precise control. Free alternative to iLoveIMG, Fotor, and Canva image cropper.',
    keywords: ['crop image', 'image cropper online', 'crop photo free', 'pixel crop tool', 'iloveimg crop alternative', 'fotor crop alternative'],
  },
  'image/upscale': {
    title: 'Upscale Image Online Free - AI Image Upscaler | AnyFormat',
    description: 'Upscale images to higher resolution using advanced interpolation. Free alternative to Let\'s Enhance, Upscale.media, and Bigjpg.',
    keywords: ['upscale image', 'image upscaler', 'increase image resolution', 'ai upscale photo', 'letsenhance alternative', 'bigjpg alternative', 'upscale.media alternative'],
  },

  // ── Additional Video Tools ──
  'video/trim': {
    title: 'Trim Video Online Free - Cut Video Clips | AnyFormat',
    description: 'Trim videos by specifying start and end timestamps. Free alternative to Kapwing, Clideo, and FlexClip video trimmer.',
    keywords: ['trim video', 'cut video online', 'video trimmer free', 'clip video', 'kapwing trim alternative', 'clideo trim alternative', 'flexclip alternative'],
  },

  // ── Additional Audio Tools ──
  'audio/compress': {
    title: 'Compress Audio Online Free - Reduce Audio File Size | AnyFormat',
    description: 'Compress audio files by reducing bitrate while maintaining quality. Free alternative to Online Audio Converter and MP3Smaller.',
    keywords: ['compress audio', 'reduce audio file size', 'audio compressor online', 'shrink mp3', 'mp3smaller alternative', 'compress mp3 free'],
  },

  // ── Additional Utility Tools ──
  'utility/json-csv': {
    title: 'JSON to CSV Converter Online Free | AnyFormat',
    description: 'Convert between JSON and CSV formats instantly. Free alternative to ConvertCSV, JSON-CSV.com, and TableConvert.',
    keywords: ['json to csv', 'csv to json', 'json csv converter', 'convert json to csv online', 'convertcsv alternative', 'tableconvert alternative'],
  },
  'utility/base64': {
    title: 'Base64 Encoder/Decoder Online Free | AnyFormat',
    description: 'Encode or decode text and files to/from Base64 instantly. Free alternative to Base64Encode.org and Base64Decode.org.',
    keywords: ['base64 encoder', 'base64 decoder', 'encode base64 online', 'decode base64', 'base64encode.org alternative'],
  },
};

export function getToolSeoMetadata(category: string, toolSlug: string): ToolSeoInfo | null {
  const key = `${category}/${toolSlug}`;
  return SEO_METADATA_REGISTRY[key] || null;
}
