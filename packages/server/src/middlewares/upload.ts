import fs from 'fs';
import path from 'path';
import multer from 'multer';

import { getFileExtension } from 'utils/file';

// Upload middleware
export const upload = multer({
  storage: multer.diskStorage({
    destination: function (_, __, cb) {
      const dir = path.join(process.cwd(), process.env.UPLOAD_DIR ?? '/public/uploads');

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      cb(null, dir);
    },
    filename: function (_, file, cb) {
      const extension = getFileExtension(file.originalname);

      cb(null, `${Date.now()}.${extension}`);
    },
  }),
});

export default upload;
