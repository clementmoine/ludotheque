import fs from 'fs';
import path from 'path';

export function getFileExtension(fileName: string) {
  return fileName.split('.').pop();
}

export function removeUploadedFile(fileName: string) {
  if (!fileName) return;

  const filePath = path.join(process.cwd(), `/public/uploads/${fileName}`);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
