import { NextFunction, Request, Response } from 'express';

/**
 * Not found middleware
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {NextFunction} next - Next function
 * @returns {void}
 */
export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);

  // Ressource not found
  const error = new Error('Ressource not found');

  next(error);
}

export default notFound;
