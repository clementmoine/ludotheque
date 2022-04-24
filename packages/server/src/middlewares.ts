import fs from 'fs';
import path from 'path';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { getFileExtension, removeUploadedFile } from 'utils/file';

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

// Note found middleware
export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);

  // Ressource not found
  const error = new Error('Ressource not found');

  next(error);
}

// Authentication middleware
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401);

    throw new Error('Unauthorized, Authorization header is missing.');
  }

  try {
    // Parse the bearer token
    const token = authorization.match(/^Bearer (.*)$/)?.pop();

    if (!token) {
      res.status(401);

      throw new Error('Unauthorized, Authorization header is malformed.');
    }

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);

    req.user = payload;
  } catch (err) {
    res.status(401);

    if (err instanceof Error) {
      if (err.name === 'TokenExpiredError') {
        throw new Error(err.name);
      }
    }

    throw new Error('Unauthorized');
  }

  return next();
}

// Error handler middleware
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  // If a file was uploaded, remove it
  if (req.file) {
    removeUploadedFile(req.file.filename);
  }

  // If some files were uploaded, remove them
  if (req.files) {
    const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();

    files.forEach((file) => {
      removeUploadedFile(file.filename);
    });
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode);

  res.json(
    process.env.NODE_ENV === 'development'
      ? {
          message: err.message,
          stack: err.stack,
        }
      : {
          message: err.message,
        }
  );

  next();
}

export default {
  upload,
  notFound,
  errorHandler,
  isAuthenticated,
};
