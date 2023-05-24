import { NextFunction, Request, Response } from "express";

export const LogRequest = (req: Request, res: Response, next: NextFunction) => {
  const { method, originalUrl, ip, query, body } = req;
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} ${originalUrl} from ${ip}`);
  console.log("Query Parameters:", query);
  console.log("Request Body:", body);
  next();
};

export const errorHandler = (
  err: { message: string },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error
  console.error("Error:", err);

  // Set the response status code
  res.status(500);

  // Return the error message as the response
  res.json({
    error: err.message || "Internal Server Error",
  });
};
