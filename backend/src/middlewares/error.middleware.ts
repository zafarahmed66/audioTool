import { NextFunction, Request, Response } from "express";

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  errors?: any;
}

const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    try {
        let error: CustomError = { ...err };
    
        error.message = err.message;
    
        console.error("middleware error", err);
    
        res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Server Error' });
      } catch (error) {
        next(error);
      }
};

export default errorMiddleware;