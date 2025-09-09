import type { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.header("x-user-id");
  if (!userId || typeof userId !== "string") {
    return res.status(401).json({ message: "Unauthorized: User ID missing" });
  }
  req.user = { userId };
  next();
};
