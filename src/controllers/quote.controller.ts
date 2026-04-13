// src/controllers/quote.controller.ts
import { Request, Response, NextFunction } from 'express';
import quoteService from '../services/quote.service';

export const calculateQuote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quote = await quoteService.calculateQuote(req.body);
    res.status(201).json(quote);
  } catch (error) {
    next(error);
  }
};

export const getQuote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const quote = await quoteService.getQuoteById(id);
    res.json(quote);
  } catch (error) {
    next(error);
  }
};

export const listQuotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await quoteService.listQuotes(req.query as any);
    res.json(result);
  } catch (error) {
    next(error);
  }
};