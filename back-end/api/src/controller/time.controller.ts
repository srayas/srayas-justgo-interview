import { Request, Response } from 'express';

export const getTime = (req: Request, res: Response) => {
  res.json({ currentTime: new Date().toISOString() });
};
