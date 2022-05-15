import { Request, Response, NextFunction } from 'express';

import { removeUploadedFile } from 'utils/file';

/**
 * Error handler middleware
 * @param {Error} err - Error object
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {NextFunction} next - Next function
 * @returns {void}
 * @see {@link https://expressjs.com/en/guide/error-handling.html}
 */
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
          status: 'error',
          message: err.message,
          stack: err.stack,
        }
      : {
          status: 'error',
          message: err.message,
        }
  );

  next();
}

export default errorHandler;
